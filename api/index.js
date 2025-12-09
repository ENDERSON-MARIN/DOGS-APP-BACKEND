const app = require("../src/app.js");
const { database } = require("../src/db.js");
require("dotenv").config();

// Para Vercel, não precisamos do server.listen()
// A Vercel gerencia isso automaticamente

// Sincronizar banco de dados
database
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// Exportar o app para a Vercel
module.exports = app;
