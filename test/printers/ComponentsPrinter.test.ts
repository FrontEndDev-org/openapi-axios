import { ComponentsPrinter } from '../../src/printers/ComponentsPrinter';

test('empty components', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toEqual('');
});

test('alias', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'alias',
                name: 'O',
                target: 'P',
                origin: 'Q',
                props: [],
                refAble: true,
                required: true,
                description: 'd1',
            },
            {
                kind: 'alias',
                name: 'O',
                target: 'P',
                origin: 'Q',
                props: ['q1', 'q2'],
                refAble: true,
                required: true,
                description: 'd2',
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description d1
       */
      export type O = Q;

      /**
       * @description d2
       */
      export type O = Q["q1"]["q2"];"
    `);
});

test('origin primitive', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'number',
                name: 'N1',
                required: true,
                description: 'ddd1',
            },
            {
                kind: 'origin',
                type: 'string',
                name: 'S1',
                required: true,
                description: 'ddd2',
            },
            {
                kind: 'origin',
                type: 'boolean',
                name: 'B1',
                required: true,
            },
            {
                kind: 'origin',
                type: 'never',
                name: 'N2',
                required: true,
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type N1 = number;

      /**
       * @description ddd2
       */
      export type S1 = string;

      export type B1 = boolean;

      export type N2 = never;"
    `);
});

test('origin enum', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'string',
                name: 'N1',
                required: true,
                description: 'ddd1',
                enum: ['aaa', 'bbb', 'ccc'],
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type N1 = "aaa"|"bbb"|"ccc";"
    `);
});

test('origin object', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'object',
                name: 'O1',
                required: true,
                description: 'ddd1',
                children: [
                    {
                        kind: 'origin',
                        type: 'string',
                        name: 'sss',
                        required: true,
                        description: 'ddd2',
                    },
                    {
                        kind: 'alias',
                        name: 'ooo',
                        target: 'P',
                        origin: 'Q',
                        props: ['q1', 'q2'],
                        refAble: false,
                        required: false,
                        description: 'ddd3',
                    },
                    {
                        kind: 'origin',
                        type: 'object',
                        name: 'ppp',
                        required: true,
                        children: [
                            {
                                kind: 'origin',
                                type: 'number',
                                name: 'nnn',
                                required: true,
                            },
                            {
                                kind: 'alias',
                                name: 'qqq',
                                target: 'X',
                                origin: 'X',
                                props: [],
                                refAble: false,
                                required: false,
                            },
                        ],
                    },
                ],
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type O1 = {/**
       * @description ddd2
       */
      sss:string;
      /**
       * @description ddd3
       */
      ooo?:Q["q1"]["q2"];
      ppp:{nnn:number;
      qqq?:X;};};"
    `);
});

test('origin object additional', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'object',
                name: 'O1',
                required: true,
                description: 'ddd1',
                children: [
                    {
                        kind: 'origin',
                        type: 'string',
                        name: 'sss',
                        required: true,
                        description: 'ddd2',
                    },
                    {
                        kind: 'alias',
                        name: 'ooo',
                        target: 'P',
                        origin: 'Q',
                        props: ['q1', 'q2'],
                        refAble: false,
                        required: false,
                        description: 'ddd3',
                    },
                    {
                        kind: 'origin',
                        type: 'object',
                        name: 'ppp',
                        required: true,
                        children: [
                            {
                                kind: 'origin',
                                type: 'number',
                                name: 'nnn',
                                required: true,
                            },
                            {
                                kind: 'alias',
                                name: 'qqq',
                                target: 'X',
                                origin: 'X',
                                props: [],
                                refAble: false,
                                required: false,
                            },
                            {
                                format: 'int32',
                                name: '[key: string]',
                                type: 'number',
                                required: true,
                                kind: 'origin',
                            },
                        ],
                    },
                ],
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type O1 = {/**
       * @description ddd2
       */
      sss:string;
      /**
       * @description ddd3
       */
      ooo?:Q["q1"]["q2"];
      ppp:{nnn:number;
      qqq?:X;
      /**
       * @format int32
       */
      [key: string]:number;};};"
    `);
});

test('origin array', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'array',
                name: 'A',
                required: true,
                description: 'ddd1',
                children: [
                    {
                        kind: 'origin',
                        name: 'A[]',
                        type: 'string',
                        required: false,
                        description: 'ddd2',
                    },
                ],
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type A = Array</**
       * @description ddd2
       */
      string>;"
    `);
});

test('origin array additional', () => {
    const printer = new ComponentsPrinter({
        info: {
            title: 'test',
            version: '1.0.0',
            baseURL: '/',
        },
        components: [
            {
                kind: 'origin',
                type: 'array',
                name: 'A',
                required: true,
                description: 'ddd1',
                children: [
                    {
                        kind: 'origin',
                        name: 'A[]',
                        type: 'string',
                        required: false,
                        description: 'ddd2',
                    },
                    {
                        kind: 'alias',
                        name: '[key: string]',
                        target: 'T',
                        origin: 'T',
                        props: [],
                        refAble: false,
                        required: false,
                        ref: '#/components/schema/T',
                        description: 'ddd3',
                    },
                ],
            },
        ],
        paths: [],
    });
    const text = printer.printComponents();
    expect(text).toMatchInlineSnapshot(`
      "/**
       * @description ddd1
       */
      export type A = Array</**
       * @description ddd2
       */
      string|/**
       * @description ddd3
       */
      T>;"
    `);
});
