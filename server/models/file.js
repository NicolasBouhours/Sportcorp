const mongoose = require('mongoose')
const Schema = mongoose.Schema

const fileSchema = new Schema({
  email: { type: name, required: true },
  url: { type: name },
  size: { type: name },
  type: { type: name },
  message: { type: Schema.Types.ObjectId, ref: 'Message' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

const File = mongoose.model('File', fileSchema)

module.exports = File
