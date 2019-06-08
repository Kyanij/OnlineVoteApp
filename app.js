const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// DB Config
require('./config/db');

const app = express();

const poll = require('./routes/poll')

// Set public folder
app.use(express.static(path.join(__dirname,'public')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({useNewUrlParser:true}));

// Enable CORS
app.use(cors());

app.use('/poll', poll)

const port = process.env.PORT || 3000;
// Start server
app.listen(port, () => console.log(`Server running at ${port}`));

