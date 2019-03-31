import { AbstractActionController, config, ContextInterface, inject, ResponseService } from 'stix';
import { DataSource, JoiSchema, SchemaConfig, SchemaRule, SchemaRuleOptions } from '../Middleware';
import Joi, { ValidationError } from 'joi';

export class SchemaService {
  @config('schema')
  private config: SchemaConfig;

  @inject(ResponseService)
  private responseService: ResponseService;

  public getSchemaRule (controller: typeof AbstractActionController, action: string): SchemaRule | null {
    if (!this.config.schemas.has(controller.constructor as typeof AbstractActionController)) {
      return null;
    }

    const ruleset = this.config.schemas.get(controller.constructor as typeof AbstractActionController);

    if (ruleset[action]) {
      return ruleset[action];
    }

    return null;
  }

  public validate (object: DataSource, schema: JoiSchema, { allowUnknown, stripUnknown }: SchemaRuleOptions = {}) {
    const { defaultOptions } = this.config;

    return Joi.validate(object, schema, {
      allowUnknown: typeof allowUnknown === 'boolean' ? allowUnknown : defaultOptions.allowUnknown,
      stripUnknown: typeof stripUnknown === 'boolean' ? stripUnknown : defaultOptions.stripUnknown,
    });
  }

  public handleError (ctx: ContextInterface, error: ValidationError): void {
    ctx.state.response = this.responseService.clientError().badRequest('invalid_parameters', error.details);
  }
}
