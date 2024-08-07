const jwt = require("jsonwebtoken");
const User = require("../models/User.model"); 
const Business = require("../models/Business.model"); 

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado Authorization
  if (!token) {
    return res.status(401).json({ errorMessage: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let user = await User.findById(decoded._id);
    if (!user) {
      user = await Business.findById(decoded._id);
    }
    if (!user) {
      return res.status(401).json({ errorMessage: "Invalid token" });
    }
    req.user = {
      _id: user._id,
      email: user.email,
      userType: user.userType, 
    };
    next(); // Continuar a la siguiente función de middleware o ruta
  } catch (error) {
    return res.status(401).json({ errorMessage: "Invalid token" });
  }
};
module.exports = authenticate;
