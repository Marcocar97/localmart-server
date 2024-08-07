const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Business = require("../models/Business.model");
const Offer = require("../models/Offer.model");
const Reserva = require("../models/Reservation.model");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth.middlewares");

const router = express.Router();

// POST "/api/auth/signup/user" => registrar el usuario
router.post("/signup/user", async (req, res, next) => {
  console.log(req.body);
  const { email, name, password } = req.body; // validaciones de backend
  if (!email || !password || !name) {
    res
      .status(400)
      .json({ errorMessage: "Email, name, and password are required" });
    return;
  } // verificar que la contraseña sea lo suficientemente fuerte
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "La contraseña debe tener min 8 caracteres, una minuscula, una mayuscula y algun otro caracter",
    });
    return;
  }
  try {
    // Verificar que no existe una cuenta con el mismo correo
    const foundUser = await User.findOne({ email });
    const foundBusiness = await Business.findOne({ email });

    if (foundUser || foundBusiness) {
      res.status(400).json({
        errorMessage: "Ya existe una cuenta con ese correo electronico",
      });
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({ email, name, password: hashPassword });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}); // POST "/api/auth/signup/business" => registrar el negocio
router.post("/signup/business", async (req, res, next) => {
  console.log(req.body);
  const {
    email,
    businessName,
    password,
    description,
    category,
    location,
    logo,
  } = req.body; // validaciones de backend
  if (
    !email ||
    !password ||
    !businessName ||
    !description ||
    !category ||
    !location
  ) {
    res.status(400).json({
      errorMessage:
        "Email, business name, password, description, category, and location are required",
    });
    return;
  } // verificar que la contraseña sea lo suficientemente fuerte
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "La contraseña debe tener min 8 caracteres, una minuscula, una mayuscula y algun otro caracter",
    });
    return;
  }
  try {
    // Verificar que no existe una cuenta con el mismo correo
    const foundUser = await User.findOne({ email });
    const foundBusiness = await Business.findOne({ email });
    if (foundBusiness || foundUser) {
      res.status(400).json({
        errorMessage: "Ya existe una cuenta con ese correo electronico",
      });
      return;
    }
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    await Business.create({
      email,
      businessName,
      password: hashPassword,
      description,
      category,
      location,
      logo,
    });
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

//LOGIN

// Ruta de inicio de sesión
router.post("/login", async (req, res, next) => {
  const { email, password, userType } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Email y password son obligatorios" });
  }
  try {
    // Verificar usuario en la base de datos
    const foundUser =
      userType === "business"
        ? await Business.findOne({ email: email })
        : await User.findOne({ email: email });
    if (!foundUser) {
      return res
        .status(400)
        .json({
          errorMessage: "Usuario no registrado con ese correo electrónico",
        });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ errorMessage: "Contraseña no correcta" });
    }
    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      userType: userType, 
    };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    res.status(200).json({ authToken, userType }); // Enviar userType en la respuesta
  } catch (error) {
    next(error);
  }
});

// Ruta para verificar el token
router.get("/verify", authenticate, (req, res, next) => {
    const {user} = req;
  res.status(200).json({user});
});

// RUTAS DE USERS

// /user-profile .. Obtener perfil del usuario
router.get("/user-profile", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// /user-profile .. Actualizar perfil del usuario

router.put("/user-profile", authenticate, async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ errorMessage: "Name, email, and password are required" });
  }
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ errorMessage: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// /user-profile .. Eliminar perfil del usuario

router.delete("/user-profile", authenticate, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//RUTAS DE NEGOCIOS

// /business-profile - Obtener perfil del negocio

router.get("/business-profile", authenticate, async (req, res, next) => {
  try {
    const business = await Business.findById(req.user._id);
    if (!business) {
      return res.status(404).json({ errorMessage: "Business not found" });
    }
    res.status(200).json(business);
  } catch (error) {
    next(error);
  }
});

// /business-profile - Actualizar perfil del negocio

router.put("/business-profile", authenticate, async (req, res, next) => {
  const { businessName, description, category, location, logo } = req.body;
  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.user._id,
      { businessName, description, category, location, logo },
      { new: true }
    );
    if (!updatedBusiness) {
      return res.status(404).json({ errorMessage: "Business not found" });
    }
    res.status(200).json(updatedBusiness);
  } catch (error) {
    next(error);
  }
});

