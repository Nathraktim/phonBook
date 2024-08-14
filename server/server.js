const express =  require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./routes/user-router.js');
const contactRouter = require('./routes/contact-router.js');
const { imgRouter } = require('./routes/img-router.js');
app.use(express.json());

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