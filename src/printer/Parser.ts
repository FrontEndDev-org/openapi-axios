import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Schema } from './helpers';
import type { Named } from './Named';
import { isArray, isBoolean, isNever, isNumber, isString, isUndefined } from '../utils/type-is';
import { isRefSchema, requiredTypeStringify, toZodName, withGroup } from './helpers';
import { JsDoc } from './JsDoc';

export interface ParseResult {
  required: boolean;
  comments: Record<string, unknown>;
  deps: string[];
  type: string;
  zod: string;
}

export class Parser {
  constructor(readonly named: Named, readonly schema: OpenApiLatest_Schema) {
    //
  }

  #depSets = new Set<string>();

  #prepareVarName(refId: string) {
    const typeName = this.named.getRefType(refId);

    if (!typeName) {
      throw new Error(`未找到 refId: ${refId} 的类型`);
    }

    const varName = this.named.prepareVarName(toZodName(typeName));
    this.#depSets.add(varName);
    return varName;
  }

  get #depNames() {
    return [...this.#depSets.values()];
  }

  #mergeResultDeps(parseResult: ParseResult) {
    parseResult.deps.forEach((d) => {
      this.#depSets.add(d);
    });
  }

  #mergeParserDeps(parser: Parser) {
    parser.#depSets.forEach((d) => {
      this.#depSets.add(d);
    });
  }

  parse(): ParseResult {
    const { schema } = this;

    if (isRefSchema(schema)) {
      const typeName = this.named.getRefType(schema.$ref);
      const zodName = typeName ? this.#prepareVarName(schema.$ref) : 'z.unknown()';

      if (!typeName) {
        throw new Error(`未找到 refId: ${schema.$ref} 的类型`);
      }

      return {
        type: typeName,
        zod: zodName,
        comments: JsDoc.fromRef(schema),
        required: false,
        deps: [...this.#depSets.values()],
      };
    }

    const { type, allOf, oneOf, anyOf, required } = schema;
    const requiredBool = isBoolean(required) ? required : false;
    const comments = JsDoc.fromSchema(schema);

    if (allOf && allOf.length > 0) {
      const group = allOf.map(a => Parser.#parseInner(this, a));

      return {
        comments,
        required: false,
        deps: this.#depNames,
        type: withGroup(group.map(g => g.type), {
          sep: '&',
        }),
        zod: withGroup(
          group.map(g => g.zod),
          {
            sep: ',',
            wrap: ['z.intersection(', ')'],
          },
        ),
      };
    }

    // TODO 不是精确的 oneof
    // https://arif.thedev.id/blogs/typescript/the-oneof-type
    // 但为了能够将类型转换为 zod schema，暂时保持模糊
    if (oneOf && oneOf.length > 0) {
      const group = oneOf.map(o => Parser.#parseInner(this, o));

      return {
        comments,
        required: false,
        deps: this.#depNames,
        type: withGroup(group.map(g => g.type), {
          sep: '|',
        }),
        zod: withGroup(
          group.map(g => g.zod),
          {
            wrap: ['z.union([', '])'],
          },
        ),
      };
    }

    if (anyOf && anyOf.length > 0) {
      const group = anyOf.map(a => Parser.#parseInner(this, a));

      return {
        comments,
        required: false,
        deps: this.#depNames,
        type: withGroup(group.map(g => g.type), {
          sep: '|',
        }),
        zod: withGroup(
          group.map(g => g.zod),
          {
            sep: ',',
            wrap: ['z.union([', '])'],
          },
        ),
      };
    }

    if (isArray(type)) {
      if (type.length === 0) {
        return Parser.#parseAsUnknown(schema, requiredBool);
      }

      if (type.length === 1) {
        return Parser.#parseInner(this, {
          ...schema,
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          type: type[0],
        });
      }

      const group = type.map(type => Parser.#parseInner(this, type === 'null'
        // null
        ? { type }
        // origin
        : ({ ...schema, type } as OpenAPILatest.SchemaObject)),
      );

      return {
        comments,
        required: false,
        deps: this.#depNames,
        type: withGroup(group.map(g => g.type), {
          sep: '|',
        }),
        zod: withGroup(
          group.map(g => g.zod),
          {
            wrap: ['z.union([', '])'],
          },
        ),
      };
    }

    switch (type) {
      case 'string': {
        const { enum: enumValues = [], format, minLength, maxLength, pattern } = schema;
        const isBlob = format === 'binary';
        const required = Boolean(schema.required);

        return {
          comments: {
            ...comments,
            minLength,
            maxLength,
            pattern,
          },
          required,
          deps: this.#depNames,
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isString(e)
                  ? JSON.stringify(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                {
                  sep: '|',
                },
              )
            : isBlob
              ? 'Blob'
              : 'string',
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isString(e))
                  ? `z.literal(${JSON.stringify(e)})`
                  : this.#prepareVarName(e.$ref)),
                {
                  wrap: ['z.union([', '])'],
                },
              )
            : isBlob
              ? 'z.instanceof(Blob)'
              : 'z.string()',
        };
      }

      case 'number':
      case 'integer': {
        const { enum: enumValues = [], const: const_, minimum, maximum } = schema;
        const required = Boolean(schema.required);

        if (!isUndefined(const_))
          enumValues.push(const_);

        return {
          comments: {
            ...comments,
            minimum,
            maximum,
          },
          required,
          deps: this.#depNames,
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isNumber(e)
                  ? String(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                {
                  sep: '|',
                },
              )
            : 'number',
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isNumber(e)
                  ? `z.literal(${e})`
                  : this.#prepareVarName(e.$ref))),
                {
                  wrap: ['z.union([', '])'],
                },
              )
            : 'z.number()',
        };
      }

      case 'boolean': {
        const { enum: enumValues = [] } = schema;
        const required = Boolean(schema.required);

        return {
          comments,
          required,
          deps: this.#depNames,
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isBoolean(e)
                  ? String(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                {
                  sep: '|',
                },
              )
            : type,
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isBoolean(e)
                  ? `z.literal(${e})`
                  : this.#prepareVarName(e.$ref))),
                {
                  sep: ',',
                  wrap: ['z.union([', '])'],
                },
              )
            : 'z.boolean()',
        };
      }

      case 'null': {
        const required = Boolean(schema.required);

        return {
          comments,
          required,
          deps: this.#depNames,
          type,
          zod: 'z.null()',
        };
      }

      case 'array':
        return Parser.#parseArray(this, schema);

      case 'object':
        return Parser.#parseObject(this, schema);

      case undefined: {
        // 智能判断类型
        if ('properties' in schema) {
          return Parser.#parseObject(this, schema);
        }
        else if ('additionalProperties' in schema) {
          return Parser.#parseObject(this, schema);
        }
        else if ('items' in schema) {
          return Parser.#parseArray(this, schema as unknown as OpenAPILatest.ArraySchemaObject);
        }
        else {
          return Parser.#parseAsUnknown(schema, requiredBool);
        }
      }

      default:
        isNever(type);
        return Parser.#parseAsUnknown(schema, requiredBool);
    }
  }

  static parse(named: Named, schema: OpenApiLatest_Schema) {
    return new Parser(named, schema).parse();
  }

  static #parseInner(parent: Parser, schema: OpenApiLatest_Schema) {
    const result = new Parser(parent.named, schema).parse();
    parent.#mergeResultDeps(result);
    return result;
  }

  static #parseAsUnknown(schema: OpenApiLatest_Schema, required = false, spec?: { type?: string; zod?: string }): ParseResult {
    const comments = JsDoc.fromSchema(schema);

    return {
      comments,
      required,
      deps: [],
      type: spec?.type || 'unknown',
      zod: spec?.zod || 'z.unknown()',
    };
  }

  static #parseArray(parent: Parser, schema: OpenAPILatest.ArraySchemaObject) {
    const comments = JsDoc.fromSchema(schema);
    const { minItems, maxItems, items } = schema;
    const result = Parser.#parseInner(parent, items);

    return {
      comments: {
        ...comments,
        minItems,
        maxItems,
      },
      required: false,
      deps: result.deps,
      type: `Array<${result.type}>`,
      zod: `z.array(${result.zod})`,
    };
  }

  static #parseObject(parent: Parser, schema: OpenAPILatest.SchemaObject): ParseResult {
    const parser = new Parser(parent.named, schema);
    const required = isBoolean(schema.required) ? schema.required : false;
    const comments = JsDoc.fromSchema(schema);
    const explicitProps = 'properties' in schema ? schema.properties : undefined;

    // additionalProperties: true
    // additionalProperties: false
    // additionalProperties: {...}
    const genericProps = 'additionalProperties' in schema ? schema.additionalProperties : undefined;
    const explicitEntries = Object.entries(explicitProps || {});

    const noExplicitProps = explicitEntries.length === 0;
    const noGenericProps = isUndefined(genericProps) || genericProps === false || Object.keys(genericProps).length === 0;

    const typeList: string[] = [];
    const zodList: string[] = [];

    // 有显式属性
    if (!noExplicitProps) {
      const propTypeList: string[] = [];
      const propZodList: string[] = [];

      explicitEntries.forEach(([name, propSchema]) => {
        const { type, zod } = Parser.#parseObjectProp(parser, name, propSchema, isArray(schema.required) ? schema.required?.includes(name) : false);
        propTypeList.push(type);
        propZodList.push(zod);
      });

      typeList.push(withGroup(propTypeList, {
        sep: '\n',
        wrap: ['{\n', '\n}'],
        always: true,
      }));
      zodList.push(withGroup(propZodList, {
        sep: '\n',
        wrap: ['z.object({\n', '\n})'],
        always: true,
      }));
    }

    // 有泛型属性
    if (!noGenericProps) {
      const { type, zod } = Parser.#parseInner(parser, genericProps as OpenApiLatest_Schema);

      typeList.push(`Record<string, ${type}>`);
      zodList.push(`z.record(z.string(), ${zod})`);
    }

    // 无显式属性 && 无泛型属性
    if (typeList.length === 0) {
      return Parser.#parseAsUnknown(schema, required, {
        type: 'Record<string, unknown>',
        zod: 'z.record(z.string(), z.unknown())',
      });
    }

    parent.#mergeParserDeps(parser);

    return {
      comments,
      required: isBoolean(schema.required) ? schema.required : false,
      deps: parser.#depNames,
      type: withGroup(typeList, {
        sep: '&',
      }),
      zod: withGroup(zodList, {
        wrap: ['z.intersection(', ')'],
      }),
    };
  }

  static #parseObjectProp(parent: Parser, propName: string, propSchema: boolean | OpenAPILatest.SchemaObject | OpenAPILatest.ReferenceObject, propRequired1: boolean) {
    const { required: propRequired2, comments, type, zod } = isBoolean(propSchema) ? Parser.#parsePropBoolean(propSchema) : Parser.#parseInner(parent, propSchema);
    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const required = propRequired1 || propRequired2 || false;

    return {
      type: [jsDoc.print(), `${JSON.stringify(propName)}${requiredTypeStringify(required)}${type};`].filter(Boolean).join('\n'),
      zod: `${JSON.stringify(propName)}: ${required ? zod : `z.optional(${zod})`},`,
    };
  }

  static #parsePropBoolean(bool: boolean): ParseResult {
    return {
      comments: {},
      deps: [],
      required: true,
      type: bool ? 'any' : 'never',
      zod: bool ? 'z.any()' : 'z.never()',
    };
  }
}
