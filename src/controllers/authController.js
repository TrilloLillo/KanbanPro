const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

// Registro de Usuario
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const nuevoUsuario = await Usuario.create({
      name,
      email,
      password: password,
    });
    
    res.redirect("/login");

    res.status(201).json({
      mensaje: "Usuario creado con éxito",
      usuarioId: nuevoUsuario.id,
    });


  } catch (error) {
    console.log("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Login de Usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Crear el Token (Válido por 24h)
    const token = jwt.sign(
      { id: usuario.id },
      "TU_CLAVE_SECRETA_SUPER_SEGURA",
      {
        expiresIn: "24h",
      },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      // secure: true // sólo funciona cuando nuestro server está sobre HTTPS
      sameSite: "strict",
    });
    res.redirect("/dashboard");
    //res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    console.log("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
