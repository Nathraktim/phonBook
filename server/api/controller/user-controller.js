// User-controller.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userFilePath = path.join(__dirname, '../data/users.json');

const readUsersFromFile = () => {
    if (fs.existsSync(userFilePath)) {
        const data = fs.readFileSync(userFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const writeUsersToFile = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Validation
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    const { error } = userSchema.validate({ username, password });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let users = readUsersFromFile();
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'Username is already taken' });
    }
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const nextUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = {
        id: nextUserId,
        username,
        password: encryptedPassword
    };
    users.push(newUser);
    writeUsersToFile(users);
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1y'
    });
    res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        token
    });
};


// @desc    User login
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validation
    const { error } = userSchema.validate({ username, password });
    if (error) {
        res.status(401);
        return res.json({ message: error.details[0].message });
    }
    const users = readUsersFromFile();
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1y'
    });

    res.json({
        id: user.id,
        username: user.username,
        token
    });
};

module.exports = {
    registerUser,
    loginUser
};