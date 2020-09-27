/**
 * 检查值是否存在
 * 为了 避开 0 和 false
 * @param value
 */
export default (value: any) => value !== undefined && value !== null;
