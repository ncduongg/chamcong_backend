const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3001
const path = require('path')
const bodyParser = require('body-parser')
const route = require('./routes/index')
const db = require('./config/db')
const cors = require('cors')
// cau hinh middelware de nhan du lieu tu body, axios, XML, neu khong chi nhan duoc tu query (body parser)
app.use(express.urlencoded({
  extended: true,
  // limit: 50
}))
// connect db
db.connect()
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

console.log(process.cwd());
//http loger 
app.use(morgan('combined'))
// handlebars views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'res/views'))
//route
route(app)
// listen
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})