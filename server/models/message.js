const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  created_at : { type: Date, required: true, default: Date.now }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
