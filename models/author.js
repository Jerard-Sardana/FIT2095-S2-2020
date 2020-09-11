var mongoose = require('mongoose');
let moment = require('moment');

var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName:{
            type:String,
            validate:{
                validator: function (nameLength){
                    return nameLength.length > 5;
                },
                message: 'Surname must be at least 5 characters in length'
            }
        },
    },
    dob: {
        type: Date,
        get: function(newDate){
            return moment(newDate).format('YYYY-MM-DD');
        }
    },
    address: {
        state: {
            type:String,
            validate: {
                validator: function (stateLength) {
                    return stateLength.length >= 2 && stateLength.length <= 3;
                },
                message: 'State must be 2 or 3 characters, e.g., SA, VIC'
            }
        },
        suburb:String,
        street:String,
        unit:Number,
    },
    pubs: {
        type:Number,
        validate: {
            validator: function(booksNum){
                return booksNum % 1 == 0 && booksNum >= 1 && booksNum <= 150;
            },
            message: 'Number of books should be an integer from 1 to 150'
        }
    }
});

module.exports = mongoose.model('Author', authorSchema);
