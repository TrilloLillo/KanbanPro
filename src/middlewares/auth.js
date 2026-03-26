const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Token recibido:", req.cookies);
    const authCookie = req.cookies['jwt']; // Si usas cookies para almacenar el token
    const token = authHeader && authHeader.split(' ')[1] || authCookie;

    if (!token) {
        return res.status(403).json({ error: "No se proporcionó un token" });
    }

    try {
        const decoded = jwt.verify(token, 'TU_CLAVE_SECRETA_SUPER_SEGURA');
        req.usuarioId = decoded.id; // Guardamos el ID en el request para usarlo luego
        next(); // Continuar a la ruta solicitada
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = authenticateToken;