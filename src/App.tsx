import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

// Legacy linear-regression sub-topic pages (Chapter 1)
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

// Chapter 8 pages
import Chapter08OverviewPage from './pages/chapters/chapter08/OverviewPage';
import Chapter08BiasVariancePage from './pages/chapters/chapter08/BiasVariancePage';
import Chapter08DoubleDescentPage from './pages/chapters/chapter08/DoubleDescentPage';
import Chapter08SampleComplexityPage from './pages/chapters/chapter08/SampleComplexityPage';

// Chapter 9 pages
import Chapter09OverviewPage from './pages/chapters/chapter09/OverviewPage';
import Chapter09RegularizationPage from './pages/chapters/chapter09/RegularizationPage';
import Chapter09ImplicitRegularizationPage from './pages/chapters/chapter09/ImplicitRegularizationPage';
import Chapter09CrossValidationPage from './pages/chapters/chapter09/CrossValidationPage';
import Chapter09BayesianRegularizationPage from './pages/chapters/chapter09/BayesianRegularizationPage';

// Chapter 10 pages
import Chapter10OverviewPage from './pages/chapters/chapter10/OverviewPage';
import Chapter10KMeansPage from './pages/chapters/chapter10/KMeansPage';

// Chapter 11 pages
import Chapter11OverviewPage from './pages/chapters/chapter11/OverviewPage';
import Chapter11GaussianMixtureEMPage from './pages/chapters/chapter11/GaussianMixtureEMPage';
import Chapter11JensenInequalityPage from './pages/chapters/chapter11/JensenInequalityPage';
import Chapter11GeneralEMPage from './pages/chapters/chapter11/GeneralEMPage';
import Chapter11GMMRevisitedPage from './pages/chapters/chapter11/GMMRevisitedPage';
import Chapter11VariationalInferencePage from './pages/chapters/chapter11/VariationalInferencePage';

// Chapter 12 pages
import Chapter12OverviewPage from './pages/chapters/chapter12/OverviewPage';
import Chapter12PCAPage from './pages/chapters/chapter12/PCAPage';

// Chapter 13 pages
import Chapter13OverviewPage from './pages/chapters/chapter13/OverviewPage';
import Chapter13ICAPage from './pages/chapters/chapter13/ICAPage';

// Chapter 14 pages
import Chapter14OverviewPage from './pages/chapters/chapter14/OverviewPage';
import Chapter14PretrainingAdaptationPage from './pages/chapters/chapter14/PretrainingAdaptationPage';
import Chapter14ComputerVisionPretrainingPage from './pages/chapters/chapter14/ComputerVisionPretrainingPage';
import Chapter14LargeLanguageModelsPage from './pages/chapters/chapter14/LargeLanguageModelsPage';

// Chapter 15 pages
import Chapter15OverviewPage from './pages/chapters/chapter15/OverviewPage';
import Chapter15MDPPage from './pages/chapters/chapter15/MDPPage';
import Chapter15ValuePolicyIterationPage from './pages/chapters/chapter15/ValuePolicyIterationPage';
import Chapter15LearningMDPPage from './pages/chapters/chapter15/LearningMDPPage';
import Chapter15ContinuousStateMDPPage from './pages/chapters/chapter15/ContinuousStateMDPPage';
import Chapter15ValuePolicyConnectionPage from './pages/chapters/chapter15/ValuePolicyConnectionPage';

// Chapter 16 pages
import Chapter16FiniteHorizonMDPPage from './pages/chapters/chapter16/FiniteHorizonMDPPage';
import Chapter16LQRPage from './pages/chapters/chapter16/LQRPage';
import Chapter16NonlinearToLQRPage from './pages/chapters/chapter16/NonlinearToLQRPage';
import Chapter16LQGPage from './pages/chapters/chapter16/LQGPage';

