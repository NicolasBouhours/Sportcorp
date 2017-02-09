const Authentication = require('./controllers/authentication')
const Team = require('./controllers/team')
const Channel = require('./controllers/channel')
const Invitation = require('./controllers/invitation')
const passportService = require('./services/passport')
const passport = require('passport')

const TeamMiddleware = require('./middlewares/team')
const ChannelMiddleware = require('./middlewares/channel')
const InvitationMiddleware = require('./middlewares/invitation')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = (app) => {
  app.get('/', requireAuth, (req, res) => {
    res.send({ hi: 'there'})
  })
  app.post('/signin', requireSignin, Authentication.signin)
  app.put('/user/password/:id', Authentication.updatePassword)
  app.put('/user/:id', Authentication.update)
  app.post('/signup', Authentication.signup)

  app.post('/team', [requireAuth], Team.create)
  app.get('/team/user', [requireAuth], Team.findByUser)
  app.get('/team/:teamId', [requireAuth, TeamMiddleware], Team.find)
  app.put('/team/:teamId', [requireAuth, TeamMiddleware], Team.update)
  app.delete('/team/:teamId', [requireAuth, TeamMiddleware], Team.delete)

  app.post('/channel', [requireAuth], Channel.create)
  app.get('/channel/team', [requireAuth], Channel.findByTeam)
  app.get('/channel/:channelId', [requireAuth, ChannelMiddleware], Channel.find)
  app.put('/channel/:channelId', [requireAuth, ChannelMiddleware], Channel.update)
  app.delete('/channel/:channelId', [requireAuth, ChannelMiddleware], Channel.delete)

  app.get('/invitation', [requireAuth], Invitation.find)
  app.post('/invitation', [requireAuth], Invitation.create)
  app.put('/invitation/:invitationId/accept', [requireAuth, InvitationMiddleware], Invitation.accept)
  app.put('/invitation/:invitationId/decline', [requireAuth, InvitationMiddleware], Invitation.decline)
}
