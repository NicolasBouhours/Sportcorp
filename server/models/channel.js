const mongoose = require('mongoose')
const Schema = mongoose.Schema

const channelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  public: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created_at : { type: Date, required: true, default: Date.now }
})

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel
