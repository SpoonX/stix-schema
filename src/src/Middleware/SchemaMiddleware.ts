import {
  AbstractMiddleware,
  Config,
  config,
  inject,
  ResponseService,
} from 'stix';
import { createDebugLogger } from '../debug';
import { SchemaConfig, SchemaContext, SchemaRule } from './SchemaTypes';
import { SchemaService } from '../Service';

const debug = createDebugLogger('middleware');

export class SchemaMiddleware extends AbstractMiddleware {
  @config('schema')
  private config: SchemaConfig;

  @inject(SchemaService)
  private schemaService: SchemaService;

  @inject(ResponseService)
  private responseService: ResponseService;

  public pass (ctx: SchemaContext, next: () => void): void {
    const { state } = ctx;
    const { dispatch } = state;
    const params = { body: {}, query: {} };
    const rule: SchemaRule = this.schemaService.getSchemaRule(dispatch.controller, dispatch.action);

    if (!rule) {
      debug(`No schemas configured for ${dispatch.controllerName}.${dispatch.action}, calling next.`);

      return next();
    }

    debug(`handling schemas.`);

    if (rule.query) {
      debug(`handling schemas for "query".`);

      const { error, value } = this.schemaService.validate(Object.assign({}, ctx.query), rule.query, rule.options);

      if (error) {
        debug(`handling error for "query" schema.`);

        return this.schemaService.handleError(ctx, error);
      }

      params.query = value;
    }

    if (rule.body) {
      debug(`handling schemas for "body".`);

      const { error, value } = this.schemaService.validate(Object.assign({}, ctx.request.body), rule.body, rule.options);

      if (error) {
        debug(`handling error for "body" schema.`);

        return this.schemaService.handleError(ctx, error);
      }

      params.body = value;
    }

    debug(`Done handling schemas. Setting params and calling next.`);

    this.setParams(params, state);

    return next();
  }

  private setParams (params: SchemaContext['schemaResult'], state: SchemaContext['state']) {
    if (!this.config.merge) {
      Config.merge(state.params, params);

      return;
    }

    Config.merge(state.params, params.query, params.body);
  }
}
