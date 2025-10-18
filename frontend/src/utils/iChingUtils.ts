/**
 * 《易经》卦象查询工具
 * 提供完整的64卦数据库和查询功能
 */

// 卦象信息接口
export interface HexagramInfo {
  key: string; // 6位二进制字符串，1为阳，0为阴，从下到上
  name: string; // 中文卦名
  pinyin?: string; // 拼音（可选，未来扩展）
  number?: number; // 卦序（可选，未来扩展）
}

// 64卦完整数据库
// 键：6位二进制字符串（1=阳爻，0=阴爻），顺序为从下到上（初爻到上爻）
export const HEXAGRAMS_DATA: Record<string, HexagramInfo> = {
  "000000": { key: "000000", name: "坤为地", number: 2 },
  "000001": { key: "000001", name: "地雷复", number: 24 },
  "000010": { key: "000010", name: "地水师", number: 7 },
  "000011": { key: "000011", name: "地泽临", number: 19 },
  "000100": { key: "000100", name: "地山谦", number: 15 },
  "000101": { key: "000101", name: "地风升", number: 46 },
  "000110": { key: "000110", name: "地火明夷", number: 36 },
  "000111": { key: "000111", name: "地天泰", number: 11 },

  "001000": { key: "001000", name: "雷地豫", number: 16 },
  "001001": { key: "001001", name: "雷天大壮", number: 34 },
  "001010": { key: "001010", name: "雷水解", number: 40 },
  "001011": { key: "001011", name: "雷泽归妹", number: 54 },
  "001100": { key: "001100", name: "雷山小过", number: 62 },
  "001101": { key: "001101", name: "雷风恒", number: 32 },
  "001110": { key: "001110", name: "雷火丰", number: 55 },
  "001111": { key: "001111", name: "雷天大壮", number: 34 }, // 修正：应该是雷天大壮

  "010000": { key: "010000", name: "水地比", number: 8 },
  "010001": { key: "010001", name: "水雷屯", number: 3 },
  "010010": { key: "010010", name: "坎为水", number: 29 },
  "010011": { key: "010011", name: "水泽节", number: 60 },
  "010100": { key: "010100", name: "水山蹇", number: 39 },
  "010101": { key: "010101", name: "水风井", number: 48 },
  "010110": { key: "010110", name: "水火既济", number: 63 },
  "010111": { key: "010111", name: "水天需", number: 5 },

  "011000": { key: "011000", name: "泽地萃", number: 45 },
  "011001": { key: "011001", name: "泽雷随", number: 17 },
  "011010": { key: "011010", name: "泽水困", number: 47 },
  "011011": { key: "011011", name: "兑为泽", number: 58 },
  "011100": { key: "011100", name: "泽山咸", number: 31 },
  "011101": { key: "011101", name: "泽风大过", number: 28 },
  "011110": { key: "011110", name: "泽火革", number: 49 },
  "011111": { key: "011111", name: "泽天夬", number: 43 },

  "100000": { key: "100000", name: "山地剥", number: 23 },
  "100001": { key: "100001", name: "山雷颐", number: 27 },
  "100010": { key: "100010", name: "山水蒙", number: 4 },
  "100011": { key: "100011", name: "山泽损", number: 41 },
  "100100": { key: "100100", name: "艮为山", number: 52 },
  "100101": { key: "100101", name: "山风蛊", number: 18 },
  "100110": { key: "100110", name: "山火贲", number: 22 },
  "100111": { key: "100111", name: "山天大畜", number: 26 },

  "101000": { key: "101000", name: "风地观", number: 20 },
  "101001": { key: "101001", name: "风雷益", number: 42 },
  "101010": { key: "101010", name: "风水涣", number: 59 },
  "101011": { key: "101011", name: "风泽中孚", number: 61 },
  "101100": { key: "101100", name: "风山渐", number: 53 },
  "101101": { key: "101101", name: "巽为风", number: 57 },
  "101110": { key: "101110", name: "风火家人", number: 37 },
  "101111": { key: "101111", name: "风天小畜", number: 9 },

  "110000": { key: "110000", name: "火地晋", number: 35 },
  "110001": { key: "110001", name: "火雷噬嗑", number: 21 },
  "110010": { key: "110010", name: "火水未济", number: 64 },
  "110011": { key: "110011", name: "火泽睽", number: 38 },
  "110100": { key: "110100", name: "火山旅", number: 56 },
  "110101": { key: "110101", name: "火风鼎", number: 50 },
  "110110": { key: "110110", name: "离为火", number: 30 },
  "110111": { key: "110111", name: "火天大有", number: 14 },

  "111000": { key: "111000", name: "天地否", number: 12 },
  "111001": { key: "111001", name: "天雷无妄", number: 25 },
  "111010": { key: "111010", name: "天水讼", number: 6 },
  "111011": { key: "111011", name: "天泽履", number: 10 },
  "111100": { key: "111100", name: "天山遁", number: 33 },
  "111101": { key: "111101", name: "天风姤", number: 44 },
  "111110": { key: "111110", name: "天火同人", number: 13 },
  "111111": { key: "111111", name: "乾为天", number: 1 },
};

