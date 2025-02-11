import type { OpenAPILatest } from '../types/openapi';
import type { OpenApiLatest_Schema } from './helpers';
import type { Named } from './Named';
import { never } from '../utils/func';
import { isArray, isBoolean, isNumber, isString, isUndefined } from '../utils/type-is';
import { isRefSchema, requiredTypeStringify, toZodName } from './helpers';
import { JsDoc } from './JsDoc';

interface SchemaResult {
  comments: Record<string, unknown>;
  required: boolean;
  type: string;
  zod: string;
}

function withGroup(texts: string[], separator: string, start = '(', end = ')') {
  return texts.length < 2 ? (texts.at(0) || '') : start + texts.join(separator) + end;
}

export class Schemata {
  constructor(private named: Named) {}

  prepareVarName(refId: string) {
    const typeName = this.named.getRefType(refId);
    return this.named.prepareVarName(toZodName(typeName));
  }

  print(schema: OpenApiLatest_Schema): SchemaResult {
    if (isRefSchema(schema)) {
      const typeName = this.named.getRefType(schema.$ref);
      const schemaName = typeName ? this.prepareVarName(schema.$ref) : 'z.unknown()';

      return {
        comments: JsDoc.fromRef(schema),
        required: false,
        type: typeName || 'unknown',
        zod: schemaName,
      };
    }

    const { type, allOf, oneOf, anyOf, required } = schema;
    const requiredBool = isBoolean(required) ? required : false;
    const comments = JsDoc.fromSchema(schema);

    if (allOf && allOf.length > 0) {
      const group = allOf.map(a => this.toString(a));

      return {
        comments,
        required: false,
        type: withGroup(group.map(g => g.type), '&'),
        zod: withGroup(
          group.map(g => g.zod),
          ',',
          'z.intersection(',
          ')',
        ),
      };
    }

    // TODO 不是精确的 oneof
    // https://arif.thedev.id/blogs/typescript/the-oneof-type
    // 但为了能够将类型转换为 zod schema，暂时保持模糊
    if (oneOf && oneOf.length > 0) {
      const group = oneOf.map(o => this.toString(o));

      return {
        comments,
        required: false,
        type: withGroup(group.map(g => g.type), '|'),
        zod: withGroup(
          group.map(g => g.zod),
          ',',
          'z.union([',
          '])',
        ),
      };
    }

    if (anyOf && anyOf.length > 0) {
      const group = anyOf.map(a => this.toString(a));

      return {
        comments,
        required: false,
        type: withGroup(group.map(g => g.type), '|'),
        zod: withGroup(
          group.map(g => g.zod),
          ',',
          'z.union([',
          '])',
        ),
      };
    }

    if (isArray(type)) {
      if (type.length === 0) {
        return this._printUnknown(schema, requiredBool);
      }

      if (type.length === 1) {
        return this.print({
          ...schema,
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-ignore
          type: type[0],
        });
      }

      const group = type.map(type => this.toString(
        type === 'null'
          // null
          ? { type }
          // origin
          : ({ ...schema, type } as OpenAPILatest.SchemaObject),
        true,
      ));

      return {
        comments,
        required: false,
        type: withGroup(group.map(g => g.type), '|'),
        zod: withGroup(
          group.map(g => g.zod),
          ',',
          'z.union([',
          '])',
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
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isString(e)
                  ? JSON.stringify(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                '|',
              )
            : isBlob
              ? 'Blob'
              : 'string',
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isString(e))
                  ? `z.literal(${JSON.stringify(e)})`
                  : this.prepareVarName(e.$ref)),
                ',',
                'z.union([',
                '])',
              )
            : isBlob
              ? 'z.instanceof(Blob)'
              : 'z.string()',
        };
      }

      case 'boolean': {
        const { enum: enumValues = [] } = schema;
        const required = Boolean(schema.required);

        return {
          comments,
          required,
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isBoolean(e)
                  ? String(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                '|',
              )
            : type,
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isBoolean(e)
                  ? `z.literal(${e})`
                  : this.prepareVarName(e.$ref))),
                ',',
                'z.union([',
                '])',
              )
            : 'z.boolean()',
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
          type: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isNumber(e)
                  ? String(e)
                  : this.named.getRefType(e.$ref) || 'unknown')),
                '|',
              )
            : 'number',
          zod: enumValues.length > 0
            ? withGroup(
                enumValues.map(e => (isNumber(e)
                  ? `z.literal(${e})`
                  : this.prepareVarName(e.$ref))),
                ',',
                'z.union([',
                '])',
              )
            : 'z.number()',
        };
      }

      case 'null': {
        const required = Boolean(schema.required);

        return {
          comments,
          required,
          type,
          zod: 'z.null()',
        };
      }

      case 'array':
        return this._printArray(schema);

      case 'object':
        return this._printObject(schema);

      case undefined: {
        // 智能判断类型
        if ('properties' in schema) {
          return this._printObject(schema);
        }
        else if ('additionalProperties' in schema) {
          return this._printObject(schema);
        }
        else if ('items' in schema) {
          return this._printArray(schema as unknown as OpenAPILatest.ArraySchemaObject);
        }
        else {
          return this._printUnknown(schema, requiredBool);
        }
      }

      default:
        never(type);
        return this._printUnknown(schema, requiredBool);
    }
  }

  private _printArray(schema: OpenAPILatest.ArraySchemaObject) {
    const comments = JsDoc.fromSchema(schema);
    const { minItems, maxItems, items } = schema;
    const { type, zod } = this.toString(items);

    return {
      comments: {
        ...comments,
        minItems,
        maxItems,
      },
      required: false,
      type: `Array<${type}>`,
      zod: `z.array(${zod})`,
    };
  }

  private _printAddPropBoolean(bool: boolean) {
    return {
      comments: {},
      required: true,
      type: bool ? 'any' : 'never',
      zod: bool ? 'z.any()' : 'z.never()',
    };
  }

  private _printObjectProp(propName: string, propSchema: boolean | OpenAPILatest.SchemaObject | OpenAPILatest.ReferenceObject, propRequired1: boolean) {
    const { required: propRequired2, comments, type, zod } = isBoolean(propSchema) ? this._printAddPropBoolean(propSchema) : this.print(propSchema);
    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const required = propRequired1 || propRequired2 || false;

    return {
      type: [jsDoc.print(), `${JSON.stringify(propName)}${requiredTypeStringify(required)}${type};`].filter(Boolean).join('\n'),
      zod: `${JSON.stringify(propName)}: ${required ? zod : `z.optional(${zod})`},`,
    };
  }

  private _printObject(schema: OpenAPILatest.SchemaObject) {
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
        const { type, zod } = this._printObjectProp(name, propSchema, isArray(schema.required) ? schema.required?.includes(name) : false);
        propTypeList.push(type);
        propZodList.push(zod);
      });

      typeList.push(withGroup(propTypeList, '\n', '{\n', '\n}'));
      zodList.push(withGroup(propZodList, '\n', 'z.object({\n', '\n})'));
    }

    // 有泛型属性
    if (!noGenericProps) {
      const { type, zod } = this.print(genericProps as OpenApiLatest_Schema);

      typeList.push(`Record<string, ${type}>`);
      zodList.push(`z.record(z.string(), ${zod})`);
    }

    // 无显式属性 && 无泛型属性
    if (typeList.length === 0) {
      return this._printUnknown(schema, required, {
        type: 'Record<string, unknown>',
        zod: 'z.record(z.string(), z.unknown())',
      });
    }

    return {
      comments,
      required: isBoolean(schema.required) ? schema.required : false,
      type: withGroup(typeList, '&'),
      zod: withGroup(zodList, ',', 'z.intersection(', ')'),
    };
  }

  private _printUnknown(schema: OpenApiLatest_Schema, required = false, spec?: { type?: string; zod?: string }) {
    const comments = JsDoc.fromSchema(schema);

    return {
      comments,
      type: spec?.type || 'unknown',
      required,
      zod: spec?.zod || 'z.unknown()',
      mock: '',
    };
  }

  toString(schema: OpenApiLatest_Schema, ignoreComments = false) {
    const result = this.print(schema);
    return Schemata.toString(result, ignoreComments);
  }

  static toString(result: SchemaResult, ignoreComments = false) {
    const { comments, type, zod } = result;

    if (ignoreComments)
      return { type, zod };

    const jsDoc = new JsDoc();
    jsDoc.addComments(comments);
    const header = jsDoc.print();

    return {
      type: [header, type].filter(Boolean).join('\n'),
      zod,
    };
  }
}
