import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OverviewPage from './pages/OverviewPage';
import ModelPage from './pages/ModelPage';
import CostFunctionPage from './pages/CostFunctionPage';
import GradientDescentPage from './pages/GradientDescentPage';
import NormalEquationPage from './pages/NormalEquationPage';
import ProbabilisticPage from './pages/ProbabilisticPage';
import OverfittingPage from './pages/OverfittingPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/cost-function" element={<CostFunctionPage />} />
          <Route path="/gradient-descent" element={<GradientDescentPage />} />
          <Route path="/normal-equation" element={<NormalEquationPage />} />
          <Route path="/probabilistic" element={<ProbabilisticPage />} />
          <Route path="/overfitting" element={<OverfittingPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
