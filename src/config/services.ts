import { Instantiable, ServiceManagerConfigType } from 'stix';
import { SchemaMiddleware } from '../src/Middleware';
import { SchemaService } from '../src/Service';

export const services: ServiceManagerConfigType = {
  invokables: new Map<Instantiable<Object>, Instantiable<any>>([
    [ SchemaMiddleware, SchemaMiddleware ],
    [ SchemaService, SchemaService ],
  ]),
};
