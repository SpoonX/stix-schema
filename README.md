# Stix-schema

A [stix](https://stixjs.io/) module and middleware that adds schema validation for your requests using [joi](https://github.com/hapijs/joi).

## Installation

1. `yarn add stix-schema`.
2. Add the module to your project

```ts
import SchemaModule from 'stix-schema';

export const modules: ModuleManagerConfigInterface = [
  SchemaModule,
  Application,
];
```

## Summary

- **Cool feature alert:** When combined with [stix-swagger](https://github.com/SpoonX/stix-swagger) you get schemas generated for your swagger docs out of the box.
- Schema validation will run immediately after the router is done.
- If validation fails, stix-schema responds to the user with a clientError _(bad request)_ of `invalid_parameters` and sends along the details of the failed validations.
- If validation is successful, the parameters get set on `ctx.state.params` for consumption elsewhere.
- If you use stix-gates as well, it's good to know that gates run **after** stix-schema validation.

## Usage

Create a config in the `schema` namespace. Example configuration **config/schema.ts:**

```ts
import { AbstractActionController } from 'stix';
import { SchemaConfig, SchemaRuleset } from 'stix-schema';
import { UserController } from '../src/Controller';
import { NewUser } from '../src/Schema/User';

export const schema: SchemaConfig = {
  schemas: new Map<typeof AbstractActionController, SchemaRuleset>([
    [UserController, {
      register: { body: NewUser },
    }],
  ]),
};
```

With this in place, every request that triggers `UserController.register` will be validated against the NewUser schema first.

Example schema:

```ts
import Joi from 'joi';

const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({ minDomainAtoms: 2 })
});
```

### Using the params

Stix-schema will take the result of the validation and when successful put the params on `ctx.state.params`.

```ts
export class UserController extends AbstractActionController {
  public async register (ctx): Promise<Response> {
    const { username, email, password } = ctx.state.params;
    // Go nuts!
  }
}
```

Now you can assume the data has been set and focus on logic.

## Configuration

There are a couple of configuration options at your disposal of which the one you'll use most is `schemas` _(as seen in the example above)_.

These are the defaults:

```ts
export const schema: SchemaConfig = {
  merge: true,
  defaultOptions: { allowUnknown: true, stripUnknown: true },
};
```

### Schemas

Schemas is a mapping of actions to schemas.

```ts
import { AbstractActionController } from 'stix';
import { SchemaConfig, SchemaRuleset } from 'stix-schema';
import { UserController } from '../src/Controller';
import { NewUser, ProfileSearch, LanguageString, Translations } from '../src/Schema/User';

export const schema: SchemaConfig = {
  schemas: new Map<typeof AbstractActionController, SchemaRuleset>([
    [UserController, {
      // Validate the body. (e.g. for post requests)
      // This also shows you can use options on schema rules.
      register: { body: NewUser, options: { allowUnknown: false } },

      // Validate the query. (e.g. for get requests)
      profile: { query: ProfileSearch },

      // Validate both the query and the body (e.g. posting for a specific language)
      profile: { query: LanguageString, body: Translations },
    }],
  ]),
};
```

### Merge

Merge tells stix-schema to merge the results of `query` and `body` into one object.

**Merge false:**

```ts
const result = {
  query: { bar: 'bar' },
  body: { foo: 'foo' },
};
```

**Merge true:**

```ts
const result = {
  bar: 'bar', 
  foo: 'foo',
};
```

This is generally the desired behaviour and is therefor the default.

### defaultOptions

These are the default options used for schema validation. They're used when a `schema` entry in the config doesn't provide it's own options. Generally you'll want to allow additional params to be sent along, but simply ignore them. This is the default behaviour:

- Unknown properties are allowed
- Unknown properties get stripped

If you do need access to unknown properties, you can set `stripUnknown` to false or access them directly from `ctx.request.query` or `ctx.request.body`.

## FAQ

Not really an FAQ as such... It's more a list of questions I'm expecting.

### Why use Map

Because this follows the same philosophy as stix: modules should provide [IoC](https://en.wikipedia.org/wiki/Inversion_of_control). In other words, any module that decides to use stix-schema should allow the user to override configuration options. 

You can have multiple controllers with the same name, so the controller itself is used as the key to make it very explicit.

## License

MIT
