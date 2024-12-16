const verificarCodigoAdmin = (req, res, next) => {
    const codigoAdmin = req.headers['x-admin-code'];
    
    if (!codigoAdmin || codigoAdmin !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ 
            mensaje: 'No autorizado para registrar usuarios' 
        });
    }
    
    next();
};

export default verificarCodigoAdmin;
