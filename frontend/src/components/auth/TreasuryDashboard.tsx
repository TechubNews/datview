import { useState, useEffect } from 'react';
import { getHoldings, Holding } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Bitcoin, DollarSign, Building2, TrendingUp } from 'lucide-react';

// 主仪表盘组件
export function TreasuryDashboard() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 在组件加载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHoldings();
        setHoldings(data);
      } catch (err) {
        setError('无法加载数据，请稍后重试。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 格式化大数字的辅助函数
  const formatCurrency = (value: number) => {
    if (!value) return '$0';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  // 渲染加载中的骨架屏
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // 渲染错误信息
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // --- 衍生数据计算 (示例) ---
  const totalCompanies = new Set(holdings.map(h => h.company.id)).size;
  // 注意：这里的实时价值需要一个BTC价格API，暂时用一个假数据
  const FAKE_BTC_PRICE_USD = 65000; 
  const totalValueUSD = holdings.reduce((sum, h) => sum + h.quantity * FAKE_BTC_PRICE_USD, 0);
  const totalBTC = holdings.reduce((sum, h) => sum + h.quantity, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">加密资产财库监控</h1>
        <p className="text-muted-foreground">实时追踪各大机构的加密货币持仓</p>
      </header>
      
      {/* 顶部摘要卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总持仓价值 (USD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValueUSD)}</div>
            <p className="text-xs text-muted-foreground">所有追踪公司的总价值</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总持仓量 (BTC)</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBTC.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">所有追踪公司的总持仓</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">追踪公司数量</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">当前平台追踪的公司总数</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">市场情绪 (示例)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+5.2%</div>
            <p className="text-xs text-muted-foreground">相比上周持仓变化</p>
          </CardContent>
        </Card>
      </div>

      {/* 持仓数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle>机构持仓列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>公司</TableHead>
                <TableHead>资产</TableHead>
                <TableHead className="text-right">持有数量</TableHead>
                <TableHead className="text-right">当前价值 (USD)</TableHead>
                <TableHead className="text-right">平均买入成本 (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.length > 0 ? (
                holdings.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <div className="font-medium">{holding.company.name}</div>
                      <div className="text-sm text-muted-foreground">{holding.company.ticker}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{holding.asset.symbol}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{holding.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.quantity * FAKE_BTC_PRICE_USD)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(holding.avg_cost_basis_usd)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    暂无数据。请通过管理后台添加持仓记录。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
