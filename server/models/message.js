const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  text: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isChannel: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isFile: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  file: { type: Schema.Types.ObjectId, ref: 'File' },
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  thread: { type: Schema.Types.ObjectId, ref: 'Thread' },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  created_at : { type: Date, required: true, default: Date.now }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
