const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
  name: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  created_at : { type: Date, required: true, default: Date.now }
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation
