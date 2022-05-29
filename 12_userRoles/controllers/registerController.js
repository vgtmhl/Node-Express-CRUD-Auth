const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) { return res.status(400).json({ 'message': 'Username and password are both required' }) }

    // check for duplicate users in the "database"
    const duplicate = usersDB.users.find(u => u.username === user)
    if (duplicate) { return res.sendStatus(409) }

    try {
        // encrypt the password
        const hashedPw = await bcrypt.hash(pwd, 10);

        // store the user in the database
        const newUser = {
            "username": user,
            "password": hashedPw
        }
        usersDB.setUsers([...usersDB.users, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(usersDB.users)
        )

        console.log(usersDB.users)
        res.status(201).json({ 'success': `new user ${user} created successfully` })

    } catch (e) { return res.status(500).json({ 'message': e.message }) }

}

module.exports = {
    handleNewUser
}