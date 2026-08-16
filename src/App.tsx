import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
const HomePage = lazy(() => import('./pages/HomePage'));
import DynamicPlaceholderPage from './pages/DynamicPlaceholderPage';

// Ch 4 (manifest ch01): Single-layer Networks - Regression
const Ch01OverviewPage = lazy(() => import('./pages/generated/Ch01OverviewPage'));
const Ch01LinearRegressionPage = lazy(() => import('./pages/generated/Ch01LinearRegressionPage'));
const Ch01DecisionTheoryPage = lazy(() => import('./pages/generated/Ch01DecisionTheoryPage'));
const Ch01BiasVariancePage = lazy(() => import('./pages/generated/Ch01BiasVariancePage'));

// Ch 5 (manifest ch02): Single-layer Networks - Classification
const Ch02OverviewPage = lazy(() => import('./pages/generated/Ch02OverviewPage'));
const Ch02DiscriminantFunctionsPage = lazy(() => import('./pages/generated/Ch02DiscriminantFunctionsPage'));
const Ch02DecisionTheoryPage = lazy(() => import('./pages/generated/Ch02DecisionTheoryPage'));
const Ch02GenerativeClassifiersPage = lazy(() => import('./pages/generated/Ch02GenerativeClassifiersPage'));
const Ch02DiscriminativeClassifiersPage = lazy(() => import('./pages/generated/Ch02DiscriminativeClassifiersPage'));

// Ch 6 (manifest ch03): Deep Neural Networks
const Ch03OverviewPage = lazy(() => import('./pages/generated/Ch03OverviewPage'));
const Ch03LimitationsOfFixedBasisFunctionsPage = lazy(() => import('./pages/generated/Ch03LimitationsOfFixedBasisFunctionsPage'));
const Ch03MultilayerNetworksPage = lazy(() => import('./pages/generated/Ch03MultilayerNetworksPage'));
const Ch03DeepNetworksPage = lazy(() => import('./pages/generated/Ch03DeepNetworksPage'));
const Ch03ErrorFunctionsPage = lazy(() => import('./pages/generated/Ch03ErrorFunctionsPage'));
const Ch03MixtureDensityNetworksPage = lazy(() => import('./pages/generated/Ch03MixtureDensityNetworksPage'));

// Ch 8 (manifest ch05): Backpropagation
const Ch05EvaluationOfGradientsPage = lazy(() => import('./pages/generated/Ch05EvaluationOfGradientsPage'));

// Ch 9 (manifest ch06): Regularization
const Ch06OverviewPage = lazy(() => import('./pages/generated/Ch06OverviewPage'));
const Ch06WeightDecayPage = lazy(() => import('./pages/generated/Ch06WeightDecayPage'));
const Ch06LearningCurvesPage = lazy(() => import('./pages/generated/Ch06LearningCurvesPage'));

// Ch 12 (manifest ch09): Transformers 鈥?custom attention page with advanced demo
const Ch09AttentionPage = lazy(() => import('./pages/generated/Ch09AttentionPage'));

// Ch 15 (manifest ch12): Discrete Latent Variables
const Ch12OverviewPage = lazy(() => import('./pages/generated/Ch12OverviewPage'));
const Ch12KMeansClusteringPage = lazy(() => import('./pages/generated/Ch12KMeansClusteringPage'));
const Ch12MixturesOfGaussiansPage = lazy(() => import('./pages/generated/Ch12MixturesOfGaussiansPage'));
const Ch12ExpectationMaximizationPage = lazy(() => import('./pages/generated/Ch12ExpectationMaximizationPage'));

// Ch 16 (manifest ch13): Continuous Latent Variables
const Ch13PrincipalComponentAnalysisPage = lazy(() => import('./pages/generated/Ch13PrincipalComponentAnalysisPage'));

// Prerequisite Ch 1鈥?
const PrerequisiteChapter01OverviewPage = lazy(() => import('./pages/prerequisite/chapter01/OverviewPage'));
const PrerequisiteChapter01ImpactPage = lazy(() => import('./pages/prerequisite/chapter01/impact'));
const PrerequisiteChapter01TutorialPage = lazy(() => import('./pages/prerequisite/chapter01/tutorial'));
const PrerequisiteChapter01HistoryPage = lazy(() => import('./pages/prerequisite/chapter01/history'));

