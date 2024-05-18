/*1°) Importações*/
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
//vamos carregar nosso modelo
require("../models/players");
const Players = mongoose.model("players");
require("../models/guilds");
const Guilds = mongoose.model("guilds");
/*_____________ Rotas das players __________________ */
/*2°) Abre e carrega todas informações de players no formulário
players.handlebars */
router.get('/players', async (req, res) => {
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

        res.render("admin/players/players", { guilds, players: playersWithGuildName });
    } catch (error) {
        console.log("Erro ao carregar guilds ou player:", error);
        res.status(500).send("Erro ao carregar guilds ou player");
    }
});
/*3°) Abre o Formulário addplayers.handlebars */
router.get('/players/add', (req, res) => {
    Guilds.find().lean().then((guilds) => {
        res.render("admin/players/addplayers", { guilds: guilds });
    });
});
/*4°) Recebe as informações do botão que está no addplayers.handlebar
e efetua o cadastro no banco de dados, depois ele volta para a listagem
das players */
router.post('/players/nova', (req, res) => {
    var players = new Players();
    players.nome = req.body.nome;
    players.guild = req.body.guild;
    players.save().then(() => {
        res.redirect("/rota_players/players");
    }).catch((erro) => {
        res.send('Houve um erro: ' + erro);
    });
});
/*5°) Abre e preenche o formulário editplayers.handlebars com informações
do id passado */
router.get('/editar_players/:id', (req, res) => {
    Promise.all([
        Guilds.find().lean(),
        Players.findOne({ _id: req.params.id }).lean()
    ]).then(([guilds, players]) => {
        res.render("admin/players/editplayers", { guilds: guilds, players: players });
    }).catch((error) => {
        console.log("Erro ao carregar guilds ou player:", error);
        res.status(500).send("Erro ao carregar guilds ou player");
    });
});
/*6°) Recebe as informações do botão que está no edittarefa.handlebar
e efetua a alteração no banco de dados. Volta para listagem das players*/
router.post('/players/editar_players', (req, res) => {
    Players.updateOne({ _id: req.body._id },
        {
            $set: {
                nome: req.body.nome,
                guild: req.body.guild
            }
        }).then(() => {
            res.redirect("/rota_players/players");
        });
});
/*7°) No form turma.handlebars que lista as turmas possui um botão para
deletar
Ele deleta informação e refaz a lista no turma.handlebars*/
router.get('/deletar_players/:id', (req, res) => {
    Players.deleteMany({ _id: req.params.id }).then(() => {
        res.redirect("/rota_players/players");
    });
});
/*______ Fim das rotas das players ___________ */
module.exports = router;