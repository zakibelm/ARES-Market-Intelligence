
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AgentTerminal from './components/AgentTerminal';
import MarketHunter from './components/MarketHunter';
import LegalGate from './components/LegalGate';
import Settings from './components/Settings';
import AgentConfig from './components/AgentConfig';
import PricingIntel from './components/PricingIntel';
import QAAudit from './components/QAAudit';
import { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'AGENT_ORCHESTRATOR':
        return <AgentTerminal />;
      case 'AGENT_CONFIG':
        return <AgentConfig />;
      case 'PRICING_INTEL':
        return <PricingIntel />;
      case 'QA_AUDIT':
        return <QAAudit />;
      case 'MARKET_HUNTER':
        return <MarketHunter />;
      case 'LEGAL_GATE':
        return <LegalGate />;
      case 'SETTINGS':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
