/*1°) Importações*/
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
//vamos carregar nosso modelo
require("../models/guilds");
const Guilds = mongoose.model("guilds");
/*_____________ Rotas das guilds __________________ */
/*2°) Abre e carrega todas informações de guilds no formulário
guilds.handlebars */
router.get('/guilds', (req, res) => {
    Guilds.find().lean().then((guilds) => {
        res.render("admin/guilds/guilds", { guilds: guilds });
    });
});
/*3°) Abre o Formulário addguilds.handlebars */
router.get('/guilds/add', (req, res) => {
    res.render("admin/guilds/addguilds");
});
/*4°) Recebe as informações do botão que está no addguilds.handlebar
e efetua o cadastro no banco de dados, depois ele volta para a listagem
das guilds */
router.post('/guilds/nova', (req, res) => {
    var guilds = new Guilds();
    guilds.nome = req.body.nome;
    guilds.save().then(() => {
        res.redirect("/rota_guilds/guilds");
    }).catch((erro) => {
        res.send('Houve um erro: ' + erro);
    });
});
/*5°) Abre e preenche o formulário editguilds.handlebars com informações
do id passado */
router.get('/editar_guilds/:id', (req, res) => {
    Guilds.findOne({ _id: req.params.id }).lean().then((guilds) => {
        res.render("admin/guilds/editguilds", { guilds: guilds });
    });
});
/*6°) Recebe as informações do botão que está no edittarefa.handlebar
e efetua a alteração no banco de dados. Volta para listagem das guilds*/
router.post('/guilds/editar_guilds', (req, res) => {
    guilds.updateOne({ _id: req.body._id },
        {
            $set: {
                nome: req.body.nome, descricao: req.body.descricao
            }
        }).then(() => {
            res.redirect("/rota_guilds/guilds");
        });
});
/*7°) No form turma.handlebars que lista as turmas possui um botão para
deletar
Ele deleta informação e refaz a lista no turma.handlebars*/
router.get('/deletar_guilds/:id', (req, res) => {
    Guilds.deleteMany({ _id: req.params.id }).then(() => {
        res.redirect("/rota_guilds/guilds");
    });
});
/*______ Fim das rotas das guilds ___________ */
module.exports = router;