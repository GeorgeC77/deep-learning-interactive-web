import { useState, useMemo } from 'react';
import { ShieldAlert, Activity, CheckCircle2, RefreshCw, Play , Circle} from 'lucide-react';
import KaTeX from '@/components/KaTeX';
import FormulaCard from '@/components/FormulaCard';
import {
  defaultConfig,
  extractPolicy,
  simulateTrajectory,
  indexToState,
  isTerminal,
  isObstacle,
  rewardOf,
  ACTIONS,
  type GridWorldConfig,
} from './GridWorld';

export default function LearningMDPPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="text-sm font-medium text-blue-600 mb-2 tracking-wide uppercase">
          第十五章 · 强化学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">学习 MDP 模型</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4">
          很多实际问题中，状态转移概率和奖励函数并非已知。本节介绍如何从智能体与环境的交互经验中估计这些量，
          然后用估计出的模型求解最优策略。
        </p>

        <p className="mt-6 text-sm text-amber-700 flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> 本内容仅供教学与非商业学习使用，完整授权说明见页脚。</p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">从经验中学习模型</h2>
        </div>
        <p className="text-gray-700 mb-4">
          假设我们已经知道状态空间 S、动作空间 A 和折扣因子 γ，但不知道转移概率 P(s'|s,a) 和奖励函数 R(s,a)（或更一般地 R(s,a,s')）。
          我们可以通过让智能体执行若干条轨迹（trials）来收集经验：
        </p>
        <div className="my-4">
          <KaTeX
            math={String.raw`s_0^{(j)} \xrightarrow{a_0^{(j)}} s_1^{(j)} \xrightarrow{a_1^{(j)}} s_2^{(j)} \xrightarrow{a_2^{(j)}} \cdots`}
            display
          />
        </div>
        <p className="text-gray-700 mb-4">
          基于这些经验，可以用最大似然估计转移概率。对于每个 (s, a, s') 三元组，统计在状态 s 采取动作 a 后到达 s' 的次数：
        </p>
        <FormulaCard
          title="转移概率的最大似然估计"
          formula={
            <KaTeX
              math={String.raw`\hat{P}(s'|s,a) = \frac{\#\{(s, a, s')\}}{\#\{(s, a)\}}`}
              display
            />
          }
          description="若从未在状态 s 采取过动作 a，则可将其估计为均匀分布。"
        />
        <p className="text-gray-700 mt-4">
          一般情形下，奖励 R(s,a) 或 R(s,a,s') 可估计为对应状态-动作（或状态-动作-下一状态）上观察到的平均奖励。本演示为简化，使用状态奖励 R(s)；一般情形下奖励可依赖于状态、动作和下一状态。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">模型学习与值迭代结合的算法</h2>
        <p className="text-gray-700 mb-4">
          一种简单的做法是把模型学习和规划交替进行：
        </p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li>随机初始化策略 π。</li>
          <li>在环境中执行 π，收集若干条轨迹。</li>
          <li>用收集到的经验更新 P̂ 和 R̂ 的估计。</li>
          <li>用估计的模型运行值迭代，得到新的价值函数 V。</li>
          <li>更新 π 为关于 V 的贪婪策略。</li>
          <li>重复步骤 2–5 直到收敛。</li>
        </ol>
        <p className="text-gray-700">
          实践中，可以在值迭代时用上一轮得到的 V 作为初始值，从而加快收敛。
        </p>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">连续状态 MDP</h2>
        <p className="text-gray-700 mb-4">
          对于连续状态空间（如自动驾驶汽车的位置、速度、朝向），精确的值迭代不可行。常用方法包括：
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>离散化：</strong>把连续状态空间划分为网格，把问题近似为有限状态 MDP。缺点是维度灾难。</li>
          <li><strong>值函数近似：</strong>用神经网络或线性函数直接近似 V*，结合模拟器进行学习。</li>
        </ul>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">交互演示：从轨迹学习</h2>
        <p className="text-gray-700 mb-4">
          下面的演示使用固定策略在网格世界中收集轨迹。每次点击「收集一条轨迹」，系统会根据已有经验估计转移概率和奖励，
          并运行值迭代得到当前策略。观察随着经验增加，学习到的策略如何接近真实最优策略。
        </p>
        <ModelLearningDemo />
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          小结
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>当模型未知时，可以从交互经验中估计转移概率和奖励。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>模型学习与值迭代可以交替进行，逐步改进策略。</span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="w-2 h-2 fill-current text-blue-500 mt-0.5 mt-1" />
            <span>连续状态 MDP 需要离散化或值函数近似。</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function valueIterationFromEstimate(
  V: number[],
  counts: number[][][],
  stateActionCounts: number[][],
  rewardSums: number[],
  config: GridWorldConfig,
): number[] {
  const n = config.rows * config.cols;
  const nextV = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    if (isObstacle(s, config)) {
      nextV[s] = 0;
      continue;
    }
    if (isTerminal(s, config)) {
      nextV[s] = rewardOf(s, config);
      continue;
    }
    const totalVisits = stateActionCounts[s].reduce((sum, c) => sum + c, 0);
    const rHat = totalVisits > 0 ? rewardSums[s] / totalVisits : 0;
    let best = -Infinity;
    for (let a = 0; a < ACTIONS.length; a++) {
      const saCount = stateActionCounts[s][a];
      let q: number;
      if (saCount === 0) {
        // 没有经验时保守估计：保持原地
        q = rHat + config.gamma * V[s];
      } else {
        let exp = 0;
        for (let sNext = 0; sNext < n; sNext++) {
          const c = counts[s][a][sNext];
          if (c > 0) {
            exp += (c / saCount) * V[sNext];
          }
        }
        q = rHat + config.gamma * exp;
      }
      if (q > best) best = q;
    }
    nextV[s] = best === -Infinity ? 0 : best;
  }
  return nextV;
}

function ModelLearningDemo() {
  const config = defaultConfig();
  const nStates = config.rows * config.cols;
  const nActions = ACTIONS.length;

  const [seed, setSeed] = useState(1);
  const [counts, setCounts] = useState<number[][][]>(() =>
    Array.from({ length: nStates }, () => Array.from({ length: nActions }, () => Array(nStates).fill(0)))
  );
  const [rewardSums, setRewardSums] = useState<number[]>(() => Array(nStates).fill(0));
  const [stateActionCounts, setStateActionCounts] = useState<number[][]>(() =>
    Array.from({ length: nStates }, () => Array(nActions).fill(0))
  );
  const [V, setV] = useState<number[]>(() => Array(nStates).fill(0));
  const [trajectories, setTrajectories] = useState<number>(0);

  const policy = useMemo(() => extractPolicy(V, config), [V, config]);

  const collectTrajectory = () => {
    const traj = simulateTrajectory(policy, config, 30, seed + trajectories * 1000);
    const newCounts = counts.map((s) => s.map((a) => [...a]));
    const newRewardSums = [...rewardSums];
    const newStateActionCounts = stateActionCounts.map((s) => [...s]);

    for (let i = 0; i < traj.length - 1; i++) {
      const s = traj[i];
      const a = policy[s];
      const sNext = traj[i + 1];
      const r = rewardOf(s, config);
      newCounts[s][a][sNext] += 1;
      newStateActionCounts[s][a] += 1;
      newRewardSums[s] += r;
    }

    setCounts(newCounts);
    setRewardSums(newRewardSums);
    setStateActionCounts(newStateActionCounts);
    setTrajectories((t) => t + 1);

    // 用估计的模型运行一步值迭代
    setV((current) => valueIterationFromEstimate(current, newCounts, newStateActionCounts, newRewardSums, config));
  };

  const reset = () => {
    setCounts(Array.from({ length: nStates }, () => Array.from({ length: nActions }, () => Array(nStates).fill(0))));
    setRewardSums(Array(nStates).fill(0));
    setStateActionCounts(Array.from({ length: nStates }, () => Array(nActions).fill(0)));
    setV(Array(nStates).fill(0));
    setTrajectories(0);
    setSeed((s) => s + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={collectTrajectory}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          <Play className="w-4 h-4" />
          收集一条轨迹
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          重置
        </button>
      </div>

      <GridWorld config={config} V={V} policy={policy} />

      <div className="text-sm text-gray-600">
        已收集轨迹数: <span className="font-mono font-medium text-blue-700">{trajectories}</span>
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
        <defs>
          <marker id="arrow-blue" markerWidth={10} markerHeight={10} refX={9} refY={3} orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#2563eb" />
          </marker>
        </defs>
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
