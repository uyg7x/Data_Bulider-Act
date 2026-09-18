import { useAppStore } from './store/appStore';
import { EnterpriseDashboard } from './components/EnterpriseDashboard';
import { Builder } from './components/Builder';
import { ExecutionLogs } from './components/ExecutionLogs';
import { LayoutDashboard, Workflow, ScrollText } from 'lucide-react';

function App() {
  const { currentTab, setCurrentTab } = useAppStore();

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'builder' as const, label: 'Builder', icon: Workflow },
    { id: 'logs' as const, label: 'Logs', icon: ScrollText },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Workflow size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">
              Pipeline<span className="text-blue-600">Builder</span>
            </h1>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    currentTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {currentTab === 'dashboard' && <EnterpriseDashboard />}
        {currentTab === 'builder' && <Builder />}
        {currentTab === 'logs' && <ExecutionLogs />}
      </main>
    </div>
  );
}

export default App;
