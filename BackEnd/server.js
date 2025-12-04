// Importação dos pacotes necessários
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})

