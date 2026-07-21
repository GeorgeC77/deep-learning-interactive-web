import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';

/**
 * Stylized "why deeper = more abstract" demo.
 * The same input image is pushed through a synthetic hierarchy; each layer
 * re-combines the previous layer's features into a more abstract pattern.
 * This is an illustrative visualization, not a real CNN forward pass.
 */

function InputMap() {
  return (
    <g>
      <rect x="30" y="40" width="100" height="40" rx="8" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="2" />
      <rect x="48" y="24" width="56" height="26" rx="4" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="2" />
      <circle cx="52" cy="84" r="12" fill="#1f2937" />
      <circle cx="108" cy="84" r="12" fill="#1f2937" />
    </g>
  );
}

function EdgesMap() {
  return (
    <g fill="none" stroke="#0ea5e9" strokeWidth="2">
      <rect x="30" y="40" width="100" height="40" rx="8" />
      <rect x="48" y="24" width="56" height="26" rx="4" />
      <circle cx="52" cy="84" r="12" />
      <circle cx="108" cy="84" r="12" />
    </g>
  );
}

function CornersMap() {
  const corners: [number, number][] = [
    [30, 40], [130, 40], [30, 80], [130, 80], [48, 24], [104, 24], [48, 50], [104, 50], [52, 84], [108, 84],
  ];
  return (
    <g>
      <g fill="none" stroke="#e2e8f0" strokeWidth="1">
        <rect x="30" y="40" width="100" height="40" rx="8" />
        <rect x="48" y="24" width="56" height="26" rx="4" />
      </g>
      {corners.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#f59e0b" />
      ))}
    </g>
  );
}

function PartsMap() {
  return (
    <g>
      <rect x="30" y="40" width="100" height="40" rx="8" fill="none" stroke="#e2e8f0" />
      <rect x="48" y="24" width="56" height="26" rx="4" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="2" />
      <circle cx="52" cy="84" r="12" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
      <circle cx="108" cy="84" r="12" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
    </g>
  );
}

function ObjectsMap() {
  return (
    <g>
      <rect x="24" y="18" width="116" height="84" rx="10" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
      <rect x="30" y="40" width="100" height="40" rx="8" fill="#93c5fd" opacity="0.5" />
      <text x="82" y="34" fontSize="12" fill="#047857" textAnchor="middle" fontWeight="bold">car</text>
    </g>
  );
}

function SemanticMap() {
  return (
    <g>
      <rect x="16" y="12" width="132" height="96" rx="12" fill="rgba(99,102,241,0.18)" stroke="#6366f1" strokeWidth="2" />
      <text x="82" y="64" fontSize="14" fill="#4338ca" textAnchor="middle" fontWeight="bold">vehicle region</text>
    </g>
  );
}

const STAGES = [
  { name: 'Input', tag: null as string | null, render: <InputMap /> },
  { name: 'Conv1', tag: 'Edges', render: <EdgesMap /> },
  { name: 'Conv2', tag: 'Texture · Corners', render: <CornersMap /> },
  { name: 'Conv3', tag: 'Parts', render: <PartsMap /> },
  { name: 'Conv4', tag: 'Objects', render: <ObjectsMap /> },
  { name: 'Conv5', tag: 'Semantic Regions', render: <SemanticMap /> },
];

export default function FeatureHierarchyLab() {
  const [active, setActive] = useState(1);

  return (
    <InteractiveDemo title="为什么越深越抽象？逐层 Feature Map">
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          同一张输入图逐层通过卷积。浅层只能看到边缘、纹理、角点；越深的层把低级特征组合成部件、
          物体，直到语义区域。点击下方任意一层查看它的 Feature Map。
        </p>
        <p className="text-xs text-gray-400">（示意图：用手绘方式展示抽象层级，并非真实 CNN 的前向计算结果。）</p>

        <div className="flex flex-wrap items-center gap-1">
          {STAGES.map((s, i) => (
            <div key={s.name} className="flex items-center">
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${active === i ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {s.name}
              </button>
              {i < STAGES.length - 1 && <span className="mx-1 text-gray-400">→</span>}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-start">
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-gray-500">{STAGES[active].name} Feature Map</div>
              {STAGES[active].tag && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {STAGES[active].tag}
                </span>
              )}
            </div>
            <svg viewBox="0 0 164 120" className="w-full bg-slate-50 rounded-md">
              {STAGES[active].render}
            </svg>
          </div>

          <div className="space-y-2">
            {STAGES.slice(1).map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i + 1)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm flex items-center justify-between ${active === i + 1 ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-white'}`}
              >
                <span className="font-medium text-gray-800">{s.name}</span>
                <span className="text-xs text-gray-500">{s.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
          <strong>直觉：</strong>特征是<strong>逐层组合</strong>出来的——边缘组成纹理和角点，角点组成部件，
          部件组成物体，物体组成语义区域。深度不是堆积，而是抽象。
        </div>
      </div>
    </InteractiveDemo>
  );
}
