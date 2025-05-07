
import jwt from "jsonwebtoken";

export const Token = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;


    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token, please add token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.KEY);
            req.user = decoded;
            console.log("The decoded user is", req.user);
            next();
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Token is not valid" });
        }
    } else {
        return res.status(400).json({ message: "not valid" });
    }
};
