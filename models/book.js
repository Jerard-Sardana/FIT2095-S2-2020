var mongoose = require('mongoose');
let moment = require('moment');

var bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        validate: {
            validator: function (isbnString) {
                return isbnString.length == 13;
            },
            message: 'ISBN should be 13 characters long'
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    pubdate: {
        type: Date,
        get: function(newDate){
            return moment(newDate).format('YYYY-MM-DD');
        }
    },
    summary:String 
});

module.exports = mongoose.model('Book', bookSchema);