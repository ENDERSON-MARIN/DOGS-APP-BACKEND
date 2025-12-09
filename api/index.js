require("dotenv").config();
const app = require("../src/app.js");

// Exportar o app diretamente para Vercel
// O Sequelize gerenciará as conexões automaticamente quando necessário
module.exports = app;
