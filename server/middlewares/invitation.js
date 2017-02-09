const User = require('../models/user')
const Invitation = require('../models/invitation')

const ExtractInvitation = (req, res, next) => {

  Invitation.findOne({ _id: req.params.invitationId}, (err, invitation) => {
    if (err) { return next(err) }

    if (invitation) {
      req.invitation = invitation
    }

    next()
  })
}

module.exports = ExtractInvitation
