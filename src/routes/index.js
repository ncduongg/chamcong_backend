const newsRouter = require('./news')
const siteRouter = require('./site')
const apiRouter = require('./api')
const apiAdminRouter = require('./apiAdmin')
const apiUserLogin = require('./userLogin')
const route = (app) => {
    app.use('/apiUser', apiUserLogin)
    app.use('/api', apiRouter)
    app.use('/apiAdmin', apiAdminRouter)
    app.use('/', siteRouter)
}
module.exports = route