import { CreateCredentialUserContract, GenerateTokenJTWContract } from './Contract/interface'
import Database from '@ioc:Adonis/Lucid/Database'
import Authentication from 'App/Models/authentication'
import { JWTTokenContract } from '@ioc:Adonis/Addons/Jwt'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 } from 'uuid'

export default class AuthService {
  public async createCredentialUser(input: CreateCredentialUserContract): Promise<Authentication> {
    try {
      await Database.beginGlobalTransaction()
      const credential = await Authentication.create(input)
      await Database.commitGlobalTransaction()
      return credential
    } catch (error) {
      await Database.rollbackGlobalTransaction()
      throw error
    }
  }

  public async destroyCredential(user_id: string): Promise<void> {
    try {
      await Database.beginGlobalTransaction()
      const credential = await Authentication.query().where('id', user_id).firstOrFail()
      await credential.delete()
      await Database.commitGlobalTransaction()
    } catch (error) {
      await Database.rollbackGlobalTransaction()
      throw error
    }
  }
  public async generateTokenJWT(
    input: GenerateTokenJTWContract
  ): Promise<JWTTokenContract<Authentication>> {
    try {
      await Database.beginGlobalTransaction()
      const { auth, username, secret } = input
      const credential = await Authentication.query()
        .where({
          username,
        })
        .firstOrFail()
      if (await Hash.verify(credential.password, secret)) {
        const token = await auth.use('jwt').login(credential, {
          payload: {
            uuid: v4(),
            username: credential.username,
          },
        })
        await Database.commitGlobalTransaction()
        return token
      }
      throw new Error('Invalid credentials')
    } catch (error) {
      await Database.rollbackGlobalTransaction()
      throw error
    }
  }
}
