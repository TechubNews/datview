import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// 创建一个 axios 实例，配置后端 API 的基础 URL
const api = axios.create({
  baseURL: 'http://localhost:3000', // 你的 NestJS 后端地址
  withCredentials: true,
});

// --- 数据类型定义 (与后端实体对应) ---

export interface Company {
  id: string;
  name: string;
  ticker: string;
  category: string;
  sector: string;
  country: string;
  website_url: string;
  logo_url: string;
  description: string;
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo_url: string;
}

export interface Holding {
  id: string;
  quantity: number;
  avg_cost_basis_usd: number;
  first_purchase_date: string;
  company: Company; // 嵌套的公司信息
  asset: Asset;     // 嵌套的资产信息
}


// --- API 调用函数 ---

/**
 * 从后端获取所有持仓记录
 * 这些记录将包含关联的公司和资产信息
 * @returns {Promise<Holding[]>} 持仓记录数组
 */
export const getHoldings = async (): Promise<Holding[]> => {
  try {
    const response = await api.get('/holdings');
    return response.data;
  } catch (error) {
    console.error('获取持仓数据失败:', error);
    // 在实际应用中，这里可以进行更复杂的错误处理
    // 例如，返回一个空数组或抛出一个自定义错误
    return [];
  }
};


// --- 认证相关的拦截器 (保持不变) ---

// 请求拦截器：在每个请求中附加 Access Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// (响应拦截器等其他代码保持不变...)

export default api;

