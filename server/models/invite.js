const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inviteSchema = new Schema({
  status: { type: String, default: 'Pending' },
  status_date: { type: Date },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  created_at : { type: Date, required: true, default: Date.now },
})

const Invite = mongoose.model('Invite', inviteSchema)

module.exports = Invite
