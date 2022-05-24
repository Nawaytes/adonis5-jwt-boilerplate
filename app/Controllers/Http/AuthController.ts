import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateAuthUserValidator from 'App/Validators/auth/CreateAuthUserValidator'
import { processErrorResponse } from '../../Helper/response'

export default class AuthController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ request }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateAuthUserValidator)
      return {
        message: 'Hello world',
        payload,
      }
    } catch (error) {
      processErrorResponse(error)
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
