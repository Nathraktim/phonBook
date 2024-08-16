const express =  require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./api/routes/user-router.js');
const contactRouter = require('./api/routes/contact-router.js');
const { imgRouter } = require('./api/routes/img-router.js');
app.use(express.json());
const cors = require('cors');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send("Server is Up and running");
});
app.get('/:extra', (req, res) => {
    res.send("Server is Up and running");
});

app.use('/api/auth', userRouter);
app.use('/api/contact', contactRouter);
app.use('/api/images', imgRouter);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is up and running on port ${process.env.PORT || 3001}`);
  });

module.exports = app;