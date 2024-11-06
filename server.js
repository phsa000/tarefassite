const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao obter tarefas');
        }
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).send('O título é obrigatório');
    }
    
    connection.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao adicionar tarefa');
        }
        res.status(201).send({ id: results.insertId, title });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    connection.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao deletar tarefa');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Tarefa não encontrada');
        }
        res.status(200).send(`Tarefa ${taskId} deletada com sucesso`);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
