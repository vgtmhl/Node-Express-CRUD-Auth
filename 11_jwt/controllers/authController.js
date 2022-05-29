const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

/**
 * Deps for JWT
 */
const jwt = require('jsonwebtoken');
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) { return res.status(400).json({ 'message': 'Username and password are both required' }) }

    const foundUser = usersDB.users.find(u => u.username === user)

    if (!foundUser) { return res.sendStatus(401) }

    const match = await bcrypt.compare(pwd, foundUser.password)

    if (match) {
        /**
         * JWT (access and refresh tokens)
         */
        const accessToken = jwt.sign(
            { username: foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        /**
         * Save refresh token in the db with current user.
         */
        const otherUsers = usersDB.users.filter(u => u.username !== foundUser.username)
        const currentUser = { ...foundUser, refreshToken }
        usersDB.setUsers([...otherUsers, currentUser])

        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(usersDB.users)
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: 'true',
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({ accessToken })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { handleLogin }