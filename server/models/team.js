const mongoose = require('mongoose')
const Schema = mongoose.Schema

const teamSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],
  created_at : { type: Date, required: true, default: Date.now }
})

const Team = mongoose.model('Team', teamSchema)

module.exports = Team
