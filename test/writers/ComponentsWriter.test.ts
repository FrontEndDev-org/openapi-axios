import { ComponentsWriter } from '../../src/writers/ComponentsWriter';

test('empty components', () => {
  const writer = new ComponentsWriter({
    info: {
      title: 'test',
      version: '1.0.0',
      baseURL: '/',
    },
    components: [],
    paths: [],
  });
  const text = writer.writeComponents();
  expect(text).toEqual('');
});

test('alias', () => {
  const writer = new ComponentsWriter({
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
        ref: '',
        root: true,
        description: 'd1',
      },
      {
        kind: 'alias',
        name: 'O',
        target: 'P',
        origin: 'Q',
        props: ['q1', 'q2'],
        ref: '',
        root: true,
        description: 'd2',
      },
    ],
    paths: [],
  });
  const text = writer.writeComponents();
  expect(text).toMatchInlineSnapshot(`
    "/**
     * @description d1
     */
    export type O = Q;

    /**
     * @description d2
     */
    export type O = Q['q1']['q2'];
    "
  `);
});

test('origin primitive', () => {
  const writer = new ComponentsWriter({
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
  const text = writer.writeComponents();
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

    export type N2 = never;
    "
  `);
});

test('origin enum', () => {
  const writer = new ComponentsWriter({
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
  const text = writer.writeComponents();
  expect(text).toMatchInlineSnapshot(`
    "/**
     * @description ddd1
     */
    export type N1 = 'aaa' | 'bbb' | 'ccc';
    "
  `);
});

test('origin object', () => {
  const writer = new ComponentsWriter({
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
            ref: '',
            root: false,
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
                ref: '',
                root: false,
              },
            ],
          },
        ],
      },
    ],
    paths: [],
  });
  const text = writer.writeComponents();
  expect(text).toMatchInlineSnapshot(`
    "/**
     * @description ddd1
     */
    export type O1 = {
      /**
       * @description ddd2
       */
      sss: string;
      /**
       * @description ddd3
       */
      ooo: Q['q1']['q2'];
      ppp: { nnn: number; qqq: X };
    };
    "
  `);
});

test('origin array', () => {
  const writer = new ComponentsWriter({
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
            type: 'object',
            name: 'O1',
            required: true,
            description: 'ddd2',
            children: [
              {
                kind: 'origin',
                type: 'string',
                name: 'sss',
                required: true,
              },
              {
                kind: 'alias',
                name: 'ooo',
                target: 'P',
                origin: 'Q',
                props: ['q1', 'q2'],
                ref: '',
                root: false,
              },
              {
                kind: 'origin',
                type: 'object',
                name: 'ppp',
                required: true,
                description: 'ddd3',
                children: [
                  {
                    kind: 'origin',
                    type: 'number',
                    name: 'nnn',
                    required: true,
                    description: 'ddd4',
                  },
                  {
                    kind: 'alias',
                    name: 'qqq',
                    target: 'X',
                    origin: 'X',
                    props: [],
                    ref: '',
                    root: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    paths: [],
  });
  const text = writer.writeComponents();
  expect(text).toMatchInlineSnapshot(`
    "/**
     * @description ddd1
     */
    export type A = Array<{
      sss: string;
      ooo: Q['q1']['q2'];
      /**
       * @description ddd3
       */
      ppp: {
        /**
         * @description ddd4
         */
        nnn: number;
        qqq: X;
      };
    }>;
    "
  `);
});
