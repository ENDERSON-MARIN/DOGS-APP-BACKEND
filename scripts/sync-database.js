require("dotenv").config();
const { database } = require("../src/db.js");

// Script para sincronizar o banco de dados
// Execute este script localmente ou uma vez no ambiente de produção
// para criar as tabelas necessárias

const syncDatabase = async () => {
  try {
    console.log("Conectando ao banco de dados...");
    await database.authenticate();
    console.log("Conexão estabelecida com sucesso.");

    console.log("Sincronizando modelos com o banco de dados...");
    await database.sync({ force: false, alter: false });
    console.log("Banco de dados sincronizado com sucesso!");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao sincronizar banco de dados:", error);
    process.exit(1);
  }
};

syncDatabase();
