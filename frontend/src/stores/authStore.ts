import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 定义 State 和 Actions 的类型接口
interface UserInfo {
  id: string;
  email: string;
}

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  checkAuth: () => void; // 用于应用加载时检查认证状态
}

// 创建 store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Action: 设置用户信息
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      // Action: 设置 Access Token，并更新认证状态
      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },
      
      // Action: 登出操作
      logout: () => {
        // 在这里可以调用后端的登出接口
        // api.post('/auth/logout'); 
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      // Action: 应用初始化时检查认证状态
      checkAuth: () => {
        const token = get().accessToken;
        if (token) {
          set({ isAuthenticated: true });
          // 可选：在这里可以加一个API请求来验证token并获取最新的用户信息
        } else {
          set({ isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage', // local storage 中的 key
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ accessToken: state.accessToken }), // 只持久化 accessToken
    }
  )
);
