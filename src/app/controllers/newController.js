class NewController {
    // [GET] /news
    main(req, res) {
        res.send('Duong')
        // res.render("layouts/search.ejs")
    }
    // [GET] /news/:slug
    show(req, res) {
        res.send("Hello9")
    }
}
module.exports = new NewController;