// /business-profile - Eliminar perfil del negocio

router.delete("/business-profile", authenticate, async (req, res, next) => {
  try {
    await Business.findByIdAndDelete(req.user._id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// RUTAS DE OFERTAS

// /business-offer .. Agrega una nueva oferta

router.post("/business-offer", authenticate, async (req, res, next) => {
  const { offerName, description, availability, schedules, image } = req.body;
  try {
    const newOffer = await Offer.create({
      offerName,
      description,
      availability,
      schedules,
      image,
      business: req.user._id,
    });
    res.status(201).json(newOffer);
  } catch (error) {
    next(error);
  }
});

// /business-offer .. Actualizar una oferta

router.put(
  "/business-offers/:offerId",
  authenticate,
  async (req, res, next) => {
    const { offerId } = req.params;
    const { offerName, description, availability, schedules, image } = req.body;
    try {
      const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        { offerName, description, availability, schedules, image },
        { new: true }
      );
      if (!updatedOffer) {
        return res.status(404).json({ errorMessage: "Offer not found" });
      }
      res.status(200).json(updatedOffer);
    } catch (error) {
      next(error);
    }
  }
);

// /business-offer .. Eliminar una oferta

router.delete(
  "/business-offers/:offerId",
  authenticate,
  async (req, res, next) => {
    const { offerId } = req.params;
    try {
      await Offer.findByIdAndDelete(offerId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// /business-offers .. Ver todas las ofertas publicadas por el negocio

router.get("/business-offers", authenticate, async (req, res, next) => {
  try {
    const offers = await Offer.find({ business: req.user._id });
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
});

// RUTAS DE USUARIO-OFERTAS Y RESERVAS

// user-offers .. Obten todas las ofertas

router.get("/user-offers", async (req, res, next) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
});

// user-offers/:offerId .. Obten una oferta especifica

router.get("/user-offers/:offerId", async (req, res, next) => {
  const { offerId } = req.params;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ errorMessage: "Offer not found" });
    }
    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
});

// user-reservas ... Obten todas las reservas

router.get("/user-reservas", authenticate, async (req, res, next) => {
  try {
    const reservas = await Reserva.find({ User: req.user._id }).populate(
      "Offer"
    );
    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
});

// user-reservas ... Crear una reserva

router.post("/user-reservas", authenticate, async (req, res, next) => {
  const { offerId } = req.body;
  if (!offerId) {
    return res.status(400).json({ errorMessage: "Offer ID is required" });
  }
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ errorMessage: "Offer not found" });
    }
    const confirmationNumber = `RES-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const newReserva = await Reserva.create({
      confirmationNumber,
      offer: offerId,
      user: req.user._id,
    });
    res.status(201).json(newReserva);
  } catch (error) {
    next(error);
  }
});

// user-reservas/:reservaId ... Obten una reserva espicifica

router.get(
  "/user-reservas/:reservaId",
  authenticate,
  async (req, res, next) => {
    const { reservaId } = req.params;
    try {
      const reserva = await Reserva.findById(reservaId).populate("Offer");
      if (!reserva) {
        return res.status(404).json({ errorMessage: "Reserva not found" });
      }
      res.status(200).json(reserva);
    } catch (error) {
      next(error);
    }
  }
);

// user-reservas/:reservaId ... Eliminar una reserva espicifica

router.delete(
  "/user-reservas/:reservaId",
  authenticate,
  async (req, res, next) => {
    const { reservaId } = req.params;
    try {
      await Reserva.findByIdAndDelete(reservaId);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// user-favorites ... Obten las ofertas favoritas del usuario

router.get("/user-favorites", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (error) {
    next(error);
  }
});

// user-favorites/:offerId ... Agregar una oferta favorita

router.patch(
  "/user-favorites/:offerId",
  authenticate,
  async (req, res, next) => {
    const { offerId } = req.params;
    try {
      const user = await User.findById(req.user._id);
      if (!user.favorites.includes(offerId)) {
        user.favorites.push(offerId);
        await user.save();
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// user-favorites/:offerId ... Eliminar una oferta favorita

router.patch(
  "/user-favorites/:offerId",
  authenticate,
  async (req, res, next) => {
    const { offerId } = req.params;
    try {
      const user = await User.findById(req.user._id);
      user.favorites.pull(offerId);
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
