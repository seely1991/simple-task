var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongoDb = require('mongodb');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var path = require('path');

//password authentication is working without correct passwords

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
	password: String,
	projects: [],
	profileColor: String
})
var user = mongoose.model('list_user', userSchema);

var projectSchema = new Schema({
	title: String,
	lists: [],
	updated: String
})
var project = mongoose.model('list_project', projectSchema);

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
			email: req.body.email,
			projects: [],
			profileColor: req.body.profileColor
		})
		newUser.save((err, data) => {
			console.log({data: data})
			var token = jwt.sign({ id: data._id }, process.env.SECRET, {
				expiresIn: 86400
			});
			userData = {
				name: data.name,
				email: data.email,
				projects: data.projects,
				profileColor: data.profileColor
			}
			res.status(200).json({ auth: true, token: token, userData: userData});
		});
	});

app.get('/signIn', (req, res, next) => {
	console.log({
		name: req.query.name,
		password: req.query.password
	})
	user.findOne({name: req.query.name}, (err, data) => {
		console.log(data);
		if (err) return res.status(500).json({message: "there was a problem finding the user"});
		if (!data) return res.status(404).json({message: "no user found"});
		var isPassword = bcrypt.compareSync(req.query.password, data.password);
		console.log({isPassword: isPassword});
		var token = jwt.sign({ id: data._id }, process.env.SECRET, {
			expiresIn: 86400
		});
		var userData = {
			name: data.name,
			email: data.email,
			projects: data.projects,
			profileColor: data.profileColor
		}
		if (isPassword) {
			res.status(200).json({ auth: true, token: token, userData: userData });
		}else{
			res.status(404).json({message: "password did not match username"});
		}
		//check that {password: 0} makes it not show up
	})
})

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

app.put('/update', (req, res) => {
	var token = req.headers['x-access-token'];
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).send({ auth: false, message: 'failed to authenticate token'})
		}
		user.findById(decoded.id, { password: 0 }, (err, data) => {
			if (err) return res.status(500).send("there was a problem finding the user");
			if (!data) return res.status(404).send("no user found");
			let projectIndex = data.projects.findIndex(x => x._id.toString() === req.body.listId);
			let newProject = {
				title: req.body.title,
				lists: req.body.lists,
				updated: req.body.updated,
				_id: data.projects[projectIndex]._id
			}
			data.projects[projectIndex] = newProject;
			data.markModified("projects");
			data.save((err, data) => {
				console.log("saved")
				res.status(200).send("saved")
			});
		})
	})
	//finish this for saving
	//user.findOne({req.query.name})
})

app.put('/create-new', (req, res) => {
	var token = req.headers['x-access-token'];
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).send({ auth: false, message: 'failed to authenticate token'}) 
		}
		user.findById(decoded.id, { password: 0 }, (err, data) => {
			if (err) return res.status(500).send("there was a problem finding the user");
			if (!data) return res.status(404).send('no user found');
			let updated = new Date(Date.now());
			updated = updated.toISOString();
			newProject = new project({
				title: 'untitled',
				lists: [],
				updated: updated
			});
			console.log(newProject);
			data.projects.push(newProject);
			data.save((err, data) => {
				console.log(data)
				res.status(200).json({ auth: true, token: token, userData: data, listId: newProject._id })
			});
		})
	})
})


app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})