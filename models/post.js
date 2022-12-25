const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pliSchema = new Schema({
id: {
    type: String,
    required: true,
},
username: {
    type: String,
    required: true,
},
firstName: {
    type: String,
    required: true,
},
status: {
    type: Boolean,
    required: true,
},
home: {
    type: Boolean,
    required: true,
},
work: {
    type: Boolean,
    required: true,
},
homekWork: {
    type: Boolean,
    required: true,
},
countUsers: {
    type: Number,
    required: true,
},
welcomMessageId: {
    type: Number,
    required: true,
}
}, { timestamps: true})


const Pli = mongoose.model('Plitka', pliSchema);
module.exports = Pli
