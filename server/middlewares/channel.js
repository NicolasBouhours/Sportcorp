const User = require('../models/user')
const Channel = require('../models/channel')

const ExtractChannel = (req, res, next) => {

  Channel.findOne({ _id: req.params.channelId}, (err, channel) => {
    if (err) { return next(err) }

    if (channel) {
      req.channel = channel
    }

    next()
  })
}

module.exports = ExtractChannel
