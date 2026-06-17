import { useState, useMemo, type ReactNode } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import { Slider } from '@/components/ui/slider';
import {
  defaultConfig,
  valueIterationStep,
  extractPolicy,
  indexToState,
  isTerminal,
  ACTIONS,
} from './GridWorld';

export default function MDPPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十五章 · 强化学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">马尔可夫决策过程</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          强化学习研究如何在环境中通过试错来学习最优决策。马尔可夫决策过程（MDP）
          为这类问题提供了形式化的数学框架。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">MDP 的组成</h2>
        </div>
        <p className="text-gray-700 mb-4">
          一个有限状态 MDP 由以下五元组描述：
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li><strong>状态集合 S：</strong>环境可能处于的所有状态。</li>
          <li><strong>动作集合 A：</strong>智能体在每个状态下可以采取的动作。</li>
          <li><strong>转移概率 <KaTeX math={String.raw`P(s'|s,a)`} />：</strong>在状态 s 采取动作 a 后转移到下一状态 s' 的概率。</li>
          <li><strong>奖励函数 R(s,a) 或 R(s,a,s')：</strong>智能体执行动作或发生转移后获得的即时奖励。</li>
          <li><strong>折扣因子 γ ∈ [0, 1)：</strong>未来奖励的衰减系数。</li>
        </ul>
        <p className="text-gray-700">
          在每个时间步，智能体观察当前状态 s，选择动作 a，环境根据 <KaTeX math={String.raw`P(s'|s,a)`} /> 转移到下一状态 s'，并返回奖励 R(s,a)（或更一般地 R(s,a,s')）。
          智能体的目标是最大化累积折扣奖励的期望。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">策略与价值函数</h2>
        <p className="text-gray-700 mb-4">
          策略描述智能体在每个状态如何选择动作。为简化起见，可以先考虑确定性策略 π(s) ∈ A；更一般地，随机策略写作 π(a|s)，表示在状态 s 下选择动作 a 的概率。给定策略 π，其价值函数 V^π(s) 表示从状态 s 出发、按 π 行动所获得的期望累积折扣奖励：
        </p>
        <FormulaCard
          title="策略价值函数"
          formula={
            <KaTeX
              math={String.raw`V^\pi(s) = \mathbb{E}\left[ R(s_0) + \gamma R(s_1) + \gamma^2 R(s_2) + \cdots \mid s_0 = s, \pi \right]`}
              display
            />
          }
          description="折扣因子 γ 让越早获得的奖励越重要。"
        />
        <p className="text-gray-700 mt-4 mb-4">
          V^π 满足 Bellman 方程：
        </p>
        <FormulaCard
          title="策略 Bellman 方程"
          formula={
            <KaTeX
              math={String.raw`V^\pi(s) = R(s) + \gamma \sum_{s' \in S} P\bigl(s'|s,\pi(s)\bigr) V^\pi(s')`}
              display
            />
          }
          description="当前状态的值等于即时奖励加上下一状态值的期望折扣。"
        />
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">最优价值函数与最优策略</h2>
        <p className="text-gray-700 mb-4">
          最优价值函数 V* 是所有策略中价值最大的函数：
        </p>
        <FormulaCard
          title="最优 Bellman 方程"
          formula={
            <KaTeX
              math={String.raw`V^*(s) = R(s) + \gamma \max_{a \in A} \sum_{s' \in S} P(s'|s,a) V^*(s')`}
              display
            />
          }
          description="在每个状态下选择使期望未来值最大的动作。"
        />
        <p className="text-gray-700 mt-4">
          一旦求得 V*，最优策略 π* 就可以通过在每个状态选择使上式右边最大的动作得到。
          有趣的是，同一个最优策略对所有初始状态都是最优的。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：网格世界 MDP</h2>
        <p className="text-gray-700 mb-4">
          下图是一个简单的网格世界。绿色目标格奖励 +1，红色陷阱格奖励 -1，黑色格子是障碍物。
          调整折扣因子 γ，观察最优价值函数和贪婪策略的变化。γ 越大，智能体越看重未来奖励。
        </p>
        <MDPDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>MDP 由状态、动作、转移概率、奖励和折扣因子组成。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>策略价值函数 V^π 描述按固定策略行动的期望累积奖励。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>最优价值函数 V* 和最优策略 π* 通过 Bellman 最优方程联系。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function MDPDemo() {
  const [config, setConfig] = useState(defaultConfig());
  const [iterations, setIterations] = useState(0);
  const [V, setV] = useState<number[]>(() => new Array(config.rows * config.cols).fill(0));

  const policy = useMemo(() => extractPolicy(V, config), [V, config]);

  const runValueIteration = (steps: number) => {
    setV((currentV) => {
      let v = currentV;
      for (let i = 0; i < steps; i++) {
        v = valueIterationStep(v, config);
      }
      return v;
    });
    setIterations((it) => it + steps);
  };

  const reset = () => {
    setV(new Array(config.rows * config.cols).fill(0));
    setIterations(0);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <ControlRow label={`折扣因子 γ: ${config.gamma.toFixed(2)}`}>
          <Slider
            value={[config.gamma]}
            min={0}
            max={0.99}
            step={0.01}
            onValueChange={(v) => {
              setConfig((c) => ({ ...c, gamma: v[0] }));
              reset();
            }}
          />
        </ControlRow>
        <ControlRow label={`滑动概率: ${config.slipProb.toFixed(2)}`}>
          <Slider
            value={[config.slipProb]}
            min={0}
            max={0.5}
            step={0.05}
            onValueChange={(v) => {
              setConfig((c) => ({ ...c, slipProb: v[0] }));
              reset();
            }}
          />
        </ControlRow>
        <div className="flex items-end gap-2">
          <button
            onClick={() => runValueIteration(1)}
            className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            值迭代一步
          </button>
          <button
            onClick={() => runValueIteration(10)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            迭代 10 步
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            重置
          </button>
        </div>
      </div>

      <GridWorld config={config} V={V} policy={policy} />

      <div className="text-sm text-gray-600">
        已迭代步数: <span className="font-mono font-medium text-blue-700">{iterations}</span>
      </div>
    </div>
  );
}

function GridWorld({ config, V, policy }: { config: ReturnType<typeof defaultConfig>; V: number[]; policy: number[] }) {
  const cellSize = 72;
  const width = config.cols * cellSize;
  const height = config.rows * cellSize;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[300px]" style={{ maxHeight: 360 }}>
        {Array.from({ length: config.rows * config.cols }).map((_, idx) => {
          const pos = indexToState(idx, config.cols);
          const x = pos.c * cellSize;
          const y = pos.r * cellSize;
          const isGoal = pos.r === config.goal.r && pos.c === config.goal.c;
          const isTrap = config.traps.some((t) => t.r === pos.r && t.c === pos.c);
          const isObs = config.obstacles.some((o) => o.r === pos.r && o.c === pos.c);
          const isStart = pos.r === config.start.r && pos.c === config.start.c;

          let fill = '#ffffff';
          if (isGoal) fill = '#d1fae5';
          else if (isTrap) fill = '#fee2e2';
          else if (isObs) fill = '#374151';

          return (
            <g key={idx}>
              <rect x={x} y={y} width={cellSize} height={cellSize} fill={fill} stroke="#d1d5db" strokeWidth={1} />
              {!isObs && (
                <text x={x + cellSize / 2} y={y + cellSize / 2 + 4} textAnchor="middle" fontSize={13} fill="#1f2937">
                  {V[idx].toFixed(2)}
                </text>
              )}
              {isStart && (
                <text x={x + cellSize / 2} y={y + cellSize - 8} textAnchor="middle" fontSize={10} fill="#2563eb">
                  起点
                </text>
              )}
              {!isObs && !isTerminal(idx, config) && policy[idx] >= 0 && (
                <Arrow x={x + cellSize / 2} y={y + cellSize / 2} actionIdx={policy[idx]} size={18} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Arrow({ x, y, actionIdx, size }: { x: number; y: number; actionIdx: number; size: number }) {
  const action = ACTIONS[actionIdx];
  const dx = action.dc * size;
  const dy = action.dr * size;
  return (
    <line
      x1={x - dx * 0.4}
      y1={y - dy * 0.4}
      x2={x + dx * 0.4}
      y2={y + dy * 0.4}
      stroke="#2563eb"
      strokeWidth={3}
      markerEnd="url(#arrow-blue)"
    />
  );
}

function ControlRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
