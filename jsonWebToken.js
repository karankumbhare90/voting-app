const jwt = require('jsonwebtoken')

const jwtAuthMiddleWare = (req, res, next) => {
    // Chech the user has the authorization or not
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: "Token Not Found" });

    // If User has token
    // Extract the jwt token from request headers
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorize" });

    try {
        //  Verify the Token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to the request object
        req.user = decode;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid Token' });
    }
}

// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 30000 })
}

module.exports = { jwtAuthMiddleWare, generateToken }