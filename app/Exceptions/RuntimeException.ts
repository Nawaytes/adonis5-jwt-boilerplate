import { Exception } from '@adonisjs/core/build/standalone'

export default class RuntimeException extends Exception {
  public meta: object

  constructor(
    message: string = '',
    code: string = 'E_RUNTIME_EXCEPTION',
    meta: object = {},
    status?: number
  ) {
    super(message, status, code)

    this.message = message
    this.code = code
    this.meta = meta
  }
}
