const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware para interpretar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(cors()); // Permite CORS

// Configuração da conexão MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ou seu nome de usuário
    password: 'root', // a senha que você definiu
    database: 'todo_app' // substitua pelo seu banco de dados
});

// Conexão com o MySQL
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
    connection.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao obter tarefas');
        }
        res.json(results);
    });
});

// Rota para adicionar uma nova tarefa
app.post('/tasks', (req, res) => {
    const { title } = req.body; // Desestrutura o título do corpo da requisição
    if (!title) {
        return res.status(400).send('Título é obrigatório'); // Retornar erro se o título não estiver presente
    }
    connection.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar tarefa:', err); // Log do erro
            return res.status(500).send('Erro ao adicionar tarefa');
        }
        res.status(201).send({ id: results.insertId, title });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
