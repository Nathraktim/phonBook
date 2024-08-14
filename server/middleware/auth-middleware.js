const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization) {
        try {
            token = req.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const users = JSON.parse(
                fs.readFileSync(path.join(__dirname, '../../server/data/users.json'), 'utf-8')
            );
            const user = users.find(user => user.id === decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'user not found' });
            }
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed heee' });
        }
    } else {
        res.status(401).json({ message: 'no token' });
    }
};

module.exports = protect;
