const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = (req, res, next) => {
  // User has already had their email and password auth
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user), id: req.user._id })
}

exports.signup = (req, res, next) => {
  const { email, password, firstname, lastname, phone, job } = req.body

  if (!email || !password || !firstname || !lastname) {
    return res.status(422).send({ error: 'You must provide an email, password, firstname and lastname' })
  }

  // See if user already exist on database
  User.findOne({ email: email })
    .then((existingUser) => {
      // If user with an email exist, throw an error
      if (existingUser) {
        return res.status(422).send({ error: 'Email is in use' })
      }

      // If user with this email don't exist, create and save user record
      const user = new User({
        email,
        password,
        firstname,
        lastname,
        phone,
        job
      })

      user.save()
        .then(() => res.json({ token: tokenForUser(user) }))
        .catch((err) => next(err))
    })
    .catch((err) => next(err))
}

exports.update = (req, res, next) => {
  const { firstname, lastname, phone, job } = req.body

  if (!firstname || !lastname) {
    return res.status(422).send({ error: 'You must provide an firstname and lastname' })
  }

  User.findOne({ _id: req.user._id })
   .then((existingUser) => {

     // If user with an email exist, throw an error
     if (!existingUser) {
       return res.status(422).send({ error: 'Cannot found user' })
     }

     // If user with this email don't exist, create and save user record
     existingUser.firstname = firstname
     existingUser.lastname = lastname
     existingUser.phone = phone
     existingUser.job = job

     existingUser.save()
     .then(() => res.json({ success: 'User modified successfully' }))
     .catch((err) => next(err))
   })
   .catch((err) => next(err))

}

exports.updatePassword = (req, res, next) => {
  const { password, passwordConfirm } = req.body

  if (!password) {
    return res.status(422).send({ error: 'You must provide an password' })
  }

  if (password !== passwordConfirm) {
    return res.status(422).send({ error: 'You must provide same password and confirm password' })
  }

  // See if user already exist on database
  User.findOne({ _id: req.user._id })
    .then((existingUser) => {

      // If user with an email exist, throw an error
      if (!existingUser) {
        return res.status(422).send({ error: 'Cannot found user' })
      }

      // If user with this email don't exist, create and save user record
      existingUser.password = password

      existingUser.save()
        .then(() => res.json({ success: 'Password modified successfully' }) )
        .catch((err) => next(err))

    })
    .catch((err) => next(err))
}
