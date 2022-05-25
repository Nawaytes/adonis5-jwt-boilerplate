import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateAuthUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    username: schema.string([
      rules.trim(),
      rules.minLength(5),
      rules.maxLength(50),
      rules.unique({ table: 'authentications', column: 'username' }),
    ]),
    secret: schema.string([
      rules.minLength(8),
      rules.maxLength(255),
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'username.required': 'Username is required',
    'username.minLength': 'Username must be at least 5 characters',
    'username.maxLength': 'Username must be at most 50 characters',
    'username.unique': 'Username already exists',
    'secret.required': 'Secret is required',
    'secret.minLength': 'Secret must be at least 8 characters',
    'secret.maxLength': 'Secret must be at most 255 characters',
    'secret.regex':
      'secret must contain at least one uppercase letter, one lowercase letter and one number',
  }
}
