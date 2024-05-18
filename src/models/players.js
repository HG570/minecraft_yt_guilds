require('./db');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Players = new Schema({
    nome: {
        type: String,
        required: true
    },
    guild: { 
        type: Schema.Types.ObjectId,
        ref: 'guilds'
    }

});
mongoose.model("players", Players);