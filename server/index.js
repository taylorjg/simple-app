const path = require('path')
const express = require('express')

const port = process.env.PORT || 3001
const publicFolder = path.join(__dirname, 'public')

const app = express()
app.use('/', express.static(publicFolder))

app.listen(port, () => console.log(`Listening on port ${port}`))