// Chapter 17 pages
import Chapter17PolicyGradientPage from './pages/chapters/chapter17/PolicyGradientPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* Chapter 1: linear regression deep-dive pages */}
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

          {/* Chapter 8 routes */}
          <Route path="/ch08/overview" element={<Chapter08OverviewPage />} />
          <Route path="/ch08/bias-variance" element={<Chapter08BiasVariancePage />} />
          <Route path="/ch08/double-descent" element={<Chapter08DoubleDescentPage />} />
          <Route path="/ch08/sample-complexity" element={<Chapter08SampleComplexityPage />} />

          {/* Chapter 9 routes */}
          <Route path="/ch09/overview" element={<Chapter09OverviewPage />} />
          <Route path="/ch09/regularization" element={<Chapter09RegularizationPage />} />
          <Route path="/ch09/implicit-regularization" element={<Chapter09ImplicitRegularizationPage />} />
          <Route path="/ch09/cross-validation" element={<Chapter09CrossValidationPage />} />
          <Route path="/ch09/bayesian-regularization" element={<Chapter09BayesianRegularizationPage />} />

          {/* Chapter 10 routes */}
          <Route path="/ch10/overview" element={<Chapter10OverviewPage />} />
          <Route path="/ch10/k-means" element={<Chapter10KMeansPage />} />

          {/* Chapter 11 routes */}
          <Route path="/ch11/overview" element={<Chapter11OverviewPage />} />
          <Route path="/ch11/gaussian-mixture-em" element={<Chapter11GaussianMixtureEMPage />} />
          <Route path="/ch11/jensen-inequality" element={<Chapter11JensenInequalityPage />} />
          <Route path="/ch11/general-em" element={<Chapter11GeneralEMPage />} />
          <Route path="/ch11/gmm-revisited" element={<Chapter11GMMRevisitedPage />} />
          <Route path="/ch11/variational-inference" element={<Chapter11VariationalInferencePage />} />

          {/* Chapter 12 routes */}
          <Route path="/ch12/overview" element={<Chapter12OverviewPage />} />
          <Route path="/ch12/pca" element={<Chapter12PCAPage />} />

          {/* Chapter 13 routes */}
          <Route path="/ch13/overview" element={<Chapter13OverviewPage />} />
          <Route path="/ch13/ica" element={<Chapter13ICAPage />} />

          {/* Chapter 14 routes */}
          <Route path="/ch14/overview" element={<Chapter14OverviewPage />} />
          <Route path="/ch14/pretraining-adaptation" element={<Chapter14PretrainingAdaptationPage />} />
          <Route path="/ch14/computer-vision-pretraining" element={<Chapter14ComputerVisionPretrainingPage />} />
          <Route path="/ch14/large-language-models" element={<Chapter14LargeLanguageModelsPage />} />

          {/* Chapter 15 routes */}
          <Route path="/ch15/overview" element={<Chapter15OverviewPage />} />
          <Route path="/ch15/mdp" element={<Chapter15MDPPage />} />
          <Route path="/ch15/value-policy-iteration" element={<Chapter15ValuePolicyIterationPage />} />
          <Route path="/ch15/learning-mdp" element={<Chapter15LearningMDPPage />} />
          <Route path="/ch15/continuous-state-mdp" element={<Chapter15ContinuousStateMDPPage />} />
          <Route path="/ch15/value-policy-connection" element={<Chapter15ValuePolicyConnectionPage />} />

          {/* Chapter 16 routes */}
          <Route path="/ch16/finite-horizon-mdp" element={<Chapter16FiniteHorizonMDPPage />} />
          <Route path="/ch16/lqr" element={<Chapter16LQRPage />} />
          <Route path="/ch16/nonlinear-to-lqr" element={<Chapter16NonlinearToLQRPage />} />
          <Route path="/ch16/lqg" element={<Chapter16LQGPage />} />

          {/* Chapter 17 routes */}
          <Route path="/ch17/policy-gradient" element={<Chapter17PolicyGradientPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
