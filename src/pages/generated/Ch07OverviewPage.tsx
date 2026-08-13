import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Boxes, Eye, Filter, Palette, ScanSearch, Scissors } from 'lucide-react';
import ChapterProgressCard from '@/components/ChapterProgressCard';

const progressSections = [
  { exerciseSetId: 'chapter07-computer-vision', label: '10.1 计算机视觉', path: '/ch07/computer-vision', exerciseCount: 3 },
  { exerciseSetId: 'chapter07-convolution', label: '10.2 卷积滤波器', path: '/ch07/convolutional-filters', exerciseCount: 3 },
  { exerciseSetId: 'chapter07-visualization', label: '10.3 可视化 CNN', path: '/ch07/visualizing-trained-cnns', exerciseCount: 3 },
  { exerciseSetId: 'chapter07-detection', label: '10.4 目标检测', path: '/ch07/object-detection', exerciseCount: 3 },
  { exerciseSetId: 'chapter07-segmentation', label: '10.5 图像分割', path: '/ch07/image-segmentation', exerciseCount: 3 },
  { exerciseSetId: 'chapter07-style-transfer', label: '10.6 风格迁移', path: '/ch07/style-transfer', exerciseCount: 3 },
];

const routes = [
  ['10.1 计算机视觉', '/ch07/computer-vision', Eye, '图像张量，以及分类、检测、分割等不同输出粒度'],
  ['10.2 卷积滤波器', '/ch07/convolutional-filters', Filter, '层次性、局部性、等变性、不变性与尺寸计算'],
  ['10.3 可视化 CNN', '/ch07/visualizing-trained-cnns', ScanSearch, '滤波器、Grad-CAM、对抗攻击与 DeepDream'],
  ['10.4 目标检测', '/ch07/object-detection', Boxes, '边界框、IoU、多尺度滑窗、NMS 与 Fast R-CNN'],
  ['10.5 图像分割', '/ch07/image-segmentation', Scissors, '卷积分割、上采样、FCN 与 U-Net'],
  ['10.6 风格迁移', '/ch07/style-transfer', Palette, '内容特征、风格矩阵与联合优化'],
] as const;

export default function Ch07OverviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <section className="rounded-2xl border bg-white px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"><BookOpen className="h-9 w-9 text-blue-600" /></div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">卷积网络</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">第 10 章从图像的二维网格结构出发，把层次性、局部性、等变性和不变性写进 CNN；随后用同一套空间表示解决解释、检测、分割与风格生成问题。</p>
        <div className="mt-5 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">Bishop &amp; Bishop §10.1–10.6（教材页码 288–322）</div>
      </section>
      <ChapterProgressCard title="第七章掌握进度" sections={progressSections} />
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">学习路线</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map(([label, path, Icon, description]) => <Link key={path} to={path} className="group rounded-xl border-2 border-blue-200 bg-blue-50 p-5 hover:border-blue-400 hover:shadow-md"><Icon className="h-7 w-7 text-blue-700" /><h3 className="mt-3 font-bold text-gray-900">{label}</h3><p className="mt-2 text-sm text-gray-700">{description}</p><span className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-800">进入学习 <ArrowRight className="h-4 w-4" /></span></Link>)}
        </div>
      </section>
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="text-xl font-bold text-amber-900">统一视角：保留什么空间结构</h2><p className="mt-2 text-sm leading-relaxed text-amber-950">卷积特征图随输入平移，分类头再聚合为不变输出；检测保留对象级位置，分割保留像素级位置；风格矩阵则有意对空间位置求和。每种架构都在选择保留或丢弃哪一类空间信息。</p></section>
      <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="text-xl font-bold text-emerald-900">完成标准</h2><p className="mt-2 text-sm leading-relaxed text-emerald-900">完成六节共 18 道原创练习，并能手算卷积尺寸与 IoU，验证卷积等变性的边界、显著性饱和反例、NMS 阈值权衡、U-Net 尺寸链，以及 Gram 矩阵的空间置换不变性。</p></section>
    </div>
  );
}
