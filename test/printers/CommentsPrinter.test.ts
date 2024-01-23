import { CommentsPrinter } from '../../src/printers/CommentsPrinter';

test('CommentsPrinter', () => {
    const printer = new CommentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [],
        paths: [],
    });

    expect(printer.printComments({})).toMatchInlineSnapshot('""');

    expect(
        printer.printComments({
            deprecated: true,
        }),
    ).toMatchInlineSnapshot(`
    "/**
     * @deprecated
     */"
  `);

    expect(
        printer.printComments({
            deprecated: true,
            title: '一个注释标题',
            description: '一个注释描述\n第 2 行描述\n第 3 行描述',
            format: 'username',
            example: 'const a = 1;\nconst b = 2;',
            default: '"张三"',
        }),
    ).toMatchInlineSnapshot(`
      "/**
       * @deprecated
       * @title 一个注释标题
       * @description 一个注释描述
       * 第 2 行描述
       * 第 3 行描述
       * @format username
       * @default "张三"
       * @example const a = 1;
       * const b = 2;
       */"
    `);
});
