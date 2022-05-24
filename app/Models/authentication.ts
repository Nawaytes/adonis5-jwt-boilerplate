import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import { v4 } from 'uuid'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export const EXCEPTION_AREA_ID_NOT_FOUND = 'area.id.not_found'
export const MESSAGE_CREDENTIAL_CREATED = 'credential.is.created'

export default class authentication extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column({
    prepare: (value: string) => (value ? value : v4()),
  })
  public uuid: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(authentication: authentication) {
    if (authentication.$dirty.password) {
      authentication.password = await Hash.make(authentication.password)
    }
  }

  @beforeCreate()
  public static async createUUID(model: authentication) {
    model.uuid = v4()
  }
}
