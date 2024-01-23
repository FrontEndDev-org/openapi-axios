import { OpenAPIV3 } from 'openapi-types';
import { PathsParser } from '../../src/parsers/PathsParser';
import type { TypeOperations } from '../../src/parsers/types';
import HttpMethods = OpenAPIV3.HttpMethods;

test('empty paths keys', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {},
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([]);
});

test('empty path item keys', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {},
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([]);
});

test('empty path item method responses keys', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    responses: {},
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'getPet',
            method: OpenAPIV3.HttpMethods.GET,
            url: '/pet',
            request: {},
            response: {},
        },
    ]);
});

test('empty path item method responses keys + specify operationId', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'findPet',
                    responses: {},
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            method: OpenAPIV3.HttpMethods.GET,
            url: '/pet',
            request: {},
            response: {},
        },
    ]);
});

test('custom name formatter', async () => {
    const parser = new PathsParser(
        {
            info: {
                title: 'test',
                version: '1.0.0',
            },
            openapi: '3.0.0',
            paths: {
                '/pet': {
                    get: {
                        operationId: 'findPet',
                        responses: {},
                    },
                },
                '/cat': {
                    get: {
                        responses: {},
                    },
                },
            },
        },
        {
            nameFormatter: ({ name /*, method, url, operationId*/ }) => {
                return `custom_${name}`;
            },
        },
    );

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: `custom_getCat`,
            method: OpenAPIV3.HttpMethods.GET,
            url: '/cat',
            request: {},
            response: {},
        },
        {
            name: `custom_findPet`,
            method: OpenAPIV3.HttpMethods.GET,
            url: '/pet',
            request: {},
            response: {},
        },
    ]);
});

test('operationId is reserved', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'export',
                    responses: {},
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'export2',
            method: OpenAPIV3.HttpMethods.GET,
            url: '/pet',
            request: {},
            response: {},
        },
    ]);
});

test('resp ref', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'findPet',
                    responses: {
                        200: {
                            description: '',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/T',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                T: {
                    type: 'string',
                },
            },
        },
    });

    parser.parseComponents();
    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            url: '/pet',
            method: HttpMethods.GET,
            request: {},
            response: {
                body: {
                    kind: 'alias',
                    refAble: false,
                    required: true,
                    name: 'FindPetResData',
                    target: 'T',
                    origin: 'T',
                    props: [],
                    ref: '#/components/schemas/T',
                },
            },
        },
    ]);
});

test('resp type', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'findPet',
                    responses: {
                        200: {
                            description: '',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            method: OpenAPIV3.HttpMethods.GET,
            url: '/pet',
            request: {},
            response: {
                body: {
                    kind: 'origin',
                    name: 'FindPetResData',
                    required: false,
                    type: 'string',
                },
            },
        },
    ]);
});

test('req body', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'findPet',
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        p: {
                                            type: 'string',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {},
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            method: HttpMethods.GET,
            url: '/pet',
            request: {
                body: {
                    kind: 'origin',
                    name: 'FindPetReqData',
                    type: 'object',
                    required: false,
                    children: [
                        {
                            kind: 'origin',
                            name: 'p',
                            type: 'string',
                            required: false,
                        },
                    ],
                },
            },
            response: {},
        },
    ]);
});

test('req file', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet': {
                get: {
                    operationId: 'findPet',
                    requestBody: {
                        content: {
                            'application/octet-stream': {
                                schema: {
                                    type: 'string',
                                    format: 'binary',
                                },
                            },
                        },
                    },
                    responses: {},
                },
            },
        },
    });

    const t = parser.parsePaths();
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            method: HttpMethods.GET,
            url: '/pet',
            request: {
                body: {
                    kind: 'alias',
                    name: 'FindPetReqData',
                    origin: 'Blob',
                    props: [],
                    refAble: false,
                    required: true,
                    target: 'Blob',
                },
            },
            response: {},
        },
    ]);
});

test('req query + path', async () => {
    const parser = new PathsParser({
        info: {
            title: 'test',
            version: '1.0.0',
        },
        openapi: '3.0.0',
        paths: {
            '/pet/{name}': {
                get: {
                    operationId: 'findPet',
                    parameters: [
                        {
                            name: 'name',
                            in: 'path',
                            required: true,
                            schema: {
                                $ref: '#/components/schemas/O/p',
                            },
                        },
                        {
                            name: 'status',
                            in: 'query',
                            description: 'Status values that need to be considered for filter',
                            required: false,
                            explode: true,
                            schema: {
                                type: 'string',
                                default: 'available',
                                enum: ['available', 'pending', 'sold'],
                            },
                        },
                    ],
                    responses: {},
                },
            },
        },
        components: {
            schemas: {
                O: {
                    type: 'object',
                    properties: {
                        P: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    });

    parser.parseComponents();
    const t = parser.parsePaths();
    // console.log(JSON.stringify(t));
    expect(t).toEqual<TypeOperations>([
        {
            name: 'findPet',
            method: 'get',
            url: '/pet/{name}',
            request: {
                path: {
                    kind: 'origin',
                    name: 'FindPetReqPath',
                    type: 'object',
                    required: true,
                    children: [
                        {
                            kind: 'alias',
                            refAble: false,
                            required: true,
                            name: 'name',
                            ref: '#/components/schemas/O/p',
                            target: 'O',
                            origin: 'O',
                            props: ['p'],
                        },
                    ],
                },
                query: {
                    kind: 'origin',
                    name: 'FindPetReqParams',
                    type: 'object',
                    required: false,
                    children: [
                        {
                            default: 'available',
                            description: 'Status values that need to be considered for filter',
                            enum: ['available', 'pending', 'sold'],
                            name: 'status',
                            type: 'string',
                            required: false,
                            kind: 'origin',
                        },
                    ],
                },
            },
            response: {},
        },
    ]);
});
