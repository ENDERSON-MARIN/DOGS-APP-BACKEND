const { Dog, Temperament } = require("../db.js");
const { Op } = require("sequelize");
const { getAllDogs } = require("../controllers/index");

/* GET ALL DOGS FROM DB-API OR BY NAME WITH ASYNC - AWAIT */
// const getAllDogsOrByName = async (req, res, next) => {
//   try {
//     const { name } = req.query;
//     const allDogs = await getAllDogs();
//     if (name) {
//       const dogsByName = allDogs.filter((dog) =>
//         dog.name.toLowerCase().includes(name.toLowerCase())
//       );
//       dogsByName.length
//         ? res.status(200).send(dogsByName)
//         : res.status(404).send(`Dog with name ${name} not exist!`);
//     } else {
//       res.status(200).send(allDogs);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

/* GET ALL DOGS OR BY NAME WITH PROMISES */
const getAllDogsNamePromise = (req, res, next) => {
  const { name } = req.query;
  getAllDogs()
    .then((allDogs) => {
      if (name) {
        const dogsFiltered = allDogs.filter((dogs) =>
          dogs.name.toLowerCase().includes(name.toLowerCase())
        );
        dogsFiltered.length
          ? res.status(200).send(dogsFiltered)
          : res.status(404).send(`Dog with name ${name} not exist!`);
      } else {
        res.status(200).send(allDogs);
      }
    })
    .catch((error) => next(error));
};

/* GET ONE DOG BY ID FROM DB OR API */
const getAllDogsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Se o id é UUID (maior que 7 caracteres), buscar direto no DB
    if (id.length > 7 && typeof id === "string") {
      // Query direta no DB ao invés de buscar todos e filtrar
      const dogDb = await Dog.findByPk(id, {
        include: {
          model: Temperament,
          attributes: ["name"],
          through: { attributes: [] },
        },
      });

      if (dogDb) {
        const dogFormatted = {
          id: dogDb.id,
          name: dogDb.name,
          height_min: dogDb.height_min,
          height_max: dogDb.height_max,
          weight_min: dogDb.weight_min,
          weight_max: dogDb.weight_max,
          years_life: dogDb.years_life,
          image: dogDb.image,
          temperaments: dogDb.temperaments.map((t) => t.name).join(", "),
        };
        return res.status(200).json(dogFormatted);
      }
      return res.status(404).send(`Dog with id ${id} not exist in the DB!`);
    }

    // Se é ID numérico, buscar na API
    const allDogs = await getAllDogs();
    const dogByIdApi = allDogs.find((e) => e.id === Number(id));

    if (dogByIdApi) {
      return res.status(200).json(dogByIdApi);
    }
    return res.status(404).send(`Dog with id ${id} not exist in the API!`);
  } catch (error) {
    next(error);
  }
};

/* CREATE NEW DOG IN THE DATABASE */
const createDog = async (req, res, next) => {
  try {
    const {
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
      temperaments,
    } = req.body;

    // Criar o dog
    const newDog = await Dog.create({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
    });

    // Se houver temperamentos, associar
    if (temperaments && temperaments.length > 0) {
      const temperamentsInDb = await Temperament.findAll({
        where: {
          id: {
            [Op.in]: temperaments,
          },
        },
        attributes: ["id"], // Buscar apenas o ID para melhor performance
      });

      // Usar await para garantir que a associação seja concluída
      await newDog.addTemperaments(temperamentsInDb);
    }

    // Buscar o dog criado com os temperamentos para retornar completo
    const dogWithTemperaments = await Dog.findByPk(newDog.id, {
      include: {
        model: Temperament,
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    });

    res.status(201).json({
      succMsg: "Dog Created Successfully!",
      newDog: dogWithTemperaments,
    });
  } catch (error) {
    next(error);
  }
};

/* UPDATE ONE DOG IN THE DATABASE */
const updateDog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
      temperaments,
    } = req.body;

    // Usar findByPk ao invés de findOne para melhor performance
    const dogDb = await Dog.findByPk(id);

    if (!dogDb) {
      return res.status(404).send({ error: "Dog not found!" });
    }

    // Atualizar o dog
    await dogDb.update({
      name,
      height_min,
      height_max,
      weight_min,
      weight_max,
      years_life,
      image,
    });

    // Se houver temperamentos, atualizar associações
    if (temperaments && temperaments.length > 0) {
      const temperamentsDb = await Temperament.findAll({
        where: {
          id: {
            [Op.in]: temperaments,
          },
        },
        attributes: ["id"], // Buscar apenas o ID para melhor performance
      });

      await dogDb.setTemperaments(temperamentsDb);
    }

    // Buscar o dog atualizado com temperamentos para retornar completo
    const updatedDog = await Dog.findByPk(id, {
      include: {
        model: Temperament,
        attributes: ["id", "name"],
        through: { attributes: [] },
      },
    });

    res.status(200).json({
      succMsg: "Dog Updated Successfully!",
      updatedDog,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE DOG IN THE DATABASE */
const deleteDog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const dogDb = await Dog.findByPk(id);

    if (!dogDb) {
      return res.status(404).send({ error: "Dog not found!" });
    }

    await dogDb.destroy();
    return res.status(200).json({
      succMsg: "Dog Deleted Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE DOG IN THE DATABASE WITH PROMISES*/
// const deleteDog = (req, res, next) => {
//   const { id } = req.params;

//   Dog.findByPk(id)
//     .then((dogBd) => {
//       if (dogBd === null) {
//         return res.status(400).send("Dog not found!");
//       } else {
//         dogBd.destroy();
//         return res.status(200).send("Dog Deleted Successfully! ");
//       }
//     })
//     .catch((error) => next(error));
// };

module.exports = {
  getAllDogsNamePromise,
  getAllDogsById,
  createDog,
  updateDog,
  deleteDog,
};
