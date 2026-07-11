import Chapter11GaussianMixtureEMPage from '@/pages/chapters/chapter11/GaussianMixtureEMPage';
import EMELBOLab from '@/components/demos/EMELBOLab';

export default function Ch12ExpectationMaximizationPage() {
  return (
    <>
      <Chapter11GaussianMixtureEMPage />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <EMELBOLab />
      </div>
    </>
  );
}
