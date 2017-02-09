const mongoose = require('mongoose')
const Schema = mongoose.Schema

const invitationSchema = new Schema({
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  status: { type: String, default: 'Pending' },
  status_date: { type: Date },
  created_at : { type: Date, required: true, default: Date.now },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Invitation = mongoose.model('Invitation', invitationSchema)

module.exports = Invitation
