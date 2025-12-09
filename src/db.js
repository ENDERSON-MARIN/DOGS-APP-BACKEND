require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

// Importar pg explicitamente para garantir que está disponível
const pg = require("pg");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DATABASE_URL } =
  process.env;

// Configuração do Sequelize
// Suporta tanto DATABASE_URL (NeonDB, Vercel) quanto variáveis individuais (Docker local)
let sequelize;

if (DATABASE_URL) {
  // Usa DATABASE_URL se disponível (NeonDB, Vercel, etc.)
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    native: false,
    pool: {
      max: 1,
      min: 0,
      acquire: 3000,
      idle: 0,
    },
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
      connectTimeout: 3000,
    },
  });
} else if (process.env.NODE_ENV === "production") {
  // Production com variáveis individuais
  sequelize = new Sequelize({
    database: DB_NAME,
    dialect: "postgres",
    dialectModule: pg,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: false,
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      keepAlive: true,
    },
  });
} else {
  // Development local (Docker)
  sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME || "dogs_db"}`,
    {
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
      native: false,
    }
  );
}

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Dog, Temperament } = sequelize.models;

// Aca vendrian las relaciones
Dog.belongsToMany(Temperament, { through: "Dog_Temperaments" });
Temperament.belongsToMany(Dog, { through: "Dog_Temperaments" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  database: sequelize, // para importart la conexión { conn } = require('./db.js');
};
