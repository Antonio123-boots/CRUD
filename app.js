const express = require('express');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const userRoutes   = require('./routes/userRoutes');   // O seu arquivo atual atualizado
const authRoutes    = require('./routes/authRoutes');   // Processamento de login/logout
const campusRoutes  = require('./routes/campusRoutes'); // Painel do Campus
const adminRoutes   = require('./routes/adminRoutes');  // Painel do Admin

const app = express();
const PORT = process.env.PORT || 3000;
global.sessions = new Map();

function getCookie(req, name) {
    const cookies = req.headers.cookie ? req.headers.cookie.split(';') : [];
    const match = cookies.map((item) => item.trim()).find((item) => item.startsWith(name + '='));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Atualizado para usar path.join (boa prática)

// 2. CONFIGURAÇÃO DO EXPRESS LAYOUTS
app.use(expressLayouts);
app.set('layout', 'layout'); // Indica que o arquivo principal se chama 'layout.ejs'

// Serve static files from the 'public' folder (css, imagens, js, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use((req, res, next) => {
    const sessionId = getCookie(req, 'sid');
    req.sessionId = sessionId || null;
    req.session = global.sessions.get(sessionId) || {};

    res.locals.usuarioLogado = req.session?.usuario || null;
    res.locals.mostrarFiltros = false;
    next();
});

app.use((req, res, next) => {
    const originalRedirect = res.redirect.bind(res);
    res.redirect = (url) => {
        if (!req.sessionId && req.session?.usuario) {
            const sessionId = crypto.randomUUID();
            req.sessionId = sessionId;
            global.sessions.set(sessionId, req.session);
            res.setHeader('Set-Cookie', `sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
        }
        return originalRedirect(url);
    };
    next();
});

app.use('/', userRoutes);          // Caminhos públicos (ex: / , /login , /equipes)
app.use('/auth', authRoutes);      // Caminhos de ação (ex: /auth/login)
app.use('/campus', campusRoutes);  // Caminhos do Campus (ex: /campus/atletas)
app.use('/admin', adminRoutes);    // Caminhos do Admin (ex: /admin/laudos)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});