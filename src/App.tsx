import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

// Legacy linear-regression sub-topic pages (Chapter 1, Section 1.1 content)
import OverviewPage from './pages/OverviewPage';
import ModelPage from './pages/ModelPage';
import CostFunctionPage from './pages/CostFunctionPage';
import GradientDescentPage from './pages/GradientDescentPage';
import NormalEquationPage from './pages/NormalEquationPage';
import ProbabilisticPage from './pages/ProbabilisticPage';
import OverfittingPage from './pages/OverfittingPage';

// Chapter 2 pages
import Chapter02OverviewPage from './pages/chapters/chapter02/OverviewPage';
import Chapter02ModelPage from './pages/chapters/chapter02/ModelPage';
import Chapter02CostFunctionPage from './pages/chapters/chapter02/CostFunctionPage';
import Chapter02GradientDescentPage from './pages/chapters/chapter02/GradientDescentPage';
import Chapter02PerceptronPage from './pages/chapters/chapter02/PerceptronPage';
import Chapter02MulticlassPage from './pages/chapters/chapter02/MulticlassPage';
import Chapter02NewtonPage from './pages/chapters/chapter02/NewtonPage';

// Chapter 3 pages
import Chapter03OverviewPage from './pages/chapters/chapter03/OverviewPage';
import Chapter03ExponentialFamilyPage from './pages/chapters/chapter03/ExponentialFamilyPage';
import Chapter03BuildingGLMPage from './pages/chapters/chapter03/BuildingGLMPage';
import Chapter03OLSasGLMPage from './pages/chapters/chapter03/OLSasGLMPage';
import Chapter03LogisticAsGLMPage from './pages/chapters/chapter03/LogisticAsGLMPage';
import Chapter03SoftmaxAsGLMPage from './pages/chapters/chapter03/SoftmaxAsGLMPage';
import Chapter03SummaryPage from './pages/chapters/chapter03/SummaryPage';

// Chapter 4 pages
import Chapter04OverviewPage from './pages/chapters/chapter04/OverviewPage';
import Chapter04GenerativeVsDiscriminativePage from './pages/chapters/chapter04/GenerativeVsDiscriminativePage';
import Chapter04GaussianDiscriminantAnalysisPage from './pages/chapters/chapter04/GaussianDiscriminantAnalysisPage';
import Chapter04NaiveBayesPage from './pages/chapters/chapter04/NaiveBayesPage';

// Chapter 5 pages
import Chapter05OverviewPage from './pages/chapters/chapter05/OverviewPage';
import Chapter05FeatureMappingPage from './pages/chapters/chapter05/FeatureMappingPage';
import Chapter05LMSInFeatureSpacePage from './pages/chapters/chapter05/LMSInFeatureSpacePage';
import Chapter05KernelTrickPage from './pages/chapters/chapter05/KernelTrickPage';
import Chapter05KernelPropertiesPage from './pages/chapters/chapter05/KernelPropertiesPage';

// Chapter 6 pages
import Chapter06OverviewPage from './pages/chapters/chapter06/OverviewPage';
import Chapter06MarginIntuitionPage from './pages/chapters/chapter06/MarginIntuitionPage';
import Chapter06SVMTheoryPage from './pages/chapters/chapter06/SVMTheoryPage';

// Chapter 7 pages
import Chapter07OverviewPage from './pages/chapters/chapter07/OverviewPage';
import Chapter07NonlinearSupervisedLearningPage from './pages/chapters/chapter07/NonlinearSupervisedLearningPage';
import Chapter07NeuralNetworksPage from './pages/chapters/chapter07/NeuralNetworksPage';
import Chapter07ModernNNModulesPage from './pages/chapters/chapter07/ModernNNModulesPage';
import Chapter07BackpropagationPage from './pages/chapters/chapter07/BackpropagationPage';
import Chapter07VectorizationPage from './pages/chapters/chapter07/VectorizationPage';

