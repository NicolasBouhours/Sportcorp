const mongoose = require('mongoose')
const User = require('../models/user')
const Team = require('../models/team')

exports.create = (req, res, next) => {
  const { name, description } = req.body

  if(!name) {
    return res.status(422).send({ error: 'You must provide an name' })
  }

  const team = new Team({
    name, description,
    creator: req.user
  })

  team.users.push(req.user)

  team.save((err) => {
    if (err) { return next(err) }

    res.send({ team: team, success: 'Team created successfully' })
  })
}

exports.find = (req, res, next) => {
  res.send({ team: req.team })
}

exports.findByUser = (req, res, next) => {
  //Team.find({ 'users._id': req.user._id }).exec((err, teams) => {
  Team.find({}).populate({ path: 'users', match: { _id: req.user._id }}).exec((err, teams) => {
    if (err) { return next(err) }

    teams = teams.filter(team => team.users.length > 0)

    res.send({ teams })
  })
}

exports.update = (req, res, next) => {
  const { name, description } = req.body

  if(!name) {
    return res.status(422).send({ error: 'You must provide an name' })
  }

  const team = new Team(req.team)

  team.name = name
  team.description = description

  team.save((err) => {
    if (err) { return next(err) }

    res.send({ team: team, success: 'Team updated successfully' })
  })
}

exports.delete = (req, res, next) => {
  if(!req.user._id.equals(req.team.creator)) {
    return res.status(422).send({ error: 'You must be team creator' })
  }

  const team = new Team(req.team)

  team.remove((err) => {
    if (err) { return next(err) }

    res.send({ team: team, success: 'Team deleted successfully' })
  })
}
