require("dotenv").config();
const app = require("../src/app.js");
const { database } = require("../src/db.js");

// Verificar conexão apenas uma vez (não fazer sync em produção)
let dbConnected = false;

const checkDatabaseConnection = async () => {
  if (!dbConnected && process.env.NODE_ENV === "production") {
    try {
      await database.authenticate();
      console.log("Database connection established successfully");
      dbConnected = true;
    } catch (error) {
      console.error("Unable to connect to database:", error);
      // Não lançar erro, deixar a aplicação tentar conectar na próxima requisição
    }
  }
};

// Handler para Vercel Serverless Functions
module.exports = async (req, res) => {
  try {
    // Apenas verificar conexão, não fazer sync
    await checkDatabaseConnection();
    return app(req, res);
  } catch (error) {
    console.error("Function error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
