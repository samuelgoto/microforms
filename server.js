const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World, foo bar!'))

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

