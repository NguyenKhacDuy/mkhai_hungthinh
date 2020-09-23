const app = require('./app')
const port = process.env.PORT || 3000
const db = require('./Models')

console.log(process.env)
db.sequelize.sync()
    .then(async () => {
        app.listen(port, () => console.log(`Server running on port ${port}!`))
    })
    .catch(err => console.log("Sync database error: ", err))