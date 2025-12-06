// Importação dos pacotes necessários
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const pool = require('./db')

const app = express()
const port = 3000
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_muito_forte_123'

app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})

// -- Configuração do Email (nodemailer) -- //
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nao esquecer de colocar o gmail',
        pass: 'senhazinha marota'
    }
})

// -- Middleware de Autenticação -- //
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ status: 'error', message: 'Token ausente.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: 'error', message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

//      -- Rotas GET --     //

// 1. Pegando as informações do Usuári
app.get('/api/usuario/perfil', authenticateToken, async (req, res) => {
    const userEmail = req.user.email; 

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        const userResult = await client.query(`
            SELECT 
                id, 
                name, 
                email, 
                phone, 
                registration_date, 
                is_active, 
                user_type
            FROM users 
            WHERE email = $1
        `, [userEmail]);

        const user = userResult.rows[0];
        
        if (!user) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const addressesResult = await client.query(`
            SELECT 
                id, 
                street, 
                number, 
                complement, 
                neighborhood, 
                city, 
                state, 
                zip_code, 
                is_primary
            FROM addresses 
            WHERE user_id = $1
            ORDER BY is_primary DESC, id DESC
        `, [user.id]); 
        
        const userData = {
            ...user,
            addresses: addressesResult.rows,
        };

        await client.query('COMMIT');
        
        res.json(userData); 
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil no servidor.' });
    } finally {
        client.release();
    }
});

//      -- Rotas POST --    //

// 1. Login de Usuário
app.post('/api/autenticacao/login', async (req, res) => {
    const { email, password } = req.body; 
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Dados insuficientes para login.' });
    }

    try {
        const results = await pool.query(`
            SELECT name, email, password_hash
            FROM users
            WHERE email = $1
        `, [email]);

        if (results.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const user = results.rows[0];

        if (password === user.password_hash) { 
            const token = jwt.sign({ name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
            return res.json({ 
                status: 'success', 
                user: { name: user.name, email: user.email }, 
                token 
            });
        } else {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// 2. Cadastro de Usuário
app.post('/api/cadastro/usuario', async (req, res) => {
    const {
        name,
        email,
        password,
        phone,
        user_type
    } = req.body;
    const plaintext_password = password;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(`
            INSERT INTO users (name, email, password_hash, phone, user_type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email`,
            [name, email, plaintext_password, phone, user_type || 'customer']
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso.',
            user: result.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');

        if (error.code === '23505' && error.constraint === 'users_email_key') {
            return res.status(409).json({ message: 'Erro: O e-mail fornecido já está em uso.' });
        }

        console.error(error);
        res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
    } finally {
        client.release();
    }
});