const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const passport = require('./config/passport'); 
const usersRouter = require('./routes/users.router');
const sessionsRouter = require('./routes/sessions.router');

const app = express();

// 🔹 Servir archivos estáticos de /public
app.use(express.static(path.join(__dirname, '../public')));

// Middlewares base
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas API
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Ruta base para probar
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 🔹 Conexión a Mongo
const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'ecommerce' });
  console.log('✅ Mongo conectado');
};

module.exports = { app, connectDB };
