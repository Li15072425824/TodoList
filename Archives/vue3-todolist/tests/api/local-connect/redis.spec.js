jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    hset: jest.fn(),
    hget: jest.fn(),
    hdel: jest.fn(),
    hgetall: jest.fn(),
  })),
}));

import { parseJsonSafe, normalizeTodoId, mapHashToList } from '../../../api/local-connect/redis.js';

/**
 * **功能**：Redis 工具类单元测试套件。
 * **参数**：无
 * **返回**：void
 */

describe('Redis Utilities', () => {
  /**
   * **功能**：测试 JSON 安全解析功能。
   * **参数**：无
   * **返回**：void
   */

  describe('parseJsonSafe', () => {
    /**
     * **功能**：验证能否正确解析合法的 JSON 字符串。
     * **参数**：无
     * **返回**：void
     */

    it('should parse valid JSON strings', () => {
      const json = '{"id": 1, "content": "test"}';
      expect(parseJsonSafe(json)).toEqual({ id: 1, content: "test" });
    });

    /**
     * **功能**：验证当输入非字符串时，是否原样返回。
     * **参数**：无
     * **返回**：void
     */

    it('should return the original value if it is not a string', () => {
      expect(parseJsonSafe(123)).toBe(123);
      expect(parseJsonSafe(null)).toBe(null);
    });

    /**
     * **功能**：验证当输入非合法 JSON 字符串时，是否原样返回。
     * **参数**：无
     * **返回**：void
     */

    it('should return the original string if it is not valid JSON', () => {
      const invalidJson = '{invalid}';
      expect(parseJsonSafe(invalidJson)).toBe(invalidJson);
    });
  });

  /**
   * **功能**：测试 ID 规范化功能。
   * **参数**：无
   * **返回**：void
   */

  describe('normalizeTodoId', () => {
    /**
     * **功能**：验证能否将数字类型的 ID 转换为字符串。
     * **参数**：无
     * **返回**：void
     */

    it('should convert number ID to string', () => {
      expect(normalizeTodoId(123)).toBe('123');
    });

    /**
     * **功能**：验证字符串类型的 ID 是否保持不变。
     * **参数**：无
     * **返回**：void
     */

    it('should keep string ID as string', () => {
      expect(normalizeTodoId('456')).toBe('456');
    });
  });

  /**
   * **功能**：测试 Hash 数据转换为列表的功能。
   * **参数**：无
   * **返回**：void
   */

  describe('mapHashToList', () => {
    /**
     * **功能**：验证当输入数据为空时，是否返回空数组。
     * **参数**：无
     * **返回**：void
     */

    it('should return an empty array if hashData is null', () => {
      expect(mapHashToList(null)).toEqual([]);
    });

    /**
     * **功能**：验证能否将 Hash 对象的值转换为已解析的 JSON 对象列表。
     * **参数**：无
     * **返回**：void
     */

    it('should map hash object values to a list and parse JSON', () => {
      const hashData = {
        '1': '{"id": 1, "content": "test1"}',
        '2': '{"id": 2, "content": "test2"}'
      };
      const result = mapHashToList(hashData);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ id: 1, content: "test1" });
      expect(result).toContainEqual({ id: 2, content: "test2" });
    });
  });
});
