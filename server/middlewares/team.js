const User = require('../models/user')
const Team = require('../models/team')

const ExtractTeam = (req, res, next) => {

  Team.findOne({ _id: req.params.teamId})
    .then((team) => {
      if (team) {
        req.team = team
      }

      next()
  })
  .catch((err) => next(err))
}

module.exports = ExtractTeam
