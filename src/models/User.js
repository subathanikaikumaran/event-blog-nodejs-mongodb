const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  lastname: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique:true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  
  creatAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
});


module.exports = mongoose.model('users',UserSchema);
