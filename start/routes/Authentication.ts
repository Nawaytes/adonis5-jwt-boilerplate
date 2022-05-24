import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('auth', 'AuthController').apiOnly()
  Route.post('auth/login', 'AuthController.login')
})
