import Joi from 'joi';
import 'joi-extract-type';
import { AbstractActionController, ContextInterface } from 'stix';

export interface SchemaConfig {
  schemas?: SchemasConfig;
  merge?: boolean;
  defaultOptions?: SchemaRuleOptions;
}

export type SchemasConfig = Map<ControllerReference, SchemaRuleset>;

export interface SchemaRuleset {
  [action: string]: SchemaRule;
}

export interface SchemaRule {
  options?: SchemaRuleOptions;
  body?: Schema;
  query?: Schema;
}

export interface DataSource { [key: string]: any; }

export type Schema = { name: string, schema: JoiSchema };

export declare type JoiSchema = Joi.SchemaMap | Joi.AnySchema;

export type ControllerReference = typeof AbstractActionController;

export interface SchemaRuleOptions {
  allowUnknown?: boolean;
  stripUnknown?: boolean;
}

export interface SchemaResult {
  [property: string]: any;
}

export interface SchemaContext extends ContextInterface {
  schemaResult: SchemaResult | { query: SchemaResult, body: SchemaResult };
}
