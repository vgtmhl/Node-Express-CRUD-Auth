const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async (req, res) => {
    /**
     * Memo for FE => On client: also delete the access token
     */
    const cookies = req.cookies

    if (!cookies?.jwt) { return res.sendStatus(204) }

    const refreshToken = cookies.jwt

    // is refresh token in the db?
    const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)

    if (!foundUser) {
        // we found the cookie but it's not linked to any user. We can just clear it
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }

    // delete refresh token in the database
    const otherUsers = usersDB.users.filter(user => user.refreshToken !== foundUser.refreshToken)
    const currentUser = { ...foundUser, refreshToken: "" }
    usersDB.setUsers([...otherUsers, currentUser])

    await fsPromises.writeFile(path.join(__dirname, "..", "models", "users.json"), JSON.stringify(usersDB.users))

    /**
     * NB normally we would also send the `secure` flag to true, to only serve on https. 
     * We are not doing it now because of local development on http 
     */
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204) //All is well, but we have no content to send
}

module.exports = { handleLogout }