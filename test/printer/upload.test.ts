import { Printer } from '../../src/printer';

it('upload root', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'string',
                  format: 'binary',
                  description: 'A file',
                },
              },
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
    "/**
     * @description upload
     * @summary upload
     * @param data A file
     * @param [config] request config
     */
    export async function upload(data:Type.UploadData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "POST",
    url: "/upload",
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`"export type UploadData = Blob;"`);
  expect(result.zod.code).toMatchInlineSnapshot(`"export const zUploadData = z.instanceof(Blob);"`);
});

it('upload single', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'request param',
              required: true,
              schema: {
                type: 'string',
                enum: ['a', 'b'],
              },
            },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                      description: 'A file',
                      required: true,
                    },
                    name: {
                      type: 'string',
                      description: 'A name',
                    },
                  },
                },
              },
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
    "/**
     * @description upload
     * @summary upload
     * @param category request param
     * @param data request data
     * @param [config] request config
     */
    export async function upload(category:Type.UploadParams,data:Type.UploadData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "POST",
    url: "/upload",
    params: {"category": category},
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type UploadParams = ("a"|"b");
    export type UploadData = {
    /**
     * @description A file
     * @format binary
     */
    "file":Blob;
    /**
     * @description A name
     */
    "name"?:string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zUploadParams = z.union([z.literal("a"),z.literal("b")]);
    export const zUploadData = z.object({
    "file": z.instanceof(Blob),
    "name": z.optional(z.string()),
    });"
  `);
});

it('upload multiple', () => {
  const printer = new Printer({
    openapi: '3.1.0',
    info: {
      title: 'test',
      version: '1.0.0',
    },
    paths: {
      '/upload': {
        post: {
          tags: ['upload'],
          summary: 'upload',
          description: 'upload',
          operationId: 'upload',
          parameters: [
            {
              name: 'category',
              in: 'query',
              description: 'request param',
              required: true,
              schema: {
                type: 'string',
                enum: ['a', 'b'],
              },
            },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary',
                        description: 'A file',
                        required: true,
                      },
                    },
                    name: {
                      type: 'string',
                      description: 'A name',
                    },
                  },
                },
              },
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
    "/**
     * @description upload
     * @summary upload
     * @param category request param
     * @param data request data
     * @param [config] request config
     */
    export async function upload(category:Type.UploadParams,data:Type.UploadData,config?:AxiosRequestConfig) {
    const resp = await axios<unknown>({
      method: "POST",
    url: "/upload",
    params: {"category": category},
    data: data,
    ...config
    });
    return resp;
    }"
  `);
  expect(result.type.code).toMatchInlineSnapshot(`
    "export type UploadParams = ("a"|"b");
    export type UploadData = {
    "file"?:Array<Blob>;
    /**
     * @description A name
     */
    "name"?:string;
    };"
  `);
  expect(result.zod.code).toMatchInlineSnapshot(`
    "export const zUploadParams = z.union([z.literal("a"),z.literal("b")]);
    export const zUploadData = z.object({
    "file": z.optional(z.array(z.instanceof(Blob))),
    "name": z.optional(z.string()),
    });"
  `);
});
