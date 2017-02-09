const User = require('../models/user')
const Team = require('../models/team')

const ExtractTeam = (req, res, next) => {

  Team.findOne({ _id: req.params.teamId}, (err, team) => {
    if (err) { return next(err) }

    if (team) {
      req.team = team
    }

    next()
  })
}

module.exports = ExtractTeam
