import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export interface CreateCredentialUserContract {
  username: string
  password: string
}

export interface GenerateTokenJTWContract {
  auth: AuthContract
  username: string
  secret: string
}
