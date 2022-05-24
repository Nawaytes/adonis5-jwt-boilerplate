import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default abstract class BaseResponseException extends Exception {
  public meta: object

  public abstract defaultMessage(): string
  public abstract defaultCode(): string
  public abstract defaultStatus(): number

  constructor(message: string, code?: string, meta: object = {}, status?: number) {
    super(message, status, code)

    this.message = message !== '' ? message : this.defaultMessage()
    this.status = this.defaultStatus()
    this.code = code ?? this.defaultCode()
    this.meta = meta
  }

  public async handle(error: this, ctx: HttpContextContract) {
    ctx.response.status(error.status).send({
      errors: {
        message: this.message,
        error_code: this.code,
        meta: this.meta,
      },
    })
  }
}