const PrerequisiteChapter02OverviewPage = lazy(() => import('./pages/prerequisite/chapter02/OverviewPage'));
const PrerequisiteChapter02RulesPage = lazy(() => import('./pages/prerequisite/chapter02/rules'));
const PrerequisiteChapter02DensitiesPage = lazy(() => import('./pages/prerequisite/chapter02/densities'));
const PrerequisiteChapter02GaussianPage = lazy(() => import('./pages/prerequisite/chapter02/gaussian'));
const PrerequisiteChapter02InformationPage = lazy(() => import('./pages/prerequisite/chapter02/information'));
const PrerequisiteChapter02BayesianPage = lazy(() => import('./pages/prerequisite/chapter02/bayesian'));

const PrerequisiteChapter03OverviewPage = lazy(() => import('./pages/prerequisite/chapter03/OverviewPage'));
const PrerequisiteChapter03DiscretePage = lazy(() => import('./pages/prerequisite/chapter03/discrete'));
const PrerequisiteChapter03MvGaussianPage = lazy(() => import('./pages/prerequisite/chapter03/mvgaussian'));
const PrerequisiteChapter03ExponentialPage = lazy(() => import('./pages/prerequisite/chapter03/exponential'));
const PrerequisiteChapter03NonparametricPage = lazy(() => import('./pages/prerequisite/chapter03/nonparametric'));

