export const rolRequerido = (roles = []) => {
    if (typeof roles === "string") roles = [roles];

    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) return res.status(401).json({ message: "No autorizado" });

            if (!roles.includes(user.rol)){
                return res.status(403).json({ message: "Acceso denegado" });
            }
            next();
        } catch(error){
            next(error);
        }
    };
};