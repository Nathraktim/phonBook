const express =  require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.render('hello world');
});

app.listen(port);