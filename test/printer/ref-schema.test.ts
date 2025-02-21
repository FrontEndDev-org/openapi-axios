import { Printer } from '../../src/printer';

it('ref $id', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'Test',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {
        AxiosRequestConfig: {
          $id: '#/components/schemas/t0',
          type: 'object',
          description: '11',
          properties: {
            aa: {
              type: 'string',
              description: '22',
            },
          },
        },
        T1: {
          type: 'object',
          properties: {
            t0: {
              $ref: '#/components/schemas/t0',
              description: '33',
            },
            t1: {
              $ref: '#/components/schemas/AxiosRequestConfig',
            },
          },
        },
      },
    },
  });
  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name AxiosRequestConfig
     * @description 11
     */
    export type AxiosRequestConfig_2 = {
    /**
     * @description 22
     */
    "aa"?:string;
    };
    /**
     * @name T1
     */
    export type T1 = {
    /**
     * @description 33
     */
    "t0"?:AxiosRequestConfig_2;
    "t1"?:AxiosRequestConfig_2;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zAxiosRequestConfig2 = z.object({
    "aa": z.optional(z.string()),
    });
    export const zT1 = z.object({
    "t0": z.optional(zAxiosRequestConfig2),
    "t1": z.optional(zAxiosRequestConfig2),
    });"
  `);
});

it('ref $anchor', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'Test',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {
        T0: {
          $id: 'tttt0',
          type: 'object',
          properties: {
            aa: {
              type: 'string',
              format: 'uuid',
              $anchor: 'aa',
            },
            bb: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  cc: {
                    $ref: '#/components/schemas/T0#aa',
                  },
                  dd: {
                    type: 'number',
                    $anchor: 'dd',
                  },
                },
              },
            },
          },
        },
        T1: {
          type: 'object',
          properties: {
            aa: {
              $ref: '#/components/schemas/T0#aa',
            },
            dd: {
              $ref: 'tttt0#dd',
            },
          },
        },
      },
    },
  });
  const result = printer.print({
    hideImports: true,
    hideHeaders: true,
    hideFooters: true,
    hideInfo: true,
    hideAlert: true,
  });

  expect(result.main.code).toMatchInlineSnapshot(`
    "
    type AxiosRequestConfig = Parameters<typeof axios.request>[0];
    "
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name T0
     */
    export type T0 = {
    /**
     * @format uuid
     */
    "aa"?:string;
    "bb"?:Array<{
    "cc"?:T0Aa;
    "dd"?:number;
    }>;
    };
    /**
     * @name #/components/schemas/T0#aa
     * @format uuid
     */
    export type T0Aa = string;
    /**
     * @name #/components/schemas/T0#dd
     */
    export type T0Dd = number;
    /**
     * @name T1
     */
    export type T1 = {
    "aa"?:T0Aa;
    "dd"?:T0Dd;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zT0Aa = z.string();
    export const zT0 = z.object({
    "aa": z.optional(z.string()),
    "bb": z.optional(z.array(z.object({
    "cc": z.optional(zT0Aa),
    "dd": z.optional(z.number()),
    }))),
    });
    export const zT0Dd = z.number();
    export const zT1 = z.object({
    "aa": z.optional(zT0Aa),
    "dd": z.optional(zT0Dd),
    });"
  `);
});
