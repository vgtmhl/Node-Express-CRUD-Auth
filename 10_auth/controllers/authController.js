const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) { return res.status(400).json({ 'message': 'Username and password are both required' }) }

    const foundUser = usersDB.users.find(u => u.username === user)

    if (!foundUser) { return res.sendStatus(401) }

    // user found, evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if (match) {
        /**
         * This is where we would normally create JWTs
         */
        res.json({ 'message': `User ${user} is logged in` })
    } else {
        res.sendStatus(400)
    }
}

module.exports = { handleLogin }