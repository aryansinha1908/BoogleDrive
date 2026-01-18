const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    console.log("Cookies:", req.cookies);
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token)
            return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};
