const User = require('../models/user')
const Team = require('../models/team')
const Invitation = require('../models/invitation')

exports.create = (req, res, next ) => {
  const { email, firstname, lastname, teamId } = req.body

  const user = new User(req.user)

  // Check if invitation don't already exist
  Invitation.findOne({ email: email, team: teamId }, (err, invitationExist) => {
    if (err) { return next(err) }

    if (invitationExist) {
      return res.status(422).send({ error: 'An invitation is actually pending for this user' })
    }

    // Get team where user is invited
    Team.findOne({ _id: teamId }, (err, team) => {
      if (err) { return next(err) }

      if (!team) { return res.status(422).send({ error: 'Cannot retrieve team' }) }

      // Fill invitation object
      const invitation = new Invitation({
        email, firstname, lastname, team,
        creator: user
      })

      // Check if user have already an account
      User.findOne({ email: email}, (err, userInvited) => {
        if (err) { return next(err) }

        if(!userInvited) {
          // Send invitation email
        }

        // Save invitation
        invitation.save((err) => {
          if (err) { return next(err) }

          res.send({ success: 'User successfully invited' })
        })
      })
    })
  })
}

exports.accept = (req, res, next) => {
  const invitation = new Invitation(req.invitation)

  invitation.status = 'Accepted'
  invitation.status_date = new Date()

  // Get user
  User.findOne({ email: invitation.email}, (err, userInvited) => {
    if (err) { return next(err) }
    if(!userInvited) { return res.status(422).send({ error: 'Cannot retrieve this invitation' }) }

    // Check if user can only accept his invits
    if(!userInvited._id.equals(req.user._id)) {
      return res.status(422).send({ error: 'Cannot access to others invitations' })
    }

  // Adding this user to the team
    Team.findOne({ _id: req.invitation.team }, (err, team) => {
      if (err) { return next(err) }
      if (!team) { return res.status(422).send({ error: 'Cannot retrieve team' }) }

      team.users.push(userInvited)
      team.save((err) => {
        if (err) { return next(err) }

        // Update invitation
        invitation.save((err) => {
          if (err) { return next(err) }

          res.send({ success: `You have joined ${team.name}` })
        })
      })
    })
  })
}

exports.decline = (req, res, next) => {
  const invitation = new Invitation(req.invitation)

  invitation.status = 'Declined'
  invitation.status_date = new Date()

  // Get user
  User.findOne({ email: invitation.email}, (err, userInvited) => {
    if (err) { return next(err) }
    if(!userInvited) { return res.status(422).send({ error: 'Cannot retrieve this invitation' }) }

    // Check if user can only accept his invits
    if(!userInvited._id.equals(req.user._id)) {
      return res.status(422).send({ error: 'Cannot access to others invitations' })
    }

    // Update invitation
    invitation.save((err) => {
      if (err) { return next(err) }

      res.send({ success: `You have declined invitation` })
    })
  })
}

exports.find = (req, res, next) => {
  Invitation.find({ email: req.user.email, status: 'Pending' }, (err, invitations) => {
    if (err) { return next(err) }
    if (!invitations) { return res.status(422).send({ error: 'Cannot retrieve invitations' }) }

    res.send({ invitations })
  })
}
