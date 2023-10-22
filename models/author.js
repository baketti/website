const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})

authorSchema.pre('remove', async function(next) {
     await Book.find({ author: this.id }, (err, books) => {
      if (err) {
        console.log('next(err)')
        next(err)
      } else if (books.length > 0) {
        next(new Error('This author has books still'))
      } else {
        next()
      }
    })
})

module.exports = mongoose.model('Author',authorSchema)