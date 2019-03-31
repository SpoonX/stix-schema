import { Instantiable, ServiceManagerConfigType } from 'stix';
import { SchemaMiddleware } from '../Library/Middleware';
import { SchemaService } from '../Library/Service';

export const services: ServiceManagerConfigType = {
  invokables: new Map<Instantiable<Object>, Instantiable<any>>([
    [ SchemaMiddleware, SchemaMiddleware ],
    [ SchemaService, SchemaService ],
  ]),
};
