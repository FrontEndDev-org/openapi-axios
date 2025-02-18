import { VarPath } from '../../src/printer/VarPath';

describe('构造函数', () => {
  it('应正确解析包含段落和参数的路径', () => {
    const varPath = new VarPath('/users/{userId}/posts/{postId}');
    expect(varPath.props).toEqual(['userId', 'postId']);
  });
});

describe('toString', () => {
  it('应使用提供的值替换路径变量', () => {
    const varPath = new VarPath('/users/{userId}/posts/{postId}');
    const result = varPath.toString({ userId: 'aa', postId: 'bb["cc"]' });
    // eslint-disable-next-line no-template-curly-in-string
    expect(result).toBe('`/users/${aa}/posts/${bb["cc"]}`');
  });

  it('如果缺少必需的变量应抛出错误', () => {
    const varPath = new VarPath('/users/{userId}/posts/{postId}');
    expect(() => varPath.toString({ userId: '123' })).toThrow();
  });
});

describe('toPattern', () => {
  it('应为路径生成正则表达式模式', () => {
    const varPath = new VarPath('/users/{userId}/posts/{postId}');
    const pattern = varPath.toPattern();
    expect(pattern).toBe('/^\\/users\\/[^/]+\\/posts\\/[^/]+$/');
  });

  it('如果没有参数应返回路径字符串', () => {
    const varPath = new VarPath('/users/posts');
    const pattern = varPath.toPattern();
    expect(pattern).toBe('"/users/posts"');
  });
});
