const jwt = require('jsonwebtoken')
module.exports.authenToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization']
        //Beaer [token]
        const token = authorizationHeader.split(" ")[1]
        if (!token) res.status(401)
        jwt.verify(token, 'Submit123', (err, data) => {
            if (err) res.status(403)
            next()
        })
    } catch (error) {
        res.status(200).json({ loi: "Loi roi" })
    }
}