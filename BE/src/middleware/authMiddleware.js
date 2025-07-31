const jwt = require("jsonwebtoken");

// Xác thực JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET || "your-secret", (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user; // user: { id, username, role, ... }
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Phân quyền theo role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
        }
        next();
    };
};
function allowManagerOrAdmin(req, res, next) {
    if (req.user && (req.user.role === "Manager" || req.user.role === "Admin")) {
        return next();
    }
    return res.status(403).json({ message: "Forbidden" });
}
module.exports = { authenticateJWT, authorizeRoles, allowManagerOrAdmin };
