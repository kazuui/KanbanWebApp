const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const mysql = require("mysql2");
const cors = require("cors");
// require('dotenv/config');
// const db = require('./config/db.js');

app.use(cors({ credentials:true, origin:'http://localhost:5000' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/AuthRoutes.js');
const userRoutes = require('./routes/UserRoutes.js');
const groupRoutes = require('./routes/GroupRoutes.js');
const appRoutes = require('./routes/ApplicationRoutes.js');
const taskRoutes = require('./routes/TaskRoutes.js');
const planRoutes = require('./routes/PlanRoutes.js');
const apiRoutes = require('./routes/ApiRoutes')

//Routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', groupRoutes);
app.use('/', appRoutes);
app.use('/', taskRoutes);
app.use('/', planRoutes);
app.use('/', apiRoutes);


app.get('/', (req,res) => {
  res
  .status(200)
  .json({message: 'Hello from the server side!', app: 'Kanban'});
});

// app.post('/', (req,res) => {
//   res.send('You can post to this URL');
// });

const PORT = process.env.PORT || 5000; //Backend routing port
app.listen(PORT , () => {
  console.log(`Server is running on ${PORT}.`)
});