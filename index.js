const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoDb = require('mongodb');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const loginRoutes = require('./routes/login_routes.js');
const appRoutes = require('./routes/app_routes.js');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,  useUnifiedTopology: true  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', loginRoutes);
app.use('/', appRoutes);

const listener = app.listen(process.env.PORT || 8080, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
};

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})