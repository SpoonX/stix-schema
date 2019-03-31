import { Event, ModuleInterface, ModuleManager, RouterMiddleware, ServerService } from 'stix';
import * as config from '../config';
import { SchemaMiddleware } from './Middleware';

export class Module implements ModuleInterface {
  public onBootstrap (event: Event<ModuleManager>): void {
    const serviceManager = event.getTarget().getApplication().getServiceManager();
    const schemaMiddleware = serviceManager.get(SchemaMiddleware);

    serviceManager.get(ServerService).useAfter(RouterMiddleware, schemaMiddleware);
  }

  public getConfig () {
    return config;
  }
}
