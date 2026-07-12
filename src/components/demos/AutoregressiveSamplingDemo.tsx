import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import KaTeX from '@/components/KaTeX';
import {
  type RNG,
  createRng,
  softmax,
  applyTemperature,
  topKFilter,
  nucleusFilter,
  sampleNextToken,
  greedyChoice,
  nextLogits,
  buildToyTransitionMap,
} from '@/lib/math/autoregressive';

const VOCAB = ['猫', '坐', '在', '垫', '子', '上', '跑', '跳', '追', '球', '。'];
const INITIAL_SEQUENCE: string[] = ['猫', '坐'];

type StepResult = {
  newSeq: string[];
  rawProbs: number[];
  samplingProbs: number[];
  eligible: string[];
  chosenToken: string;
  logProb: number;
};

export default function AutoregressiveSamplingDemo() {
  const [mode, setMode] = useState<'greedy' | 'topk' | 'nucleus'>('greedy');
  const [temperature, setTemperature] = useState(1.0);
  const [seed, setSeed] = useState(42);
  const [contextLength, setContextLength] = useState(2);
  const [k, setK] = useState(3);
  const [p, setP] = useState(0.7);

  const [sequence, setSequence] = useState<string[]>(INITIAL_SEQUENCE);
  const [cumLogProb, setCumLogProb] = useState(0);
  const [lastRawProbs, setLastRawProbs] = useState<number[] | null>(null);
  const [lastSamplingProbs, setLastSamplingProbs] = useState<number[] | null>(null);
  const [lastEligible, setLastEligible] = useState<string[] | null>(null);
  const [lastChosen, setLastChosen] = useState<string | null>(null);

  const rngRef = useRef<RNG | null>(null);
  const transitionMap = useMemo(() => buildToyTransitionMap(VOCAB), []);

  useEffect(() => {
    rngRef.current = createRng(seed);
  }, [seed]);

  const takeStep = useCallback(
    (seq: string[], rng: RNG): StepResult => {
      const context = seq.slice(-contextLength);
      const logits = nextLogits(context, VOCAB, transitionMap);
      const tempLogits = applyTemperature(logits, temperature);
      const rawProbs = softmax(tempLogits);

      let samplingProbs: number[];
      let chosenIdx: number;

      if (mode === 'greedy') {
        chosenIdx = greedyChoice(rawProbs);
        samplingProbs = rawProbs.map((_, i) => (i === chosenIdx ? 1 : 0));
      } else if (mode === 'topk') {
        samplingProbs = topKFilter(rawProbs, k);
        chosenIdx = sampleNextToken(samplingProbs, rng);
      } else {
        samplingProbs = nucleusFilter(rawProbs, p);
        chosenIdx = sampleNextToken(samplingProbs, rng);
      }

      const chosenToken = VOCAB[chosenIdx];
      const eligible = VOCAB.filter((_, i) => samplingProbs[i] > 0);
      const logProb = Math.log(rawProbs[chosenIdx]);

      return {
        newSeq: [...seq, chosenToken],
        rawProbs,
        samplingProbs,
        eligible,
        chosenToken,
        logProb,
      };
    },
    [contextLength, mode, k, p, temperature, transitionMap],
  );

  const applyResult = useCallback((res: StepResult) => {
    setSequence(res.newSeq);
    setCumLogProb((prev) => prev + res.logProb);
    setLastRawProbs(res.rawProbs);
    setLastSamplingProbs(res.samplingProbs);
    setLastEligible(res.eligible);
    setLastChosen(res.chosenToken);
  }, []);

  const step = () => {
    if (!rngRef.current) rngRef.current = createRng(seed);
    const res = takeStep(sequence, rngRef.current);
    applyResult(res);
  };

  const reset = () => {
    setSequence(INITIAL_SEQUENCE);
    setCumLogProb(0);
    setLastRawProbs(null);
    setLastSamplingProbs(null);
    setLastEligible(null);
    setLastChosen(null);
    rngRef.current = createRng(seed);
  };

  const runSteps = (n: number) => {
    if (!rngRef.current) rngRef.current = createRng(seed);
    let currentSeq = sequence;
    let currentLogProb = cumLogProb;
    let res: StepResult | undefined;
    for (let i = 0; i < n; i++) {
      res = takeStep(currentSeq, rngRef.current);
      currentSeq = res.newSeq;
      currentLogProb += res.logProb;
    }
    if (res) {
      setSequence(currentSeq);
      setCumLogProb(currentLogProb);
      setLastRawProbs(res.rawProbs);
      setLastSamplingProbs(res.samplingProbs);
      setLastEligible(res.eligible);
      setLastChosen(res.chosenToken);
    }
  };

  return (
    <InteractiveDemo title="自回归采样 (first-order Markov / bigram toy)">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['greedy', 'topk', 'nucleus'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-md text-sm border ${mode === m ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {m === 'greedy' ? 'Greedy' : m === 'topk' ? `Top-k (k=${k})` : `Nucleus (p=${p.toFixed(2)})`}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Temperature τ</span>
              <span>{temperature.toFixed(2)}</span>
            </div>
            <Slider
              value={[temperature]}
              min={0.1}
              max={2.0}
              step={0.1}
              onValueChange={(v) => setTemperature(v[0])}
            />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Random seed</span>
              <span>{seed}</span>
            </div>
            <Slider value={[seed]} min={0} max={1000} step={1} onValueChange={(v) => setSeed(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>Context length L</span>
              <span>{contextLength}</span>
            </div>
            <Slider
              value={[contextLength]}
              min={1}
              max={6}
              step={1}
              onValueChange={(v) => setContextLength(v[0])}
            />
          </div>
        </div>

        {mode === 'topk' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>k</span>
              <span>{k}</span>
            </div>
            <Slider value={[k]} min={1} max={VOCAB.length} step={1} onValueChange={(v) => setK(v[0])} />
          </div>
        )}
        {mode === 'nucleus' && (
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>p</span>
              <span>{p.toFixed(2)}</span>
            </div>
            <Slider value={[p]} min={0.1} max={1} step={0.05} onValueChange={(v) => setP(v[0])} />
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 font-mono text-lg min-h-[3rem] break-words">
          {sequence.join('')}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={step}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            生成下一个 token
          </button>
          <button
            type="button"
            onClick={() => runSteps(10)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            连续生成 10 步
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
          >
            重置
          </button>
        </div>

        {lastRawProbs && lastSamplingProbs && (
          <div className="space-y-2">
            <div className="grid grid-cols-11 gap-1 text-center text-xs">
              {VOCAB.map((t, i) => {
                const isEligible = lastSamplingProbs[i] > 0;
                const isChosen = t === lastChosen;
                return (
                  <div
                    key={t}
                    className={`border rounded p-1 ${isChosen ? 'bg-yellow-100 border-yellow-400' : isEligible ? 'bg-white border-blue-300' : 'bg-gray-100 border-gray-200'}`}
                  >
                    <div className="font-bold">{t}</div>
                    <div className="text-gray-600">{(lastRawProbs[i] * 100).toFixed(0)}%</div>
                    <div className="text-blue-600">{(lastSamplingProbs[i] * 100).toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Eligible set ({mode === 'greedy' ? 'greedy' : mode === 'topk' ? `top-${k}` : `top-p=${p.toFixed(2)}`}):</strong>{' '}
                {lastEligible?.join(' ') ?? '-'}
              </p>
              <p>
                <strong>Chosen token:</strong> {lastChosen ?? '-'}
              </p>
              <p>
                <strong>Cumulative log prob:</strong> {cumLogProb.toFixed(3)}
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Greedy：</strong>每步选概率最大 token，确定性最高。
          </p>
          <p>
            <strong>Top-k：</strong>只在概率最高的 k 个候选中按相对概率采样。
          </p>
          <p>
            <strong>Nucleus (top-p)：</strong>从最小累积概率 ≥ p 的集合中采样，动态调整候选数量。
          </p>
          <p className="text-xs text-gray-500">
            使用相同 seed 时，greedy/top-k/top-p 可能因过滤不同而采到不同 token，导致序列发散。
          </p>
          <KaTeX math={String.raw`p(x_t \mid x_{<t}) = \frac{\exp(z_t / \tau)}{\sum_{t'} \exp(z_{t'} / \tau)}`} />
        </div>
      </div>
    </InteractiveDemo>
  );
}
