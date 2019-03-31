import { SchemaConfig } from '../src/Middleware';

export const schema: SchemaConfig = {
  merge: true,
  defaultOptions: { allowUnknown: true, stripUnknown: true },
};
