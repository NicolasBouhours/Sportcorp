const User = require('../models/user')
const Team = require('../models/team')
const Invitation = require('../models/invitation')

exports.create = (req, res, next ) => {
  const { email, firstname, lastname, teamId } = req.body

  const user = new User(req.user)

  // Check if invitation don't already exist
  Invitation.findOne({ email: email, team: teamId })
    .then((invitationExist) => {

    if (invitationExist) {
      return res.status(422).send({ error: 'An invitation is actually pending for this user' })
    }

    // Get team where user is invited
    Team.findOne({ _id: teamId })
      .then((team) => {

      if (!team) { return res.status(422).send({ error: 'Cannot retrieve team' }) }

      // Fill invitation object
      const invitation = new Invitation({
        email, firstname, lastname, team,
        creator: user
      })

      // Check if user have already an account
      User.findOne({ email: email})
        .then((userInvited) => {

        if(!userInvited) {
          // Send invitation email
        }

        // Save invitation
        invitation.save()
        .then(() => res.send({ success: 'User successfully invited' }))
        .catch((err) => next(err))
      })
      .catch((err) => next(err))
    })
    .catch((err) => next(err))
  })
  .catch((err) => next(err))
}

exports.accept = (req, res, next) => {
  const invitation = new Invitation(req.invitation)

  invitation.status = 'Accepted'
  invitation.status_date = new Date()

  // Get user
  User.findOne({ email: invitation.email})
    .then((userInvited) => {

    if(!userInvited) { return res.status(422).send({ error: 'Cannot retrieve this invitation' }) }

    // Check if user can only accept his invits
    if(!userInvited._id.equals(req.user._id)) {
      return res.status(403).send({ error: 'Cannot access to others invitations' })
    }

  // Adding this user to the team
    Team.findOne({ _id: req.invitation.team })
      .then((team) => {

      if (!team) { return res.status(422).send({ error: 'Cannot retrieve team' }) }

      team.users.push(userInvited)
      team.save()
        .then(() => {

        // Update invitation
        invitation.save()
        .then(() => res.send({ success: `You have joined ${team.name}` }))
        .catch((err) => next(err))

      }).catch((err) => next(err))
    }).catch((err) => next(err))
  }).catch((err) => next(err))
}

exports.decline = (req, res, next) => {
  const invitation = new Invitation(req.invitation)

  invitation.status = 'Declined'
  invitation.status_date = new Date()

  // Get user
  User.findOne()
    .then((userInvited) => {

    if(!userInvited) { return res.status(422).send({ error: 'Cannot retrieve this invitation' }) }

    // Check if user can only accept his invits
    if(!userInvited._id.equals(req.user._id)) {
      return res.status(403).send({ error: 'Cannot access to others invitations' })
    }

    // Update invitation
    invitation.save()
      .then(() => res.send({ success: `You have declined invitation` }))
      .catch((err) => next(err))
  }).catch((err) => next(err))
}

exports.find = (req, res, next) => {
  Invitation.find({ email: req.user.email, status: 'Pending' })
    .then((invitations) => {

    if (!invitations) { return res.status(422).send({ error: 'Cannot retrieve invitations' }) }
    res.send({ invitations })
  }).catch((err) => next(err))
}
