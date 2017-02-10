const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  file: { type: Schema.Types.ObjectId, ref: 'File' },
  created_at : { type: Date, required: true, default: Date.now }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