// Generated Bishop section pages
const AppendixAOverviewPage = lazy(() => import('./pages/generated/AppendixAOverviewPage'));
const AppendixBOverviewPage = lazy(() => import('./pages/generated/AppendixBOverviewPage'));
const AppendixCOverviewPage = lazy(() => import('./pages/generated/AppendixCOverviewPage'));
const Ch04ConvergencePage = lazy(() => import('./pages/generated/Ch04ConvergencePage'));
const Ch04ErrorSurfacesPage = lazy(() => import('./pages/generated/Ch04ErrorSurfacesPage'));
const Ch04GradientDescentOptimizationPage = lazy(() => import('./pages/generated/Ch04GradientDescentOptimizationPage'));
const Ch04NormalizationPage = lazy(() => import('./pages/generated/Ch04NormalizationPage'));
const Ch04OverviewPage = lazy(() => import('./pages/generated/Ch04OverviewPage'));
const Ch05AutomaticDifferentiationPage = lazy(() => import('./pages/generated/Ch05AutomaticDifferentiationPage'));
const Ch05OverviewPage = lazy(() => import('./pages/generated/Ch05OverviewPage'));
const Ch06InductiveBiasPage = lazy(() => import('./pages/generated/Ch06InductiveBiasPage'));
const Ch06ModelAveragingPage = lazy(() => import('./pages/generated/Ch06ModelAveragingPage'));
const Ch06ParameterSharingPage = lazy(() => import('./pages/generated/Ch06ParameterSharingPage'));
const Ch06ResidualConnectionsPage = lazy(() => import('./pages/generated/Ch06ResidualConnectionsPage'));
const Ch07ComputerVisionPage = lazy(() => import('./pages/generated/Ch07ComputerVisionPage'));
const Ch07ConvolutionalFiltersPage = lazy(() => import('./pages/generated/Ch07ConvolutionalFiltersPage'));
const Ch07ImageSegmentationPage = lazy(() => import('./pages/generated/Ch07ImageSegmentationPage'));
const Ch07ObjectDetectionPage = lazy(() => import('./pages/generated/Ch07ObjectDetectionPage'));
const Ch07OverviewPage = lazy(() => import('./pages/generated/Ch07OverviewPage'));
const Ch07StyleTransferPage = lazy(() => import('./pages/generated/Ch07StyleTransferPage'));
const Ch07VisualizingTrainedCnnsPage = lazy(() => import('./pages/generated/Ch07VisualizingTrainedCnnsPage'));
const Ch08ConditionalIndependencePage = lazy(() => import('./pages/generated/Ch08ConditionalIndependencePage'));
const Ch08GraphicalModelsPage = lazy(() => import('./pages/generated/Ch08GraphicalModelsPage'));
const Ch08OverviewPage = lazy(() => import('./pages/generated/Ch08OverviewPage'));
const Ch08SequenceModelsPage = lazy(() => import('./pages/generated/Ch08SequenceModelsPage'));
const Ch09MultimodalTransformersPage = lazy(() => import('./pages/generated/Ch09MultimodalTransformersPage'));
const Ch09NaturalLanguagePage = lazy(() => import('./pages/generated/Ch09NaturalLanguagePage'));
const Ch09OverviewPage = lazy(() => import('./pages/generated/Ch09OverviewPage'));
const Ch09TransformerLanguageModelsPage = lazy(() => import('./pages/generated/Ch09TransformerLanguageModelsPage'));
const Ch10GeneralGraphNetworksPage = lazy(() => import('./pages/generated/Ch10GeneralGraphNetworksPage'));
const Ch10MachineLearningOnGraphsPage = lazy(() => import('./pages/generated/Ch10MachineLearningOnGraphsPage'));
const Ch10NeuralMessagePassingPage = lazy(() => import('./pages/generated/Ch10NeuralMessagePassingPage'));
const Ch10OverviewPage = lazy(() => import('./pages/generated/Ch10OverviewPage'));
const Ch11BasicSamplingAlgorithmsPage = lazy(() => import('./pages/generated/Ch11BasicSamplingAlgorithmsPage'));
const Ch11LangevinSamplingPage = lazy(() => import('./pages/generated/Ch11LangevinSamplingPage'));
const Ch11MarkovChainMonteCarloPage = lazy(() => import('./pages/generated/Ch11MarkovChainMonteCarloPage'));
const Ch11OverviewPage = lazy(() => import('./pages/generated/Ch11OverviewPage'));
const Ch12EvidenceLowerBoundPage = lazy(() => import('./pages/generated/Ch12EvidenceLowerBoundPage'));
const Ch13EvidenceLowerBoundPage = lazy(() => import('./pages/generated/Ch13EvidenceLowerBoundPage'));
const Ch13NonlinearLatentVariableModelsPage = lazy(() => import('./pages/generated/Ch13NonlinearLatentVariableModelsPage'));
const Ch13OverviewPage = lazy(() => import('./pages/generated/Ch13OverviewPage'));
const Ch13ProbabilisticLatentVariablesPage = lazy(() => import('./pages/generated/Ch13ProbabilisticLatentVariablesPage'));
const Ch14AdversarialTrainingPage = lazy(() => import('./pages/generated/Ch14AdversarialTrainingPage'));
const Ch14ImageGansPage = lazy(() => import('./pages/generated/Ch14ImageGansPage'));
const Ch14OverviewPage = lazy(() => import('./pages/generated/Ch14OverviewPage'));
const Ch15AutoregressiveFlowsPage = lazy(() => import('./pages/generated/Ch15AutoregressiveFlowsPage'));
const Ch15ContinuousFlowsPage = lazy(() => import('./pages/generated/Ch15ContinuousFlowsPage'));
const Ch15CouplingFlowsPage = lazy(() => import('./pages/generated/Ch15CouplingFlowsPage'));
const Ch15OverviewPage = lazy(() => import('./pages/generated/Ch15OverviewPage'));
const Ch16DeterministicAutoencodersPage = lazy(() => import('./pages/generated/Ch16DeterministicAutoencodersPage'));
const Ch16OverviewPage = lazy(() => import('./pages/generated/Ch16OverviewPage'));
const Ch16VariationalAutoencodersPage = lazy(() => import('./pages/generated/Ch16VariationalAutoencodersPage'));
const Ch17ForwardEncoderPage = lazy(() => import('./pages/generated/Ch17ForwardEncoderPage'));
const Ch17GuidedDiffusionPage = lazy(() => import('./pages/generated/Ch17GuidedDiffusionPage'));
const Ch17OverviewPage = lazy(() => import('./pages/generated/Ch17OverviewPage'));
const Ch17ReverseDecoderPage = lazy(() => import('./pages/generated/Ch17ReverseDecoderPage'));
const Ch17ScoreMatchingPage = lazy(() => import('./pages/generated/Ch17ScoreMatchingPage'));
const PrerequisiteCh02TransformationPage = lazy(() => import('./pages/generated/PrerequisiteCh02TransformationPage'));
const PrerequisiteCh03PeriodicPage = lazy(() => import('./pages/generated/PrerequisiteCh03PeriodicPage'));

import { getAllSections } from './course/manifest';

