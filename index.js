var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongoDb = require('mongodb');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var path = require('path');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

var listener = app.listen(process.env.PORT || 8080, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')));
};

var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	email: String,
	password: String
})
var user = mongoose.model('list_user', userSchema);

app.post('/register', (req, res, next) => {
	console.log('started')
	user.findOne({name: req.body.name}, (err, data) => {
		console.log('searching for one')
		if (err) {
		}else if(data) {
			res.send('username and/or email taken')
		}else{
			return next();
		}
	})
}, (req, res) => {
		console.log('starting hash')
		console.log({body: req.body})
		var hashedPassword = bcrypt.hashSync(req.body.password, 8);
		var newUser = new user({
			name: req.body.name,
			password: hashedPassword,
			author: req.body.author
		})
		newUser.save((err, data) => {
			console.log({data: data})
			var token = jwt.sign({ id: data._id }, process.env.SECRET, {
				expiresIn: 86400
			});
			res.status(200).send({ auth: true, token: token});
		});
	});

app.get('/me', (req, res, next) => {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ auth: false, message: 'no token provided'});

	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).send({ auth: false, message: 'failed to authenticate token'})
		}
		user.findById(decoded.id, { password: 0}, (err, data) => {
			if (err) return res.status(500).send("there was a problem finding the user");
			if (!data) return res.status(404).send('no user found');
			res.status(200).send(data);
		})
	});
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})