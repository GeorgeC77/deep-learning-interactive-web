import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  eig2x2,
  sampleCovariance,
  ppcaClosedFormML,
  posteriorReconstruction,
  pcaOrthogonalProjection,
} from '../lib/math/ppca';
import { buildUNetStages, checkSkipCompatibility, computeOutputCrop } from '../lib/math/unet';
import { softNms } from '../lib/math/iouNms';
import PredictionGate from '../components/PredictionGate';
import PPCAELBODemo from '../components/demos/PPCAELBODemo';
import UnetDemo from '../components/demos/UnetDemo';
import IoUNMSDemo from '../components/demos/IoUNMSDemo';
import DiscreteLatentELBODemo from '../components/demos/DiscreteLatentELBODemo';

function norm(v: number[]): number {
  return Math.hypot(v[0], v[1]);
}

afterEach(() => {
  cleanup();
});

describe('pedagogical invariants: fourth batch', () => {
  /* ---------------------------------------------------------------------- */
  /* PPCA stable eig2x2 and posterior semantics                             */
  /* ---------------------------------------------------------------------- */
  it('PPCA: stable eig2x2 handles diagonal covariance matrices', () => {
    const diag41 = eig2x2([
      [4, 0],
      [0, 1],
    ]);
    expect(diag41.eigenvalues[0]).toBeCloseTo(4, 10);
    expect(diag41.eigenvalues[1]).toBeCloseTo(1, 10);
    expect(norm(diag41.eigenvectors[0])).toBeCloseTo(1, 10);
    expect(norm(diag41.eigenvectors[1])).toBeCloseTo(1, 10);

    const diag14 = eig2x2([
      [1, 0],
      [0, 4],
    ]);
    expect(diag14.eigenvalues[0]).toBeCloseTo(4, 10);
    expect(diag14.eigenvalues[1]).toBeCloseTo(1, 10);
    expect(norm(diag14.eigenvectors[0])).toBeCloseTo(1, 10);
    expect(norm(diag14.eigenvectors[1])).toBeCloseTo(1, 10);

    for (const v of diag41.eigenvectors) {
      expect(norm(v)).toBeGreaterThan(0.99);
    }
    for (const v of diag14.eigenvectors) {
      expect(norm(v)).toBeGreaterThan(0.99);
    }
  });

  it('PPCA: posterior reconstruction differs from PCA orthogonal projection when sigma2 > 0', () => {
    const data = [
      [1, 2],
      [2, 3.5],
      [0.5, 1.2],
      [3, 5],
      [-1, -1.8],
    ];
    const mean = [data.reduce((s, p) => s + p[0], 0) / data.length, data.reduce((s, p) => s + p[1], 0) / data.length];
    const centered = data.map((p) => [p[0] - mean[0], p[1] - mean[1]]);
    const S = sampleCovariance(centered);
    const { eigenvectors } = eig2x2(S);
    const ml = ppcaClosedFormML(S, 1);
    const x = data[0];
    const ppcaRec = posteriorReconstruction(x, ml.Wml, ml.sigma2ml, mean);
    const pcaRec = pcaOrthogonalProjection(x, eigenvectors, 1, mean);
    expect(Math.hypot(ppcaRec[0] - pcaRec[0], ppcaRec[1] - pcaRec[1])).toBeGreaterThan(1e-6);
  });

  it('PPCA demo page does not show the incorrect E[x|x] formula', () => {
    const { container } = render(<PPCAELBODemo />);
    expect(container.textContent).not.toContain('E[x|x]');
    expect(container.textContent).toContain('后验均值在隐空间为');
  });

  it('PPCA demo explains the M=0 isotropic baseline', () => {
    const { container } = render(<PPCAELBODemo initialM={0} />);
    expect(container.textContent).toContain('M = 0 基准');
    expect(container.textContent).toContain('重构退化为数据均值');
  });

  it('PPCA demo formula includes the orthogonal rotation R', () => {
    const { container } = render(<PPCAELBODemo />);
    expect(container.textContent).toContain('W_ML = U_M (Λ_M − σ²_ML I)');
    expect(container.textContent).toContain('R');
    expect(container.textContent).toContain('R = I');
    expect(container.textContent).toContain('代表');
  });

  /* ---------------------------------------------------------------------- */
  /* U-Net layout and real skip compatibility                               */
  /* ---------------------------------------------------------------------- */
  it('U-Net: same-resolution encoder and decoder stages share the same centre y-coordinate', () => {
    const stages = buildUNetStages(256, 4, 64, 2);
    for (const stage of stages) {
      const encCY = stage.encoderPosition.y + stage.encoderPosition.h / 2;
      const decCY = stage.decoderPosition.y + stage.decoderPosition.h / 2;
      expect(encCY).toBeCloseTo(decCY, 10);
    }
  });

  it('U-Net: skip compatibility compares real encoder and decoder spatial dimensions', () => {
    const stages = buildUNetStages(256, 3, 64, 2);
    for (const stage of stages) {
      expect(checkSkipCompatibility(stage)).toBe(true);
      expect(stage.encoderSpatial).toEqual(stage.decoderSpatial);
    }

    const mismatched = {
      ...stages[0],
      decoderSpatial: [stages[0].decoderSpatial[0] + 2, stages[0].decoderSpatial[1]] as [number, number],
    };
    expect(checkSkipCompatibility(mismatched)).toBe(false);
  });

  it('U-Net demo warns about non-aligned input presets', () => {
    render(<UnetDemo />);
    const preset255 = screen.getByRole('button', { name: '255' });
    fireEvent.click(preset255);
    expect(screen.getByText(/输入对齐检查/)).toBeTruthy();
    expect(screen.getByText(/需要填充到/)).toBeTruthy();
  });

  it('U-Net final displayed output size matches crop result', () => {
    const inputSize = 255;
    const paddedSize = 256;
    const crop = computeOutputCrop(inputSize, paddedSize);
    expect(crop.finalHeight).toBe(inputSize);
    expect(crop.finalWidth).toBe(inputSize);
  });

  /* ---------------------------------------------------------------------- */
  /* PredictionGate controlled flow and evaluation                          */
  /* ---------------------------------------------------------------------- */
  it('PredictionGate cannot reveal before submit', () => {
    const { container } = render(
      <PredictionGate
        resetKey={1}
        prediction=""
        onPredictionChange={vi.fn()}
        submitted={false}
        onSubmit={vi.fn()}
        revealed={false}
        onReveal={vi.fn()}
        canReveal={false}
        question="What is the answer?"
        revealContent={<div data-testid="answer">The answer</div>}
      />,
    );

    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    expect(revealButton).not.toBeNull();
    expect(revealButton.disabled).toBe(true);
    expect(container.querySelector('[data-testid="answer"]')).toBeNull();
  });

  it('PredictionGate reveals only after submit and calls onReveal', () => {
    const onReveal = vi.fn();
    const { container } = render(
      <PredictionGate
        resetKey={1}
        prediction="my guess"
        onPredictionChange={vi.fn()}
        submitted={true}
        onSubmit={vi.fn()}
        revealed={false}
        onReveal={onReveal}
        canReveal={true}
        question="What is the answer?"
        revealContent={<div data-testid="answer">The answer</div>}
      />,
    );

    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    expect(revealButton.disabled).toBe(false);
    fireEvent.click(revealButton);
    expect(onReveal).toHaveBeenCalledTimes(1);
  });

  it('PredictionGate resets prediction when resetKey changes', () => {
    const onPredictionChange = vi.fn();
    const { rerender } = render(
      <PredictionGate
        resetKey={1}
        prediction="first"
        onPredictionChange={onPredictionChange}
        submitted={false}
        onSubmit={vi.fn()}
        revealed={false}
        onReveal={vi.fn()}
        canReveal={false}
        question="Q1"
        revealContent={<div>answer</div>}
      />,
    );

    rerender(
      <PredictionGate
        resetKey={2}
        prediction="first"
        onPredictionChange={onPredictionChange}
        submitted={false}
        onSubmit={vi.fn()}
        revealed={false}
        onReveal={vi.fn()}
        canReveal={false}
        question="Q2"
        revealContent={<div>answer</div>}
      />,
    );

    expect(onPredictionChange).toHaveBeenLastCalledWith('');
  });

  it('PredictionGate renders evaluation feedback only when evaluatePrediction is provided and revealed', () => {
    const evaluate = vi.fn(() => ({ correct: true, feedback: 'Great!' }));
    const { container, rerender } = render(
      <PredictionGate
        resetKey={1}
        prediction="guess"
        onPredictionChange={vi.fn()}
        submitted={true}
        onSubmit={vi.fn()}
        revealed={false}
        onReveal={vi.fn()}
        canReveal={true}
        question="Q"
        revealContent={<div>answer</div>}
        evaluatePrediction={evaluate}
      />,
    );

    expect(container.querySelector('[data-testid="evaluation-feedback"]')).toBeNull();

    rerender(
      <PredictionGate
        resetKey={1}
        prediction="guess"
        onPredictionChange={vi.fn()}
        submitted={true}
        onSubmit={vi.fn()}
        revealed={true}
        onReveal={vi.fn()}
        canReveal={true}
        question="Q"
        revealContent={<div>answer</div>}
        evaluatePrediction={evaluate}
      />,
    );

    expect(container.querySelector('[data-testid="evaluation-feedback"]')).not.toBeNull();
    expect(evaluate).toHaveBeenCalledWith('guess');
  });

  /* ---------------------------------------------------------------------- */
  /* Discrete ELBO integration tests                                        */
  /* ---------------------------------------------------------------------- */
  it('DiscreteLatentELBODemo: posterior is hidden initially', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    expect(container.textContent).not.toContain('真实后验');
  });

  it('DiscreteLatentELBODemo: reveal is disabled before submit', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    expect(revealButton.disabled).toBe(true);
  });

  it('DiscreteLatentELBODemo: prediction and q are locked after submit', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    const radios = container.querySelectorAll('button[role="radio"]');
    expect(radios.length).toBeGreaterThan(0);
    fireEvent.click(radios[0]);

    const submitButton = container.querySelector('button.bg-violet-600') as HTMLButtonElement;
    fireEvent.click(submitButton);

    // After submit, radios are disabled.
    expect(radios[0].hasAttribute('disabled')).toBe(true);
    // q sliders are disabled (Radix may expose data-disabled or aria-disabled).
    // sliders[0] is the sample selector; q sliders start at index 1.
    const sliders = container.querySelectorAll('[data-slot="slider-thumb"]');
    expect(sliders.length).toBeGreaterThanOrEqual(2);
    const qThumb = sliders[1] as HTMLElement;
    expect(
      qThumb.hasAttribute('aria-disabled') ||
        qThumb.hasAttribute('data-disabled') ||
        qThumb.hasAttribute('disabled'),
    ).toBe(true);
  });

  it('DiscreteLatentELBODemo: reveal shows posterior and correctness feedback', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    const radios = container.querySelectorAll('button[role="radio"]');
    fireEvent.click(radios[0]);

    const submitButton = container.querySelector('button.bg-violet-600') as HTMLButtonElement;
    fireEvent.click(submitButton);

    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    expect(revealButton.disabled).toBe(false);
    fireEvent.click(revealButton);

    expect(container.textContent).toContain('真实后验');
    expect(container.querySelector('[data-testid="evaluation-feedback"]')).not.toBeNull();
  });

  it('DiscreteLatentELBODemo: setting q to posterior gives near-zero KL', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    const radios = container.querySelectorAll('button[role="radio"]');
    fireEvent.click(radios[0]);

    const submitButton = container.querySelector('button.bg-violet-600') as HTMLButtonElement;
    fireEvent.click(submitButton);

    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    fireEvent.click(revealButton);

    const setPosteriorButton = screen.getByRole('button', { name: /令 q = 真实后验/ });
    fireEvent.click(setPosteriorButton);

    expect(container.textContent).toContain('KL(q||p)');
    // The KL metric box should show a value very close to 0.
    const klLabel = screen.getByText('KL(q||p)');
    const valueEl = klLabel.parentElement?.querySelector('.text-lg');
    expect(valueEl?.textContent).toMatch(/0\.000|—/);
  });

  it('DiscreteLatentELBODemo: changing sample resets prediction, q, reveal and hint', () => {
    const { container } = render(<DiscreteLatentELBODemo />);
    const radios = container.querySelectorAll('button[role="radio"]');
    fireEvent.click(radios[0]);

    const submitButton = container.querySelector('button.bg-violet-600') as HTMLButtonElement;
    fireEvent.click(submitButton);

    const revealButton = container.querySelector('button.bg-emerald-600') as HTMLButtonElement;
    fireEvent.click(revealButton);

    expect(container.textContent).toContain('真实后验');

    // Change sample using the sample slider (first slider).
    const sampleSlider = container.querySelectorAll('[data-slot="slider-thumb"]')[0];
    fireEvent.keyDown(sampleSlider, { key: 'ArrowRight' });

    // After sample change the reveal area should be gone.
    expect(container.textContent).not.toContain('真实后验');
  });

  /* ---------------------------------------------------------------------- */
  /* Soft-NMS dynamic reselection and class semantics                       */
  /* ---------------------------------------------------------------------- */
  it('Soft-NMS dynamically reselects the maximum from updated scores', () => {
    const boxes = [
      { id: 1, x: 0, y: 0, w: 100, h: 100, score: 0.95, classId: 0 },
      { id: 2, x: 10, y: 10, w: 100, h: 100, score: 0.9, classId: 0 },
      { id: 3, x: 200, y: 200, w: 100, h: 100, score: 0.85, classId: 0 },
    ];

    const result = softNms(boxes, 0.1, 'class-agnostic', 0.0);
    expect(result.selectedOrder[0]).toBe(1);
    expect(result.selectedOrder[1]).toBe(3);
    expect(result.selectedOrder[2]).toBe(2);
  });

  it('Soft-NMS class-aware mode does not decay boxes across classes', () => {
    const boxes = [
      { id: 1, x: 0, y: 0, w: 10, h: 10, score: 0.9, classId: 0 },
      { id: 2, x: 2, y: 2, w: 10, h: 10, score: 0.85, classId: 1 },
    ];

    const aware = softNms(boxes, 0.1, 'class-aware', 0.0);
    expect(aware.finalScores.get(2)).toBeCloseTo(0.85, 10);

    const agnostic = softNms(boxes, 0.1, 'class-agnostic', 0.0);
    expect((agnostic.finalScores.get(2) ?? 1)).toBeLessThan(0.85);
  });

  /* ---------------------------------------------------------------------- */
  /* Linked-view consistency tests                                          */
  /* ---------------------------------------------------------------------- */
  it('IoUNMSDemo Soft-NMS canvas colours derive from softResult, not hard result', () => {
    const { container } = render(<IoUNMSDemo />);
    const softRadio = screen.getByRole('radio', { name: 'Soft-NMS' });
    fireEvent.click(softRadio);

    const nmsCanvas = container.querySelector('[data-testid="nms-canvas"]')!;

    // In Soft-NMS mode there should be no red strokes (hard-suppressed colour).
    const redRects = nmsCanvas.querySelectorAll('rect[stroke="#dc2626"]');
    expect(redRects.length).toBe(0);

    // There should be green selected boxes.
    const greenRects = nmsCanvas.querySelectorAll('rect[stroke="#059669"]');
    expect(greenRects.length).toBeGreaterThan(0);
  });

  it('IoUNMSDemo Hard-NMS canvas colours derive from hard result', () => {
    const { container } = render(<IoUNMSDemo />);
    const hardRadio = screen.getByRole('radio', { name: 'Hard-NMS' });
    fireEvent.click(hardRadio);

    const nmsCanvas = container.querySelector('[data-testid="nms-canvas"]')!;

    // Hard mode uses green for kept and red for suppressed.
    const hasGreen = nmsCanvas.querySelectorAll('rect[stroke="#059669"]').length > 0;
    const hasRed = nmsCanvas.querySelectorAll('rect[stroke="#dc2626"]').length > 0;
    expect(hasGreen || hasRed).toBe(true);
  });
});
