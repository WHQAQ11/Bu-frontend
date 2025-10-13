import axios, { AxiosResponse } from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

// 创建 axios 实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加认证头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理认证错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期或无效，清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 可以在这里添加重定向到登录页的逻辑
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  // 用户登录
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      console.error('登录失败:', error);
      throw new Error(error.response?.data?.message || '登录失败，请稍后重试');
    }
  }

  // 用户注册
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('注册失败:', error);
      throw new Error(error.response?.data?.message || '注册失败，请稍后重试');
    }
  }

  // 验证 token（获取当前用户信息）
  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      // 这里可以添加一个获取当前用户的 API 端点
      // 目前先从 localStorage 获取用户信息
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // 退出登录
  static logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // 保存认证信息到本地存储
  static saveAuthData(response: AuthResponse): void {
    if (response.success && response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  // 从本地存储加载认证信息
  static loadAuthData(): { token: string | null; user: User | null } {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return { token, user };
  }

  // 检查是否已登录
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
}