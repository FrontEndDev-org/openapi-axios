import { OpenAPIV3 } from 'openapi-types';
import { isBoolean } from '../utils/type-is';
import { BaseReader } from './BaseReader';
import { TypeAlias, TypeItem, TypeList, TypeOrigin, TypeUnit } from './types';

export class ComponentsReader extends BaseReader {
  readComponents(): TypeList {
    const { components } = this.document;

    if (!components) return [];

    const { schemas } = components;

    if (!schemas) return [];

    const t = Object.entries(schemas)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, schema]) => {
        const typeName = this.named.nextTypeName(name, true);
        return this.isReference(schema)
          ? this.readReference(typeName, true, schema, true)
          : this.readSchema(typeName, schema.nullable === false, schema);
      });
    this.named.resolveAlias();
    return t;
  }

  protected readReference(
    name: string,
    required: boolean,
    reference: OpenAPIV3.ReferenceObject,
    refAble = false
  ): TypeAlias {
    return this.named.addAlias({
      kind: 'alias',
      refAble,
      name,
      required,
      ref: reference.$ref,
      target: '',
      origin: '',
      props: [],
    });
  }

  protected readSchema(name: string, required: boolean, schema: OpenAPIV3.SchemaObject) {
    const { type } = schema;

    switch (type) {
      case 'boolean':
      case 'string':
      case 'number':
      case 'integer': {
        const tsType = type === 'integer' ? 'number' : type;
        return this.readSchemaPrimitive(name, required, tsType, schema);
      }

      case 'object':
        return this.readSchemaObject(name, required, schema);

      case 'array':
        return this.readSchemaArray(name, required, schema);

      default:
        return this.readSchemaNever(name, true, schema);
    }
  }

  protected readSchemaPrimitive(
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

  protected readSchemaObject(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
    const properties = Object.entries(schema.properties || {}).sort((a, b) => a[0].localeCompare(b[0]));
    const children = properties.map(([propName, propSchema]) => {
      const required = schema.required?.includes(propName) || false;
      return this.isReference(propSchema)
        ? this.readReference(propName, required, propSchema)
        : this.readSchema(propName, required, propSchema);
    });

    const additional = this.readObjectAdditionalProperties(schema.additionalProperties);
    if (additional) children.push(additional);

    return {
      ...this.inheritProps(schema),
      name,
      required,
      kind: 'origin',
      type: 'object',
      children,
    };
  }

  protected readSchemaArray(name: string, required: boolean, schema: OpenAPIV3.ArraySchemaObject): TypeOrigin {
    const children = [schema.items].map((schema) => {
      return this.isReference(schema)
        ? this.readReference(`${name}[]`, true, schema)
        : this.readSchema(`${name}[]`, schema.nullable === false, schema);
    });

    const additional = this.readObjectAdditionalProperties(schema.additionalProperties);
    if (additional) children.push(additional);

    return {
      ...this.inheritProps(schema),
      name,
      required,
      kind: 'origin',
      type: 'array',
      children: children,
    };
  }

  protected readObjectAdditionalProperties(
    additionalProperties: OpenAPIV3.SchemaObject['additionalProperties']
  ): TypeItem | undefined {
    if (!additionalProperties) return;

    const name = '[key: string]';

    if (isBoolean(additionalProperties)) {
      if (additionalProperties) {
        return {
          kind: 'origin',
          type: 'any',
          name,
          required: true,
        };
      }
      return;
    }

    return this.isReference(additionalProperties)
      ? this.readReference(name, true, additionalProperties)
      : this.readSchema(name, true, additionalProperties);
  }

  protected readSchemaNever(name: string, required: boolean, schema: OpenAPIV3.SchemaObject): TypeOrigin {
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
