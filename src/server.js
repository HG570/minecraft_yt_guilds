const express = require("express");
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const rota_players = require('./controller/playersController');
const rota_guilds = require('./controller/guildsController');
const mongoose = require("mongoose");
const { appendFile } = require("fs");
//vamos carregar nosso modelo
require("./models/players");
const Players = mongoose.model("players");
require("./models/guilds");
const Guilds = mongoose.model("guilds");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
//Remanejando Rotas de players
app.use('/rota_players', rota_players);
app.use('/rota_guilds', rota_guilds);
app.get('/', async (req, res) => {
        try {
            const guilds = await Guilds.find().lean(); // Busque todas as guilds
            const players = await Players.find().lean(); // Busque todos os jogadores
    
            // Mapeie os jogadores para substituir o ID da guild pelo nome da guild correspondente
            const playersWithGuildName = players.map(player => {
                const guild = guilds.find(guild => guild._id.toString() === player.guild.toString());
                return {
                    ...player,
                    guild: guild ? guild.nome : 'Guild não encontrada' // Se não encontrar a guild, exiba uma mensagem de erro
                };
            });
    
            res.render("home", { guilds, players: playersWithGuildName });
        } catch (error) {
            console.log("Erro ao carregar guilds ou player:", error);
            res.status(500).send("Erro ao carregar guilds ou player");
        }
});
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor Rodando");
});