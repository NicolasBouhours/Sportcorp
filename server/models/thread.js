const mongoose = require('mongoose')
const Schema = mongoose.Schema

const threadSchema = new Schema({
  created_at : { type: Date, required: true, default: Date.now },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
})

const Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
