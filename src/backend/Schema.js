const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    email:String,
    username:String,
    password:String
});

const User = mongoose.model('USER',schema);
module.exports = User;