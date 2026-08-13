import { useState } from 'react';
import InteractiveDemo from '@/components/InteractiveDemo';
import PredictionGate from '@/components/PredictionGate';
import { Slider } from '@/components/ui/slider';
import {
  convolutionParameterCount,
  denseLayerParameterCount,
  visionOutputElements,
  type VisionTask,
} from '@/lib/math/visionTasks';

const TASK_LABELS: Record<VisionTask, string> = {
  classification: '分类：一个全局类别分布',
  detection: '检测：一组类别与边界框',
  segmentation: '分割：每个像素的类别分布',
};

export default function VisionTaskLab() {
  const [prediction, setPrediction] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [task, setTask] = useState<VisionTask>('classification');
  const [size, setSize] = useState(32);
  const [classes, setClasses] = useState(10);
  const [boxes, setBoxes] = useState(5);
  const outputElements = visionOutputElements(task, size, size, classes, boxes);
  const denseParameters = denseLayerParameterCount(size, size, 3, 64);
  const convolutionParameters = convolutionParameterCount(3, 3, 64);

  return (
    <InteractiveDemo title="视觉任务实验：输出粒度决定架构">
      <div className="space-y-6">
        <PredictionGate
          resetKey="chapter07-output-granularity"
          prediction={prediction}
          onPredictionChange={setPrediction}
          submitted={submitted}
          onSubmit={() => setSubmitted(true)}
          revealed={revealed}
          onReveal={() => setRevealed((value) => !value)}
          canReveal={submitted}
          question="输入尺寸翻倍时，哪类任务的输出元素数按面积增长？"
          hint="分类输出没有空间索引；像素级输出保留 H×W。"
          options={[
            { value: 'segmentation', label: '图像分割' },
            { value: 'classification', label: '图像分类' },
            { value: 'all', label: '三类任务都必然如此' },
          ]}
          evaluatePrediction={(answer) => ({
            correct: answer === 'segmentation',
            category: '输出粒度',
            feedback: answer === 'segmentation'
              ? '正确。语义分割为每个像素输出 C 个类别分数，所以规模是 HWC。'
              : '分类只有 C 个全局分数；检测输出随候选数量变化，不必随像素面积线性增长。',
          })}
          revealContent={<p className="text-sm text-gray-700">任务头必须保留所需的空间信息：分类可聚合，分割不能在末端压成单个向量。</p>}
        />

        {submitted && (
          <div aria-label="视觉任务输出粒度实验控制区" className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TASK_LABELS) as VisionTask[]).map((item) => (
                <button key={item} type="button" onClick={() => setTask(item)} className={`rounded-lg border px-3 py-2 text-sm ${task === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700'}`}>{TASK_LABELS[item]}</button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-gray-700">图像边长：{size}<Slider value={[size]} min={16} max={128} step={16} onValueChange={([value]) => setSize(value)} /></label>
              <label className="text-sm text-gray-700">类别数：{classes}<Slider value={[classes]} min={2} max={20} step={1} onValueChange={([value]) => setClasses(value)} /></label>
              <label className="text-sm text-gray-700">候选框数：{boxes}<Slider value={[boxes]} min={1} max={20} step={1} onValueChange={([value]) => setBoxes(value)} /></label>
            </div>
            <div className="grid gap-3 md:grid-cols-3 text-center">
              <div className="rounded-xl bg-blue-50 p-4"><span className="block text-sm text-gray-600">当前输出元素</span><strong className="text-2xl text-blue-800">{outputElements.toLocaleString()}</strong></div>
              <div className="rounded-xl bg-red-50 p-4"><span className="block text-sm text-gray-600">全连接首层参数</span><strong className="text-2xl text-red-800">{denseParameters.toLocaleString()}</strong></div>
              <div className="rounded-xl bg-emerald-50 p-4"><span className="block text-sm text-gray-600">3×3 卷积参数</span><strong className="text-2xl text-emerald-800">{convolutionParameters.toLocaleString()}</strong></div>
            </div>
            <p className="text-sm text-gray-600">卷积参数量不随图像面积增长，因为同一局部滤波器跨位置共享；这正是教材所强调的结构归纳偏置。</p>
          </div>
        )}
      </div>
    </InteractiveDemo>
  );
}
