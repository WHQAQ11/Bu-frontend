// AI解析请求接口（匹配后端 /divination/quick-interpret）
export interface AIInterpretationRequest {
  method: string;
  question: string;
  hexagram_name: string;
  hexagram_info: {
    upperTrigram: string;
    lowerTrigram: string;
    changingYao?: number;
    interpretation: {
      guaci: string;
      yaoci?: string[];
      shiyi?: string;
      analysis?: string;
    };
  };
  // 可选参数
  style?: 'traditional' | 'modern' | 'detailed' | 'concise';
  focus?: 'career' | 'relationship' | 'health' | 'wealth' | 'general';
  language?: 'chinese' | 'bilingual';
}

// AI解析响应接口
export interface AIInterpretationResponse {
  success: boolean;
  message: string;
  data: {
    log_id?: number;
    method: string;
    question: string;
    result: any;
    ai_interpretation: string;
    timestamp: string;
  };
}