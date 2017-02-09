const User = require('../models/user')
const Team = require('../models/team')
const Channel = require('../models/channel')

exports.create = (req, res, next) => {
  const { name, description, public, teamId } = req.body

  // Get Team
  Team.findOne({ _id: teamId}, (err, team) => {
    if (err) { return next(err) }

    if (!team) {
      return res.status(422).send({ error: 'Cannot retrieve project' })
    }

    // test if name is valid
    if(!name) {
      return res.status(422).send({ error: 'You must provide an name' })
    }

    // Create channel
    const channel = new Channel({
      name, description, public,
      creator: req.user,
      team: team,
    })

    // Push user on existing list of user for the channel
    channel.users.push(req.user)

    // Save channel
    channel.save((err) => {
      if (err) { return next(err) }

      // Populate channel into team
      team.channels.push(channel)
      team.save((err) => {
        res.send({ channel: channel, success: 'Channel created successfully' })
      })
    })
  })
}


exports.find = (req, res, next) => {
  res.send({ channel: req.channel })
}

exports.findByTeam = (req, res, next) => {
  // Get all channels for one team
  Team.findOne({ _id: req.query.teamId }).populate('channels').exec((err, team) => {
    if (err) { return next(err) }

    res.send({ channels: team.channels })
  })
}

exports.update = (req, res, next) => {
  const { name, description } = req.body

  // Verify if name is send
  if(!name) {
    return res.status(422).send({ error: 'You must provide an name' })
  }

  const channel = new Channel(req.channel)

  channel.name = name
  channel.description = description

  // Save channel
  channel.save((err) => {
    if (err) { return next(err) }

    res.send({ channel: channel, success: 'Channel updated successfully' })
  })
}

exports.delete = (req, res, next) => {
  // Check if user have rights for delete channel
  if(!req.user._id.equals(req.channel.creator)) {
    return res.status(422).send({ error: 'You must be channel creator' })
  }

  const channel = new Channel(req.channel)

  // Remove channels from team
  Team.findOne({ _id: req.channel.team }, (err, team) => {
    if (err) { return next(err) }

    team.channels.remove(channel)

    team.save((err) => {
      if (err) { return next(err) }

      // Remove channel
      channel.remove((err) => {
        if (err) { return next(err) }

        res.send({ channel: channel, success: 'Channel deleted successfully' })
      })
    })
  })
}
