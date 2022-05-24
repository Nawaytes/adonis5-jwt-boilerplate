import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export interface createCredentialUserContract {
  username: string
  password: string
}

export interface generateTokenJTWContract {
  auth: AuthContract
  username: string
  secret: string
}
