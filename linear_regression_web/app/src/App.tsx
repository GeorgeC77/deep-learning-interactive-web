import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DynamicPlaceholderPage from './pages/DynamicPlaceholderPage';

// Ch 4 (manifest ch01): Single-layer Networks - Regression
import Ch01OverviewPage from './pages/generated/Ch01OverviewPage';
import Ch01LinearRegressionPage from './pages/generated/Ch01LinearRegressionPage';
import Ch01DecisionTheoryPage from './pages/generated/Ch01DecisionTheoryPage';
import Ch01BiasVariancePage from './pages/generated/Ch01BiasVariancePage';

// Ch 5 (manifest ch02): Single-layer Networks - Classification
import Ch02OverviewPage from './pages/generated/Ch02OverviewPage';
import Ch02DiscriminantFunctionsPage from './pages/generated/Ch02DiscriminantFunctionsPage';
import Ch02DecisionTheoryPage from './pages/generated/Ch02DecisionTheoryPage';
import Ch02GenerativeClassifiersPage from './pages/generated/Ch02GenerativeClassifiersPage';
import Ch02DiscriminativeClassifiersPage from './pages/generated/Ch02DiscriminativeClassifiersPage';

// Ch 6 (manifest ch03): Deep Neural Networks
import Chapter07OverviewPage from './pages/chapters/chapter07/OverviewPage';
import Ch03LimitationsOfFixedBasisFunctionsPage from './pages/generated/Ch03LimitationsOfFixedBasisFunctionsPage';
import Ch03MultilayerNetworksPage from './pages/generated/Ch03MultilayerNetworksPage';
import Ch03DeepNetworksPage from './pages/generated/Ch03DeepNetworksPage';

// Ch 8 (manifest ch05): Backpropagation
import Ch05EvaluationOfGradientsPage from './pages/generated/Ch05EvaluationOfGradientsPage';

// Ch 9 (manifest ch06): Regularization
import Chapter09OverviewPage from './pages/chapters/chapter09/OverviewPage';
import Ch06WeightDecayPage from './pages/generated/Ch06WeightDecayPage';
import Ch06LearningCurvesPage from './pages/generated/Ch06LearningCurvesPage';

// Ch 12 (manifest ch09): Transformers — custom attention page with advanced demo
import Ch09AttentionPage from './pages/generated/Ch09AttentionPage';

// Ch 15 (manifest ch12): Discrete Latent Variables
import Ch12OverviewPage from './pages/generated/Ch12OverviewPage';
import Ch12KMeansClusteringPage from './pages/generated/Ch12KMeansClusteringPage';
import Ch12MixturesOfGaussiansPage from './pages/generated/Ch12MixturesOfGaussiansPage';
import Ch12ExpectationMaximizationPage from './pages/generated/Ch12ExpectationMaximizationPage';

// Ch 16 (manifest ch13): Continuous Latent Variables
import Ch13PrincipalComponentAnalysisPage from './pages/generated/Ch13PrincipalComponentAnalysisPage';

// Prerequisite Ch 1–3
import PrerequisiteChapter01OverviewPage from './pages/prerequisite/chapter01/OverviewPage';
import PrerequisiteChapter01ImpactPage from './pages/prerequisite/chapter01/impact';
import PrerequisiteChapter01TutorialPage from './pages/prerequisite/chapter01/tutorial';
import PrerequisiteChapter01HistoryPage from './pages/prerequisite/chapter01/history';

import PrerequisiteChapter02OverviewPage from './pages/prerequisite/chapter02/OverviewPage';
import PrerequisiteChapter02RulesPage from './pages/prerequisite/chapter02/rules';
import PrerequisiteChapter02DensitiesPage from './pages/prerequisite/chapter02/densities';
import PrerequisiteChapter02GaussianPage from './pages/prerequisite/chapter02/gaussian';
import PrerequisiteChapter02InformationPage from './pages/prerequisite/chapter02/information';
import PrerequisiteChapter02BayesianPage from './pages/prerequisite/chapter02/bayesian';

import PrerequisiteChapter03OverviewPage from './pages/prerequisite/chapter03/OverviewPage';
import PrerequisiteChapter03DiscretePage from './pages/prerequisite/chapter03/discrete';
import PrerequisiteChapter03MvGaussianPage from './pages/prerequisite/chapter03/mvgaussian';
import PrerequisiteChapter03ExponentialPage from './pages/prerequisite/chapter03/exponential';
import PrerequisiteChapter03NonparametricPage from './pages/prerequisite/chapter03/nonparametric';

