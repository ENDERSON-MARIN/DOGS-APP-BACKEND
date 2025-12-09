const axios = require("axios").default;
const { Dog, Temperament } = require("../db");
const { API_KEY } = process.env;

/* GET ALL DOGS FROM THE API */
const getDogsApi = async () => {
  try {
    const dataApi = (
      await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    ).data;
    const apiDogs = dataApi.map((e) => {
      return {
        id: e.id,
        name: e.name,
        height_min: Number(e.height.metric.split("-")[0] || NaN),
        height_max: Number(e.height.metric.split("-")[1] || NaN),
        weight_min: Number(e.weight.metric.split("-")[0] || NaN),
        weight_max: Number(e.weight.metric.split("-")[1] || NaN),
        years_life: e.life_span || "Not found",
        image:
          e.image.url ||
          "https://img.freepik.com/premium-photo/cute-confused-little-dog-with-question-marks_488220-4972.jpg?w=2000",
        temperaments: e.temperament || "Not found",
      };
    });
    return apiDogs;
  } catch (error) {
    // Axios 1.x error handling pattern
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `API request failed with status ${error.response.status}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API No Response:", error.request);
      throw new Error("No response received from API");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Request Error:", error.message);
      throw error;
    }
  }
};

/* GET DOGS FROM THE DB */
const getDogsDb = async () => {
  try {
    const dogsDb = await Dog.findAll({
      include: {
        model: Temperament,
        attributes: ["name"],
        through: { attributes: [] }, // Evita trazer dados da tabela intermediária
      },
      raw: false, // Necessário para includes
    });

    // Usar destructuring e acesso direto para melhor performance
    const dogsWithTemperaments = dogsDb.map((d) => ({
      id: d.id,
      name: d.name,
      height_min: d.height_min,
      height_max: d.height_max,
      weight_min: d.weight_min,
      weight_max: d.weight_max,
      years_life: d.years_life,
      image: d.image,
      temperaments: d.temperaments.map((t) => t.name).join(", "),
    }));

    return dogsWithTemperaments;
  } catch (error) {
    console.error("Error getting dogs from DB:", error.message);
    throw error;
  }
};

/* GET ALL DOGS FROM API AND DB */
const getAllDogs = async () => {
  try {
    // Executar ambas as queries em paralelo para melhor performance
    const [dogsApi, dogsDb] = await Promise.all([getDogsApi(), getDogsDb()]);

    return [...dogsApi, ...dogsDb];
  } catch (error) {
    console.error("Error getting all dogs:", error.message);
    throw error;
  }
};

/* GET ALL TEMPERAMENTS */
const getAllTemperaments = async () => {
  try {
    // Verificar se já existem temperamentos no banco
    const existingTemperaments = await Temperament.findAll();

    // Se já existem temperamentos, retornar do cache
    if (existingTemperaments.length > 0) {
      return existingTemperaments;
    }

    // Buscar da API apenas se não houver dados no banco
    const dataApi = (
      await axios(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    ).data;

    // Processar temperamentos de forma otimizada
    const uniqueTemperaments = dataApi
      .map((e) => e.temperament)
      .filter(Boolean) // Remove valores null/undefined
      .join(",")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0); // Remove strings vazias

    // Usar Set para remover duplicados
    const temperamentsSet = [...new Set(uniqueTemperaments)];

    // Bulk insert - muito mais rápido que findOrCreate individual
    // Usar bulkCreate com ignoreDuplicates para evitar erros
    await Temperament.bulkCreate(
      temperamentsSet.map((name) => ({ name })),
      {
        ignoreDuplicates: true,
        validate: true,
      }
    );

    // Retornar todos os temperamentos ordenados
    const allTemperaments = await Temperament.findAll({
      order: [["name", "ASC"]],
    });

    return allTemperaments;
  } catch (error) {
    // Axios 1.x error handling pattern
    if (error.response) {
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
      throw new Error(
        `API request failed with status ${error.response.status}`
      );
    } else if (error.request) {
      console.error("API No Response:", error.request);
      throw new Error("No response received from API");
    } else {
      console.error("Error getting temperaments:", error.message);
      throw error;
    }
  }
};

module.exports = {
  getDogsApi,
  getDogsDb,
  getAllDogs,
  getAllTemperaments,
};
