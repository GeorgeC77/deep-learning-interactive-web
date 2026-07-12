import { useMemo, useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import KaTeX from '@/components/KaTeX';
import {
  bimodalTarget,
  metropolisHastings,
  computeESS,
  computeACF,
  traceStats,
  modeOccupancy,
  modeSwitches,
  repeatedStatePct,
} from '@/lib/math/mcmc';

const MODES = [-2, 2];

export default function MetropolisHastingsDemo() {
  const [proposalStd, setProposalStd] = useState(1.0);
  const [steps, setSteps] = useState(1000);
  const [burnIn, setBurnIn] = useState(0);
  const [seed, setSeed] = useState(0);

  const chain = useMemo(
    () => metropolisHastings(bimodalTarget, proposalStd, steps, seed, burnIn),
    [proposalStd, steps, burnIn, seed],
  );

  const { samples } = chain;
  const acceptanceRate = chain.accepted / (burnIn + steps);
  const ess = useMemo(() => computeESS(samples), [samples]);
  const occupancy = useMemo(() => modeOccupancy(samples, MODES), [samples]);
  const switches = useMemo(() => modeSwitches(samples, MODES), [samples]);
  const repeatedPct = useMemo(() => repeatedStatePct(samples), [samples]);

  const binWidth = 0.3;
  const histogram = useMemo(() => traceStats(samples, binWidth), [samples]);

  const maxLag = Math.min(60, Math.floor(steps / 4));
  const acf = useMemo(() => computeACF(samples, maxLag), [samples, maxLag]);

  const setPreset = (
    p: number,
    s: number,
    b: number,
  ) => {
    setProposalStd(p);
    setSteps(s);
    setBurnIn(b);
  };

  return (
    <InteractiveDemo title="Metropolis-Hastings 采样器诊断">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Control
              label="提议标准差 σ"
              value={proposalStd.toFixed(2)}
              slider={
                <Slider
                  value={[proposalStd]}
                  min={0.05}
                  max={3}
                  step={0.05}
                  onValueChange={(v) => setProposalStd(v[0])}
                />
              }
            />
            <Control
              label="迭代步数"
              value={String(steps)}
              slider={
                <Slider
                  value={[steps]}
                  min={100}
                  max={3000}
                  step={100}
                  onValueChange={(v) => setSteps(v[0])}
                />
              }
            />
            <Control
              label="Burn-in 步数"
              value={String(burnIn)}
              slider={
                <Slider
                  value={[burnIn]}
                  min={0}
                  max={1000}
                  step={50}
                  onValueChange={(v) => setBurnIn(v[0])}
                />
              }
            />
            <Button
              variant="outline"
              onClick={() => setSeed((s) => s + 1)}
              className="w-full"
            >
              更换随机种子
            </Button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <PresetButton
                label="提议过小"
                onClick={() => setPreset(0.15, 1000, 0)}
              />
              <PresetButton
                label="均衡"
                onClick={() => setPreset(1.0, 1000, 0)}
              />
              <PresetButton
                label="提议过大"
                onClick={() => setPreset(2.5, 1000, 0)}
              />
              <PresetButton
                label="多峰混合差"
                onClick={() => setPreset(0.08, 2000, 0)}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <Metric label="接受率" value={`${(acceptanceRate * 100).toFixed(1)}%`} />
            <Metric label="ESS" value={ess.toFixed(1)} />
            <Metric
              label="Mode occupancy"
              value={occupancy.map((o, i) => `mode ${MODES[i]}: ${(o * 100).toFixed(1)}%`).join(', ')}
            />
            <Metric label="Mode switches" value={String(switches)} />
            <Metric label="重复状态比例" value={`${(repeatedPct * 100).toFixed(1)}%`} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <PlotCard title="目标密度 vs 采样直方图">
            <svg viewBox="0 0 400 160" className="w-full h-40 bg-gray-50 border rounded">
              {targetCurve()}
              {histogram.centers.map((center, i) => {
                if (histogram.maxCount === 0) return null;
                const count = histogram.counts[i];
                const x = xScale(center);
                const h = (count / histogram.maxCount) * 100;
                const w = (binWidth / 12) * 360;
                return (
                  <rect
                    key={i}
                    x={x - w / 2}
                    y={140 - h}
                    width={Math.max(1, w)}
                    height={h}
                    fill="rgba(16,185,129,0.5)"
                  />
                );
              })}
            </svg>
          </PlotCard>

          <PlotCard title="Trace">
            <svg viewBox="0 0 400 160" className="w-full h-40 bg-gray-50 border rounded">
              {samples.length > 0 && (
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  points={samples
                    .map((v, i) => `${traceXScale(i, samples.length)} ${yScale(v)}`)
                    .join(' ')}
                />
              )}
              <line x1={30} y1={yScale(0)} x2={390} y2={yScale(0)} stroke="#9ca3af" strokeDasharray="4" />
            </svg>
          </PlotCard>

          <PlotCard title="ACF">
            <svg viewBox="0 0 400 160" className="w-full h-40 bg-gray-50 border rounded">
              {acf.length > 0 && (
                <>
                  <line
                    x1={30}
                    y1={acfYScale(0)}
                    x2={390}
                    y2={acfYScale(0)}
                    stroke="#9ca3af"
                    strokeDasharray="4"
                  />
                  {acf.map((rho, k) => {
                    if (k === 0) return null;
                    const x = acfXScale(k, acf.length);
                    const y0 = acfYScale(0);
                    const y1 = acfYScale(rho);
                    return (
                      <line
                        key={k}
                        x1={x}
                        y1={y0}
                        x2={x}
                        y2={y1}
                        stroke="#2563eb"
                        strokeWidth={3}
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </PlotCard>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900 space-y-2">
          <p className="font-medium">如何评价 MCMC 采样器？</p>
          <p>
            接受率（acceptance rate）只是表象。 proposal 过小时接受率高但链高度自相关，ESS 很低；
            proposal 过大时接受率低，浪费大量拒绝步。真正应关注：
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>有效样本量 ESS</strong>：ESS 越大，同样长度链提供的信息越多。
            </li>
            <li>
              <strong>自相关函数 ACF</strong>：快速衰减到 0 表示混合良好。
            </li>
            <li>
              <strong>模式覆盖</strong>：双峰目标下，两个 mode 的 occupancy 应接近 50%，mode switch 次数不能过少。
            </li>
          </ul>
          <p>
            重复状态比例反映被拒绝的步数；MH 中拒绝会导致样本重复，但高接受率不等于高质量。
          </p>
          <KaTeX
            math="p(x)=0.5\\mathcal{N}(-2,1)+0.5\\mathcal{N}(2,1),\\quad A(x \\to x')=\\min\\!\\Bigl(1,\\frac{p(x')}{p(x)}\\Bigr)"
          />
        </div>
      </div>
    </InteractiveDemo>
  );
}

function Control({
  label,
  value,
  slider,
}: {
  label: string;
  value: string;
  slider: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      {slider}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick} className="text-xs">
      {label}
    </Button>
  );
}

function PlotCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {children}
    </div>
  );
}

function targetCurve() {
  const maxTarget = bimodalTarget(2);
  const points: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -6 + (i / 200) * 12;
    const y = (bimodalTarget(x) / maxTarget) * 120;
    points.push(`${xScale(x)},${140 - y}`);
  }
  return (
    <polyline
      fill="none"
      stroke="#dc2626"
      strokeWidth={2}
      points={points.join(' ')}
    />
  );
}

function xScale(x: number): number {
  return 20 + ((x + 6) / 12) * 360;
}

function yScale(v: number): number {
  return 140 - ((v + 6) / 12) * 120;
}

function traceXScale(i: number, n: number): number {
  return n <= 1 ? 30 : 30 + (i / (n - 1)) * 360;
}

function acfXScale(k: number, n: number): number {
  return n <= 1 ? 30 : 30 + (k / (n - 1)) * 360;
}

function acfYScale(rho: number): number {
  const minRho = -0.2;
  const maxRho = 1;
  return 140 - ((rho - minRho) / (maxRho - minRho)) * 120;
}
