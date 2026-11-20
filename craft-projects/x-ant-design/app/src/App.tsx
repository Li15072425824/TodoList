import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ThoughtChainPage from './pages/ThoughtChainPage';
import ComponentsIntroducePage from './pages/ComponentsIntroducePage';
import ReactIntroducePage from './pages/ReactIntroducePage';
import SpecIntroducePage from './pages/SpecIntroducePage';

export default function App() {
  return (
    <Routes>
      {/* Root is the primary documented component page. */}
      <Route path="/" element={<ThoughtChainPage />} />
      <Route path="/index-cn" element={<HomePage />} />
      <Route path="/docs/spec/introduce-cn" element={<SpecIntroducePage />} />
      <Route path="/docs/react/introduce-cn" element={<ReactIntroducePage />} />
      <Route path="/components/introduce-cn" element={<ComponentsIntroducePage />} />
      <Route path="/components/introduce-cn/" element={<ComponentsIntroducePage />} />
      <Route path="/components/thought-chain-cn" element={<ThoughtChainPage />} />
      <Route path="*" element={<Navigate to="/index-cn" replace />} />
    </Routes>
  );
}
