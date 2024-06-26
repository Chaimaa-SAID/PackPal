const express = require('express');
const app = express();
app.use(express.json());

const errorHandler = require('./middleware/errorHandler');

require("dotenv").config();

const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');
const customerRouter = require('./routes/customerRouter');
const OrderRouter = require('./routes/orderRouter');
const userRouter = require('./routes/userRouter');
const loginRouter = require("./routes/loginRouter");
const statisticRouter = require("./routes/statisticRouter");

require("./Config/db");

const cors = require("cors");
app.use(cors());

app.use('/categories', categoryRouter)

app.use("/orders", OrderRouter);

app.use('/products', productRouter);

app.use('/login', loginRouter);

app.use('/users', userRouter);

app.use('/customers', customerRouter);

app.use("/statistics", statisticRouter);

app.all("*", (req, res) => {
  res.send("Page not found");
});

app.use(errorHandler);

app.listen(process.env.PORT , () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`))

module.exports = app;