// Generated Bishop section pages
import AppendixAOverviewPage from './pages/generated/AppendixAOverviewPage';
import AppendixBOverviewPage from './pages/generated/AppendixBOverviewPage';
import AppendixCOverviewPage from './pages/generated/AppendixCOverviewPage';
import Ch03ErrorFunctionsPage from './pages/generated/Ch03ErrorFunctionsPage';
import Ch03MixtureDensityNetworksPage from './pages/generated/Ch03MixtureDensityNetworksPage';
import Ch04ConvergencePage from './pages/generated/Ch04ConvergencePage';
import Ch04ErrorSurfacesPage from './pages/generated/Ch04ErrorSurfacesPage';
import Ch04GradientDescentOptimizationPage from './pages/generated/Ch04GradientDescentOptimizationPage';
import Ch04NormalizationPage from './pages/generated/Ch04NormalizationPage';
import Ch04OverviewPage from './pages/generated/Ch04OverviewPage';
import Ch05AutomaticDifferentiationPage from './pages/generated/Ch05AutomaticDifferentiationPage';
import Ch05OverviewPage from './pages/generated/Ch05OverviewPage';
import Ch06InductiveBiasPage from './pages/generated/Ch06InductiveBiasPage';
import Ch06ModelAveragingPage from './pages/generated/Ch06ModelAveragingPage';
import Ch06ParameterSharingPage from './pages/generated/Ch06ParameterSharingPage';
import Ch06ResidualConnectionsPage from './pages/generated/Ch06ResidualConnectionsPage';
import Ch07ComputerVisionPage from './pages/generated/Ch07ComputerVisionPage';
import Ch07ConvolutionalFiltersPage from './pages/generated/Ch07ConvolutionalFiltersPage';
import Ch07ImageSegmentationPage from './pages/generated/Ch07ImageSegmentationPage';
import Ch07ObjectDetectionPage from './pages/generated/Ch07ObjectDetectionPage';
import Ch07OverviewPage from './pages/generated/Ch07OverviewPage';
import Ch07StyleTransferPage from './pages/generated/Ch07StyleTransferPage';
import Ch07VisualizingTrainedCnnsPage from './pages/generated/Ch07VisualizingTrainedCnnsPage';
import Ch08ConditionalIndependencePage from './pages/generated/Ch08ConditionalIndependencePage';
import Ch08GraphicalModelsPage from './pages/generated/Ch08GraphicalModelsPage';
import Ch08OverviewPage from './pages/generated/Ch08OverviewPage';
import Ch08SequenceModelsPage from './pages/generated/Ch08SequenceModelsPage';
import Ch09MultimodalTransformersPage from './pages/generated/Ch09MultimodalTransformersPage';
import Ch09NaturalLanguagePage from './pages/generated/Ch09NaturalLanguagePage';
import Ch09OverviewPage from './pages/generated/Ch09OverviewPage';
import Ch09TransformerLanguageModelsPage from './pages/generated/Ch09TransformerLanguageModelsPage';
import Ch10GeneralGraphNetworksPage from './pages/generated/Ch10GeneralGraphNetworksPage';
import Ch10MachineLearningOnGraphsPage from './pages/generated/Ch10MachineLearningOnGraphsPage';
import Ch10NeuralMessagePassingPage from './pages/generated/Ch10NeuralMessagePassingPage';
import Ch10OverviewPage from './pages/generated/Ch10OverviewPage';
import Ch11BasicSamplingAlgorithmsPage from './pages/generated/Ch11BasicSamplingAlgorithmsPage';
import Ch11LangevinSamplingPage from './pages/generated/Ch11LangevinSamplingPage';
import Ch11MarkovChainMonteCarloPage from './pages/generated/Ch11MarkovChainMonteCarloPage';
import Ch11OverviewPage from './pages/generated/Ch11OverviewPage';
import Ch12EvidenceLowerBoundPage from './pages/generated/Ch12EvidenceLowerBoundPage';
import Ch13EvidenceLowerBoundPage from './pages/generated/Ch13EvidenceLowerBoundPage';
import Ch13NonlinearLatentVariableModelsPage from './pages/generated/Ch13NonlinearLatentVariableModelsPage';
import Ch13OverviewPage from './pages/generated/Ch13OverviewPage';
import Ch13ProbabilisticLatentVariablesPage from './pages/generated/Ch13ProbabilisticLatentVariablesPage';
import Ch14AdversarialTrainingPage from './pages/generated/Ch14AdversarialTrainingPage';
import Ch14ImageGansPage from './pages/generated/Ch14ImageGansPage';
import Ch14OverviewPage from './pages/generated/Ch14OverviewPage';
import Ch15AutoregressiveFlowsPage from './pages/generated/Ch15AutoregressiveFlowsPage';
import Ch15ContinuousFlowsPage from './pages/generated/Ch15ContinuousFlowsPage';
import Ch15CouplingFlowsPage from './pages/generated/Ch15CouplingFlowsPage';
import Ch15OverviewPage from './pages/generated/Ch15OverviewPage';
import Ch16DeterministicAutoencodersPage from './pages/generated/Ch16DeterministicAutoencodersPage';
import Ch16OverviewPage from './pages/generated/Ch16OverviewPage';
import Ch16VariationalAutoencodersPage from './pages/generated/Ch16VariationalAutoencodersPage';
import Ch17ForwardEncoderPage from './pages/generated/Ch17ForwardEncoderPage';
import Ch17GuidedDiffusionPage from './pages/generated/Ch17GuidedDiffusionPage';
import Ch17OverviewPage from './pages/generated/Ch17OverviewPage';
import Ch17ReverseDecoderPage from './pages/generated/Ch17ReverseDecoderPage';
import Ch17ScoreMatchingPage from './pages/generated/Ch17ScoreMatchingPage';
import PrerequisiteCh02TransformationPage from './pages/generated/PrerequisiteCh02TransformationPage';
import PrerequisiteCh03PeriodicPage from './pages/generated/PrerequisiteCh03PeriodicPage';

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
  '/ch03/overview': Chapter07OverviewPage,
  '/ch03/limitations-of-fixed-basis-functions': Ch03LimitationsOfFixedBasisFunctionsPage,
  '/ch03/multilayer-networks': Ch03MultilayerNetworksPage,
  '/ch03/deep-networks': Ch03DeepNetworksPage,

  // Ch 8 (manifest ch05): Backpropagation
  '/ch05/evaluation-of-gradients': Ch05EvaluationOfGradientsPage,

  // Ch 9 (manifest ch06): Regularization
  '/ch06/overview': Chapter09OverviewPage,
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
  '/ch03/error-functions': Ch03ErrorFunctionsPage,
  '/ch03/mixture-density-networks': Ch03MixtureDensityNetworksPage,
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

function App() {
  const sections = getAllSections();

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default App;
