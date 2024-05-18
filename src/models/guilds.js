require('./db');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Guilds = new Schema({
    nome: {
        type: String,
        required: true
    }
});
mongoose.model("guilds", Guilds);