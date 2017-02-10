const User = require('../models/user')
const Channel = require('../models/channel')

const ExtractChannel = (req, res, next) => {

  Channel.findOne({ _id: req.params.channelId})
    .then((channel) => {
      if (channel) {
        req.channel = channel
      }

      next()
  })
  .catch((err) => next(err))
}

module.exports = ExtractChannel
