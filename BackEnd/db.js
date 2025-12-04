// Importação do pacote do Postgre
const { Pool } = require('pg')

// Conexão com o Banco de Dados
const pool = new Pool ({
    host: 'postgres',
    user: 'localhost',
    database: 'eletronic-store',
    password: 'root',
    port: 5432
})

// Verificando a conexão com o Banco de Dados
pool.connect()
    .then(client => {
        console.log('Conexão bem-sucedida!')
        client.release()
    })
    .catch(error => {
        console.error(`Falha ao conectar com o Banco de Dados: ${error.message}`)
        process.exit(1)
    })

// Exportando a pool
module.exports = pool