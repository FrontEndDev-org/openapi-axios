import { Printer } from '../../src/printer';

it('v3.1 schema', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: '1',
      version: '2',
      description: '3',
    },
    components: {
      schemas: {
        Category: {
          title: 'Category Title',
          description: 'Category Description',
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Dogs',
            },
          },
          xml: {
            name: 'Category',
          },
        },
        Pet: {
          properties: {
            id: {
              type: 'integer',
              format: 'int64',
            },
            category: {
              $ref: '#/components/schemas/Category',
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

  expect(result.main.code).toMatchInlineSnapshot(`""`);
  expect(result.type.code).toMatchInlineSnapshot(`
    "/**
     * @name Category
     * @summary Category Title
     * @description Category Description
     */
    export type Category = {
    /**
     * @format int64
     * @example 1
     */
    "id"?:number;
    /**
     * @example Dogs
     */
    "name"?:string;
    };
    /**
     * @name Pet
     */
    export type Pet = {
    /**
     * @format int64
     */
    "id"?:number;
    "category"?:Category;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zCategory = z.object({
    "id": z.optional(z.number()),
    "name": z.optional(z.string()),
    });
    export const zPet = z.object({
    "id": z.optional(z.number()),
    "category": z.optional(zCategory),
    });"
  `);
});
