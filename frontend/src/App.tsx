// 修复：更新导入路径以匹配文件的实际位置
import { TreasuryDashboard } from './components/auth/TreasuryDashboard';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <TreasuryDashboard />
      </div>
    </div>
  );
}

export default App;