const sectionComponents: Record<string, React.ComponentType> = {
  // Ch 4 (manifest ch01): Single-layer Networks - Regression
  '/ch01/overview': Ch01OverviewPage,
  '/ch01/linear-regression': Ch01LinearRegressionPage,
  '/ch01/decision-theory': Ch01DecisionTheoryPage,
  '/ch01/bias-variance': Ch01BiasVariancePage,

  // Ch 5 (manifest ch02): Single-layer Networks - Classification
  '/ch02/overview': Ch02OverviewPage,
  '/ch02/discriminant-functions': Ch02DiscriminantFunctionsPage,
  '/ch02/decision-theory': Ch02DecisionTheoryPage,
  '/ch02/generative-classifiers': Ch02GenerativeClassifiersPage,
  '/ch02/discriminative-classifiers': Ch02DiscriminativeClassifiersPage,

  // Ch 6 (manifest ch03): Deep Neural Networks
  '/ch03/overview': Ch03OverviewPage,
  '/ch03/limitations-of-fixed-basis-functions': Ch03LimitationsOfFixedBasisFunctionsPage,
  '/ch03/multilayer-networks': Ch03MultilayerNetworksPage,
  '/ch03/deep-networks': Ch03DeepNetworksPage,
  '/ch03/error-functions': Ch03ErrorFunctionsPage,
  '/ch03/mixture-density-networks': Ch03MixtureDensityNetworksPage,

  // Ch 8 (manifest ch05): Backpropagation
  '/ch05/evaluation-of-gradients': Ch05EvaluationOfGradientsPage,

  // Ch 9 (manifest ch06): Regularization
  '/ch06/overview': Ch06OverviewPage,
  '/ch06/weight-decay': Ch06WeightDecayPage,
  '/ch06/learning-curves': Ch06LearningCurvesPage,

  // Ch 12 (manifest ch09): Transformers
  '/ch09/attention': Ch09AttentionPage,

  // Ch 15 (manifest ch12): Discrete Latent Variables
  '/ch12/overview': Ch12OverviewPage,
  '/ch12/k-means-clustering': Ch12KMeansClusteringPage,
  '/ch12/mixtures-of-gaussians': Ch12MixturesOfGaussiansPage,
  '/ch12/expectation-maximization': Ch12ExpectationMaximizationPage,

  // Ch 16 (manifest ch13): Continuous Latent Variables
  '/ch13/principal-component-analysis': Ch13PrincipalComponentAnalysisPage,

  // Prerequisite Ch 1
  '/prerequisite/ch01/overview': PrerequisiteChapter01OverviewPage,
  '/prerequisite/ch01/impact': PrerequisiteChapter01ImpactPage,
  '/prerequisite/ch01/tutorial': PrerequisiteChapter01TutorialPage,
  '/prerequisite/ch01/history': PrerequisiteChapter01HistoryPage,

  // Prerequisite Ch 2
  '/prerequisite/ch02/overview': PrerequisiteChapter02OverviewPage,
  '/prerequisite/ch02/rules': PrerequisiteChapter02RulesPage,
  '/prerequisite/ch02/densities': PrerequisiteChapter02DensitiesPage,
  '/prerequisite/ch02/gaussian': PrerequisiteChapter02GaussianPage,
  '/prerequisite/ch02/information': PrerequisiteChapter02InformationPage,
  '/prerequisite/ch02/bayesian': PrerequisiteChapter02BayesianPage,

  // Prerequisite Ch 3
  '/prerequisite/ch03/overview': PrerequisiteChapter03OverviewPage,
  '/prerequisite/ch03/discrete': PrerequisiteChapter03DiscretePage,
  '/prerequisite/ch03/mvgaussian': PrerequisiteChapter03MvGaussianPage,
  '/prerequisite/ch03/exponential': PrerequisiteChapter03ExponentialPage,
  '/prerequisite/ch03/nonparametric': PrerequisiteChapter03NonparametricPage,

  // Generated Bishop section routes
  '/appendix/a/overview': AppendixAOverviewPage,
  '/appendix/b/overview': AppendixBOverviewPage,
  '/appendix/c/overview': AppendixCOverviewPage,
  '/ch04/convergence': Ch04ConvergencePage,
  '/ch04/error-surfaces': Ch04ErrorSurfacesPage,
  '/ch04/gradient-descent-optimization': Ch04GradientDescentOptimizationPage,
  '/ch04/normalization': Ch04NormalizationPage,
  '/ch04/overview': Ch04OverviewPage,
  '/ch05/automatic-differentiation': Ch05AutomaticDifferentiationPage,
  '/ch05/overview': Ch05OverviewPage,
  '/ch06/inductive-bias': Ch06InductiveBiasPage,
  '/ch06/model-averaging': Ch06ModelAveragingPage,
  '/ch06/parameter-sharing': Ch06ParameterSharingPage,
  '/ch06/residual-connections': Ch06ResidualConnectionsPage,
  '/ch07/computer-vision': Ch07ComputerVisionPage,
  '/ch07/convolutional-filters': Ch07ConvolutionalFiltersPage,
  '/ch07/image-segmentation': Ch07ImageSegmentationPage,
  '/ch07/object-detection': Ch07ObjectDetectionPage,
  '/ch07/overview': Ch07OverviewPage,
  '/ch07/style-transfer': Ch07StyleTransferPage,
  '/ch07/visualizing-trained-cnns': Ch07VisualizingTrainedCnnsPage,
  '/ch08/conditional-independence': Ch08ConditionalIndependencePage,
  '/ch08/graphical-models': Ch08GraphicalModelsPage,
  '/ch08/overview': Ch08OverviewPage,
  '/ch08/sequence-models': Ch08SequenceModelsPage,
  '/ch09/multimodal-transformers': Ch09MultimodalTransformersPage,
  '/ch09/natural-language': Ch09NaturalLanguagePage,
  '/ch09/overview': Ch09OverviewPage,
  '/ch09/transformer-language-models': Ch09TransformerLanguageModelsPage,
  '/ch10/general-graph-networks': Ch10GeneralGraphNetworksPage,
  '/ch10/machine-learning-on-graphs': Ch10MachineLearningOnGraphsPage,
  '/ch10/neural-message-passing': Ch10NeuralMessagePassingPage,
  '/ch10/overview': Ch10OverviewPage,
  '/ch11/basic-sampling-algorithms': Ch11BasicSamplingAlgorithmsPage,
  '/ch11/langevin-sampling': Ch11LangevinSamplingPage,
  '/ch11/markov-chain-monte-carlo': Ch11MarkovChainMonteCarloPage,
  '/ch11/overview': Ch11OverviewPage,
  '/ch12/evidence-lower-bound': Ch12EvidenceLowerBoundPage,
  '/ch13/evidence-lower-bound': Ch13EvidenceLowerBoundPage,
  '/ch13/nonlinear-latent-variable-models': Ch13NonlinearLatentVariableModelsPage,
  '/ch13/overview': Ch13OverviewPage,
  '/ch13/probabilistic-latent-variables': Ch13ProbabilisticLatentVariablesPage,
  '/ch14/adversarial-training': Ch14AdversarialTrainingPage,
  '/ch14/image-gans': Ch14ImageGansPage,
  '/ch14/overview': Ch14OverviewPage,
  '/ch15/autoregressive-flows': Ch15AutoregressiveFlowsPage,
  '/ch15/continuous-flows': Ch15ContinuousFlowsPage,
  '/ch15/coupling-flows': Ch15CouplingFlowsPage,
  '/ch15/overview': Ch15OverviewPage,
  '/ch16/deterministic-autoencoders': Ch16DeterministicAutoencodersPage,
  '/ch16/overview': Ch16OverviewPage,
  '/ch16/variational-autoencoders': Ch16VariationalAutoencodersPage,
  '/ch17/forward-encoder': Ch17ForwardEncoderPage,
  '/ch17/guided-diffusion': Ch17GuidedDiffusionPage,
  '/ch17/overview': Ch17OverviewPage,
  '/ch17/reverse-decoder': Ch17ReverseDecoderPage,
  '/ch17/score-matching': Ch17ScoreMatchingPage,
  '/prerequisite/ch02/transformation': PrerequisiteCh02TransformationPage,
  '/prerequisite/ch03/periodic': PrerequisiteCh03PeriodicPage,
};

function PageLoadingFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500" role="status">
      正在加载课程内容…
    </div>
  );
}

function App() {
  const sections = getAllSections();

  return (
    <HashRouter>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* All course sections */}
          {sections.map((section) => {
            const Component = sectionComponents[section.path] ?? DynamicPlaceholderPage;
            return <Route key={section.path} path={section.path} element={<Component />} />;
          })}
        </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
