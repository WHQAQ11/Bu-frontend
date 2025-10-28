import axios, { AxiosResponse } from "axios";
import {
  AIInterpretationRequest,
  AIInterpretationResponse,
} from "@/types/divination";

// 创建占卜API专用的axios实例
const divinationApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3005/api",
  timeout: 30000, // 30秒超时，AI分析可能需要更长时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：添加认证头（如果需要）
divinationApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器：处理错误
divinationApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("占卜API请求失败:", error);

    // 处理网络错误
    if (error.code === "NETWORK_ERROR") {
      throw new Error("网络连接失败，请检查网络设置");
    }

    // 处理超时
    if (error.code === "ECONNABORTED") {
      throw new Error("请求超时，请稍后重试");
    }

    // 处理服务器错误
    if (error.response?.status >= 500) {
      throw new Error("服务器内部错误，请稍后重试");
    }

    // 处理其他错误
    const errorMessage = error.response?.data?.message || error.message || "请求失败";
    throw new Error(errorMessage);
  },
);

export class DivinationService {
  /**
   * 获取AI智能解析（快速接口）
   * @param data 占卜数据
   * @returns AI解析结果
   */
  static async getAIInterpretation(
    data: AIInterpretationRequest
  ): Promise<AIInterpretationResponse> {
    try {
      const response: AxiosResponse<AIInterpretationResponse> =
        await divinationApi.post("/divination/quick-interpret", data);
      return response.data;
    } catch (error: any) {
      console.error("获取AI解析失败:", error);
      throw error;
    }
  }
}