// Chapter / Section pages
import Chapter01Section01Page from './pages/chapters/chapter01/section-01-lms';
import Chapter01Section02Page from './pages/chapters/chapter01/section-02';
import Chapter01Section03Page from './pages/chapters/chapter01/section-03';
import Chapter01Section04Page from './pages/chapters/chapter01/section-04';
import Chapter02Section01Page from './pages/chapters/chapter02/section-01';
import Chapter02Section02Page from './pages/chapters/chapter02/section-02';
import Chapter02Section03Page from './pages/chapters/chapter02/section-03';
import Chapter02Section04Page from './pages/chapters/chapter02/section-04';
import Chapter04Section01Page from './pages/chapters/chapter04/section-01';
import Chapter04Section02Page from './pages/chapters/chapter04/section-02';
import Chapter05Section01Page from './pages/chapters/chapter05/section-01';
import Chapter05Section02Page from './pages/chapters/chapter05/section-02';
import Chapter05Section03Page from './pages/chapters/chapter05/section-03';
import Chapter05Section04Page from './pages/chapters/chapter05/section-04';
import Chapter06Section01Page from './pages/chapters/chapter06/section-01';
import Chapter06Section02Page from './pages/chapters/chapter06/section-02';
import Chapter07Section01Page from './pages/chapters/chapter07/section-01';
import Chapter07Section02Page from './pages/chapters/chapter07/section-02';
import Chapter07Section03Page from './pages/chapters/chapter07/section-03';
import Chapter07Section04Page from './pages/chapters/chapter07/section-04';
import Chapter07Section05Page from './pages/chapters/chapter07/section-05';
import Chapter08OverviewPage from './pages/chapters/chapter08/OverviewPage';
import Chapter08Section01Page from './pages/chapters/chapter08/section-01';
import Chapter08Section02Page from './pages/chapters/chapter08/section-02';
import Chapter08Section03Page from './pages/chapters/chapter08/section-03';
import Chapter09Section01Page from './pages/chapters/chapter09/section-01';
import Chapter09Section02Page from './pages/chapters/chapter09/section-02';
import Chapter09Section03Page from './pages/chapters/chapter09/section-03';
import Chapter09Section04Page from './pages/chapters/chapter09/section-04';
import Chapter10Section01Page from './pages/chapters/chapter10/section-01';
import Chapter11Section01Page from './pages/chapters/chapter11/section-01';
import Chapter11Section02Page from './pages/chapters/chapter11/section-02';
import Chapter11Section03Page from './pages/chapters/chapter11/section-03';
import Chapter11Section04Page from './pages/chapters/chapter11/section-04';
import Chapter11Section05Page from './pages/chapters/chapter11/section-05';
import Chapter12Section01Page from './pages/chapters/chapter12/section-01';
import Chapter13Section01Page from './pages/chapters/chapter13/section-01';
import Chapter14Section01Page from './pages/chapters/chapter14/section-01';
import Chapter14Section02Page from './pages/chapters/chapter14/section-02';
import Chapter14Section03Page from './pages/chapters/chapter14/section-03';
import Chapter15Section01Page from './pages/chapters/chapter15/section-01';
import Chapter15Section02Page from './pages/chapters/chapter15/section-02';
import Chapter15Section03Page from './pages/chapters/chapter15/section-03';
import Chapter15Section04Page from './pages/chapters/chapter15/section-04';
import Chapter15Section05Page from './pages/chapters/chapter15/section-05';
import Chapter16Section01Page from './pages/chapters/chapter16/section-01';
import Chapter16Section02Page from './pages/chapters/chapter16/section-02';
import Chapter16Section03Page from './pages/chapters/chapter16/section-03';
import Chapter16Section04Page from './pages/chapters/chapter16/section-04';
import Chapter17Section01Page from './pages/chapters/chapter17/section-01';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* Legacy linear-regression deep-dive pages (Chapter 1.1) */}
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/cost-function" element={<CostFunctionPage />} />
          <Route path="/gradient-descent" element={<GradientDescentPage />} />
          <Route path="/normal-equation" element={<NormalEquationPage />} />
          <Route path="/probabilistic" element={<ProbabilisticPage />} />
          <Route path="/overfitting" element={<OverfittingPage />} />

          {/* Chapter 2 routes */}
          <Route path="/ch02/overview" element={<Chapter02OverviewPage />} />
          <Route path="/ch02/model" element={<Chapter02ModelPage />} />
          <Route path="/ch02/cost-function" element={<Chapter02CostFunctionPage />} />
          <Route path="/ch02/gradient-descent" element={<Chapter02GradientDescentPage />} />
          <Route path="/ch02/perceptron" element={<Chapter02PerceptronPage />} />
          <Route path="/ch02/multiclass" element={<Chapter02MulticlassPage />} />
          <Route path="/ch02/newton" element={<Chapter02NewtonPage />} />

          {/* Chapter 3 routes */}
          <Route path="/ch03/overview" element={<Chapter03OverviewPage />} />
          <Route path="/ch03/exponential-family" element={<Chapter03ExponentialFamilyPage />} />
          <Route path="/ch03/building-glm" element={<Chapter03BuildingGLMPage />} />
          <Route path="/ch03/ols-as-glm" element={<Chapter03OLSasGLMPage />} />
          <Route path="/ch03/logistic-as-glm" element={<Chapter03LogisticAsGLMPage />} />
          <Route path="/ch03/softmax-as-glm" element={<Chapter03SoftmaxAsGLMPage />} />
          <Route path="/ch03/summary" element={<Chapter03SummaryPage />} />

          {/* Chapter 4 routes */}
          <Route path="/ch04/overview" element={<Chapter04OverviewPage />} />
          <Route path="/ch04/generative-vs-discriminative" element={<Chapter04GenerativeVsDiscriminativePage />} />
          <Route path="/ch04/gaussian-discriminant-analysis" element={<Chapter04GaussianDiscriminantAnalysisPage />} />
          <Route path="/ch04/naive-bayes" element={<Chapter04NaiveBayesPage />} />

          {/* Chapter 5 routes */}
          <Route path="/ch05/overview" element={<Chapter05OverviewPage />} />
          <Route path="/ch05/feature-mapping" element={<Chapter05FeatureMappingPage />} />
          <Route path="/ch05/lms-in-feature-space" element={<Chapter05LMSInFeatureSpacePage />} />
          <Route path="/ch05/kernel-trick" element={<Chapter05KernelTrickPage />} />
          <Route path="/ch05/kernel-properties" element={<Chapter05KernelPropertiesPage />} />

          {/* Chapter 6 routes */}
          <Route path="/ch06/overview" element={<Chapter06OverviewPage />} />
          <Route path="/ch06/margin-intuition" element={<Chapter06MarginIntuitionPage />} />
          <Route path="/ch06/svm-theory" element={<Chapter06SVMTheoryPage />} />

          {/* Chapter 7 routes */}
          <Route path="/ch07/overview" element={<Chapter07OverviewPage />} />
          <Route path="/ch07/nonlinear-supervised-learning" element={<Chapter07NonlinearSupervisedLearningPage />} />
          <Route path="/ch07/neural-networks" element={<Chapter07NeuralNetworksPage />} />
          <Route path="/ch07/modern-nn-modules" element={<Chapter07ModernNNModulesPage />} />
          <Route path="/ch07/backpropagation" element={<Chapter07BackpropagationPage />} />
          <Route path="/ch07/vectorization" element={<Chapter07VectorizationPage />} />

          {/* Chapter / Section routes */}
          <Route path="/ch01/s01" element={<Chapter01Section01Page />} />
          <Route path="/ch01/s02" element={<Chapter01Section02Page />} />
          <Route path="/ch01/s03" element={<Chapter01Section03Page />} />
          <Route path="/ch01/s04" element={<Chapter01Section04Page />} />
          <Route path="/ch02/s01" element={<Chapter02Section01Page />} />
          <Route path="/ch02/s02" element={<Chapter02Section02Page />} />
          <Route path="/ch02/s03" element={<Chapter02Section03Page />} />
          <Route path="/ch02/s04" element={<Chapter02Section04Page />} />
          <Route path="/ch04/s01" element={<Chapter04Section01Page />} />
          <Route path="/ch04/s02" element={<Chapter04Section02Page />} />
          <Route path="/ch05/s01" element={<Chapter05Section01Page />} />
          <Route path="/ch05/s02" element={<Chapter05Section02Page />} />
          <Route path="/ch05/s03" element={<Chapter05Section03Page />} />
          <Route path="/ch05/s04" element={<Chapter05Section04Page />} />
          <Route path="/ch06/s01" element={<Chapter06Section01Page />} />
          <Route path="/ch06/s02" element={<Chapter06Section02Page />} />
          <Route path="/ch07/s01" element={<Chapter07Section01Page />} />
          <Route path="/ch07/s02" element={<Chapter07Section02Page />} />
          <Route path="/ch07/s03" element={<Chapter07Section03Page />} />
          <Route path="/ch07/s04" element={<Chapter07Section04Page />} />
          <Route path="/ch07/s05" element={<Chapter07Section05Page />} />
          <Route path="/ch08/overview" element={<Chapter08OverviewPage />} />
          <Route path="/ch08/s01" element={<Chapter08Section01Page />} />
          <Route path="/ch08/s02" element={<Chapter08Section02Page />} />
          <Route path="/ch08/s03" element={<Chapter08Section03Page />} />
          <Route path="/ch09/s01" element={<Chapter09Section01Page />} />
          <Route path="/ch09/s02" element={<Chapter09Section02Page />} />
          <Route path="/ch09/s03" element={<Chapter09Section03Page />} />
          <Route path="/ch09/s04" element={<Chapter09Section04Page />} />
          <Route path="/ch10/s01" element={<Chapter10Section01Page />} />
          <Route path="/ch11/s01" element={<Chapter11Section01Page />} />
          <Route path="/ch11/s02" element={<Chapter11Section02Page />} />
          <Route path="/ch11/s03" element={<Chapter11Section03Page />} />
          <Route path="/ch11/s04" element={<Chapter11Section04Page />} />
          <Route path="/ch11/s05" element={<Chapter11Section05Page />} />
          <Route path="/ch12/s01" element={<Chapter12Section01Page />} />
          <Route path="/ch13/s01" element={<Chapter13Section01Page />} />
          <Route path="/ch14/s01" element={<Chapter14Section01Page />} />
          <Route path="/ch14/s02" element={<Chapter14Section02Page />} />
          <Route path="/ch14/s03" element={<Chapter14Section03Page />} />
          <Route path="/ch15/s01" element={<Chapter15Section01Page />} />
          <Route path="/ch15/s02" element={<Chapter15Section02Page />} />
          <Route path="/ch15/s03" element={<Chapter15Section03Page />} />
          <Route path="/ch15/s04" element={<Chapter15Section04Page />} />
          <Route path="/ch15/s05" element={<Chapter15Section05Page />} />
          <Route path="/ch16/s01" element={<Chapter16Section01Page />} />
          <Route path="/ch16/s02" element={<Chapter16Section02Page />} />
          <Route path="/ch16/s03" element={<Chapter16Section03Page />} />
          <Route path="/ch16/s04" element={<Chapter16Section04Page />} />
          <Route path="/ch17/s01" element={<Chapter17Section01Page />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
