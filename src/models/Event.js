const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const EventSchema = new Schema({
    title:{
        type: mongoose.SchemaTypes.String,
        required:true
    },
    body:{
        type: mongoose.SchemaTypes.String,
        required:true
    },
    eventDate:{
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    },
    referUrl:{
        type: mongoose.SchemaTypes.String,
        default:"Not Available"
    },
    sponser:{
        type: mongoose.SchemaTypes.String,
        default:"Make-it-in-germany"
    },
    createdAt:{
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    },
    updatedAt:{
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    }
});

module.exports=mongoose.model('Event', EventSchema);
