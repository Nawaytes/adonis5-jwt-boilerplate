import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Authentication from 'App/Models/authentication'
import Hash from '@ioc:Adonis/Core/Hash'
import { HTTP_STATUS_OK } from 'App/Helper/response'
import { UnprocessableEntityErrorBag } from '../../../app/Helper/response'
import _ = require('lodash')
import { UnprocessableInputs } from '../test_helper'
const validInput = {
  username: 'credentialName',
  secret: 'Valids3cret',
}

test.group('Successfully created token auth', async (group) => {
  group.setup(async () => {
    await Database.from('authentications').delete()
    await Authentication.create({
      username: validInput.username,
      password: validInput.secret,
    })
  })

  test('will return OK when valid input', async ({ assert, client }) => {
    const response = await client.post('/auth').json({
      username: validInput.username,
      secret: validInput.secret,
    })
    assert.equal(response.status(), HTTP_STATUS_OK)
    assert.exists(response.body().token)
    assert.exists(response.body().refreshToken)
    assert.exists(response.body().expires_at)
    assert.equal(response.body().type, 'bearer')
  })
})

test.group('Failed created token auth', async (group) => {
  group.each.setup(async () => {
    await Database.from('authentications').delete()
    await Authentication.create({
      username: validInput.username,
      password: validInput.secret,
    })
  })

  const withoutUsername = _.cloneDeep(validInput)
  _.unset(withoutUsername, ['username'])

  const withoutSecret = _.cloneDeep(validInput)
  _.unset(withoutSecret, ['secret'])

  const invalidInputs: UnprocessableInputs = {
    'without "username"': {
      errorBag: 'username',
      invalidInput: withoutUsername,
    },
    'without "secret"': {
      errorBag: 'secret',
      invalidInput: withoutSecret,
    },
    'wrong "username" input': {
      errorBag: 'username',
      invalidInput: _.merge({}, validInput, {
        username: 'wrongUsername',
      }),
    },
    'wrong "secret" input': {
      errorBag: 'secret',
      invalidInput: _.merge({}, validInput, {
        secret: 'wrongSecret',
      }),
    },
  }
})
