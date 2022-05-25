import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MESSAGE_CREDENTIAL_CREATED } from 'App/Models/authentication'
import AuthService from 'App/Service/Auth/AuthService'
import CreateAuthUserValidator from 'App/Validators/auth/CreateAuthUserValidator'
import GenerateTokenJwtValidator from 'App/Validators/auth/GenerateTokenJwtValidator'
import {
  processErrorResponse,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_OK,
} from '../../Helper/response'

export default class AuthController {
  protected service: AuthService

  constructor() {
    this.service = new AuthService()
  }
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({ auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(GenerateTokenJwtValidator)
      const token = await this.service.generateTokenJWT({
        auth: auth,
        username: payload.username,
        secret: payload.secret,
      })
      return response.status(HTTP_STATUS_OK).send(token)
    } catch (error) {
      processErrorResponse(error)
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const userId = params.id
      await this.service.destroyCredential(userId)
      return response.status(HTTP_STATUS_NO_CONTENT).send(null)
    } catch (error) {
      processErrorResponse(error)
    }
  }

  public async createCredential({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateAuthUserValidator)
      const credential = await this.service.createCredentialUser({
        username: payload.username,
        password: payload.secret,
      })
      const data = {
        status_code: HTTP_STATUS_CREATED,
        message: MESSAGE_CREDENTIAL_CREATED,
        data: credential,
      }
      return response.status(HTTP_STATUS_CREATED).send(data)
    } catch (error) {
      processErrorResponse(error)
    }
  }
}
