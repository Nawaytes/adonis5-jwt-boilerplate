import { createCredentialUserContract, generateTokenJTWContract } from './Contract/interface'
import Database from '@ioc:Adonis/Lucid/Database'
import authentication from '../../Models/authentication'
import { JWTTokenContract } from '@ioc:Adonis/Addons/Jwt'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 } from 'uuid'

export default class AuthService {
  public async createCredentialUser(input: createCredentialUserContract): Promise<authentication> {
    try {
      await Database.beginGlobalTransaction()
      const credential = await authentication.create(input)
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
      const credential = await authentication.query().where('uuid', user_id).firstOrFail()
      await credential.delete()
      await Database.commitGlobalTransaction()
    } catch (error) {
      await Database.rollbackGlobalTransaction()
      throw error
    }
  }
  public async generateTokenJWT(
    input: generateTokenJTWContract
  ): Promise<JWTTokenContract<authentication>> {
    try {
      await Database.beginGlobalTransaction()
      console.log(input)
      const { auth, username, secret } = input
      const credential = await authentication
        .query()
        .where({
          username,
        })
        .firstOrFail()
      console.log(JSON.stringify(credential))
      // console.log(await Hash.verify(secret, credential.password))
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
