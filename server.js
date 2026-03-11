const express = require('express');
const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

module.exports = {
    server,
    PORT
};