// 爻信息接口（临时定义，避免循环依赖）
export interface YaoInfo {
  value: number; // 6(老阴), 7(少阳), 8(少阴), 9(老阳)
  isChanging: boolean; // 是否为动爻
}

/**
 * 根据爻线数组获取卦象信息
 * @param yaoLines 6条爻的数组，顺序为从下到上（初爻到上爻）
 * @returns 对应的卦象信息，如果找不到则返回undefined
 */
export const getHexagramInfo = (
  yaoLines: YaoInfo[],
): HexagramInfo | undefined => {
  // 验证输入
  if (!yaoLines || yaoLines.length !== 6) {
    console.warn("getHexagramInfo: 输入必须是6条爻");
    return undefined;
  }

  try {
    // 将爻值转换为二进制字符串
    // 7或9（阳）-> '1'，6或8（阴）-> '0'
    // 注意：数组顺序是从下到上（初爻在索引0），这符合我们的二进制编码规则
    const binaryKey = yaoLines
      .map((yao) => ([7, 9].includes(yao.value) ? "1" : "0"))
      .join("");

    // 查找对应的卦象信息
    const hexagramInfo = HEXAGRAMS_DATA[binaryKey];

    if (!hexagramInfo) {
      console.warn(
        `getHexagramInfo: 找不到对应的卦象，二进制key: ${binaryKey}`,
      );
      return undefined;
    }

    return hexagramInfo;
  } catch (error) {
    console.error("getHexagramInfo: 计算卦象信息时出错", error);
    return undefined;
  }
};

/**
 * 根据爻值数组获取卦象信息（简化版本）
 * @param yaoValues 6个爻值的数组 [6,7,8,9]
 * @returns 对应的卦象信息
 */
export const getHexagramInfoByValues = (
  yaoValues: number[],
): HexagramInfo | undefined => {
  if (!yaoValues || yaoValues.length !== 6) {
    return undefined;
  }

  // 转换为YaoInfo格式
  const yaoLines: YaoInfo[] = yaoValues.map((value) => ({
    value,
    isChanging: [6, 9].includes(value), // 老阴和老阳为动爻
  }));

  return getHexagramInfo(yaoLines);
};

/**
 * 获取所有卦象名称列表
 * @returns 所有卦象名称的数组
 */
export const getAllHexagramNames = (): string[] => {
  return Object.values(HEXAGRAMS_DATA).map((hexagram) => hexagram.name);
};

/**
 * 根据卦序获取卦象信息
 * @param number 卦序（1-64）
 * @returns 对应的卦象信息
 */
export const getHexagramByNumber = (
  number: number,
): HexagramInfo | undefined => {
  return Object.values(HEXAGRAMS_DATA).find(
    (hexagram) => hexagram.number === number,
  );
};

/**
 * 搜索卦象（按名称）
 * @param keyword 搜索关键词
 * @returns 匹配的卦象列表
 */
export const searchHexagrams = (keyword: string): HexagramInfo[] => {
  if (!keyword.trim()) {
    return [];
  }

  const searchTerm = keyword.toLowerCase();
  return Object.values(HEXAGRAMS_DATA).filter((hexagram) =>
    hexagram.name.toLowerCase().includes(searchTerm),
  );
};
