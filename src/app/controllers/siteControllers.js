class siteControllers {
    // [GET] /home next là func khi loi
    index(req, res, next) {
        //callback
        // User.find({}, function (err, user) {
        //     if (!err) res.json(user)
        //     else {
        //         nexy(err)
        //     }
        // })
        //promise
       // User.find({}).then(user => res.json(user)).catch(err => next(err))
       res.send("okkkk")
    }
    // [GET] /search
    search(req, res) {
        res.send("Tim Kiem")
    }
}
module.exports = new siteControllers;