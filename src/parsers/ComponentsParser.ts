import { OpenAPIV3 } from 'openapi-types';
import { BaseParser } from './BaseParser';
import { Named } from './Named';
import { TypeAlias, TypeList, TypeOrigin, TypeUnit } from './types';

export class ComponentsParser extends BaseParser {
  parseComponents(): TypeList {
    const { components } = this.document;

    if (!components) return [];

    const { schemas } = components;

    if (!schemas) return [];

    const t = Object.entries(schemas).map(([name, schema]) => {
      const typeName = this.named.nextTypeName(name);
      return this.isReference(schema)
        ? this.parseReference(schema)
        : this.parseSchema(typeName, schema.nullable === false, schema);
    });
    this.named.didResolve();
    return t;
  }

  protected parseReference(reference: OpenAPIV3.ReferenceObject): TypeAlias {
    const { $ref } = reference;
    const t: TypeAlias = {
      // TODO 需要 name，
      // TODO 并且 $ref 可能指向类型内部 #/components/schemas/Type/inner-inner
      //                                                  ^^^^^^^^^^^^^^^ 需要完整看待
      kind: 'alias',
      target: '',
    };
    this.named.willResolve(() => {
      t.target = this.named.getName($ref);
    });
    return t;
  }

  protected parseSchema(name: string, required: boolean, schema: OpenAPIV3.SchemaObject) {
    const { type } = schema;

    switch (type) {
      case 'boolean':
      case 'string':
      case 'number':
      case 'integer': {
        const tsType = type === 'integer' ? 'number' : type;
        return this.parseSchemaPrimitive(name, required, tsType, schema);
      }

      case 'object':
        return this.parseSchemaObject(name, required, schema);

      case 'array':
        return this.parseSchemaArray(name, required, schema);

      default:
        return this.parseSchemaNever(name, true, schema);
    }
  }

  protected parseSchemaPrimitive(
    name: string,
    required: boolean,
    type: TypeUnit,
    schema: OpenAPIV3.SchemaObject
  ): TypeOrigin {
    return {
      ...this.inheritProps(schema),
      name,
      type,
      required,
      kind: 'origin',
    };
  }

  protected parseSchemaObject(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
    const properties = Object.entries(schema.properties || {}).sort((a, b) => a[0].localeCompare(b[0]));
    return {
      ...this.inheritProps(schema),
      name,
      required,
      kind: 'origin',
      type: 'object',
      children: properties.map(([propName, propSchema]) => {
        return this.isReference(propSchema)
          ? this.parseReference(propSchema)
          : this.parseSchema(propName, schema.required?.includes(propName) || false, propSchema);
      }),
    };
  }

  protected parseSchemaArray(name: string, required: boolean, schema: OpenAPIV3.ArraySchemaObject): TypeOrigin {
    return {
      ...this.inheritProps(schema),
      name,
      required,
      kind: 'origin',
      type: 'array',
      children: [schema.items].map((schema) => {
        return this.isReference(schema)
          ? this.parseReference(schema)
          : this.parseSchema('', schema.nullable === false, schema);
      }),
    };
  }

  protected parseSchemaNever(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
    return {
      ...this.inheritProps(schema),
      name,
      required,
      kind: 'origin',
      type: 'never',
    };
  }

  private inheritProps(schema: OpenAPIV3.BaseSchemaObject) {
    return {
      default: schema.default,
      description: schema.description,
      example: schema.example,
      deprecated: schema.deprecated,
      title: schema.title,
      format: schema.format,
      enum: schema.enum,
    };
  }
}
