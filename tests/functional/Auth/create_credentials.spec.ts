import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { HTTP_STATUS_CREATED, UnprocessableEntityErrorBag } from 'App/Helper/response'
import Authentication from 'App/Models/authentication'
import _ = require('lodash')
import { UnprocessableInputs } from '../test_helper'
const validInput = {
  username: 'credentialName',
  secret: 'Valids3cret',
}

test.group('Failed created credential', async (group) => {
  group.setup(async () => {
    await Database.from('authentications').delete()
  })
  group.teardown(async () => {
    await Database.from('authentications').delete()
  })

  const withoutUsername = _.cloneDeep(validInput)
  _.unset(withoutUsername, ['username'])

  const invalidInputs: UnprocessableInputs = {
    'without "username"': {
      errorBag: 'username',
      invalidInput: withoutUsername,
    },
    '"username" must be at least 5 characters': {
      errorBag: 'username',
      invalidInput: _.merge({}, validInput, {
        username: 'cred',
      }),
    },
    '"username" must be at most 50 characters': {
      errorBag: 'username',
      invalidInput: _.merge({}, validInput, {
        username: 'credentialName'.repeat(10),
      }),
    },
    '"secret" must be at least 8 characters': {
      errorBag: 'secret',
      invalidInput: _.merge({}, validInput, {
        secret: 'Valid',
      }),
    },
    '"secret" must be at most 255 characters': {
      errorBag: 'secret',
      invalidInput: _.merge({}, validInput, {
        secret: 'Valids3cret'.repeat(256),
      }),
    },
    '"secret" must contain at least one uppercase letter, one lowercase letter and one number': {
      errorBag: 'secret',
      invalidInput: _.merge({}, validInput, {
        secret: 'Validsecret',
      }),
    },
  }
  for (const [inputInfo, { errorBag, invalidInput }] of Object.entries(invalidInputs)) {
    test(`will return error bag when ${inputInfo}`, async ({ assert, client }) => {
      const response = await client.post('/auth/create-credential').json(invalidInput)
      const resultErrorBags: UnprocessableEntityErrorBag[] = response.body().errors
      assert.isTrue(resultErrorBags.some(({ field }) => field === errorBag))

      const totalAggregator = await Authentication.query().count('* as total').first()
      const totalData = totalAggregator?.$extras.total
      assert.equal(totalData, 0)
    })
  }
})

test.group('Successfully created credential', async (group) => {
  group.setup(async () => {
    await Database.from('authentications').delete()
  })

  group.teardown(async () => {
    await Database.from('authentications').delete()
  })

  test('Success to create credential login', async ({ client, assert }) => {
    const response = await client.post('/auth/create-credential').json(validInput)
    assert.equal(response.status(), HTTP_STATUS_CREATED)
    assert.equal(response.body().data.username, validInput.username)
  })
})
