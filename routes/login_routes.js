var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const user = require('../schemas/users.js');
const router = express.Router();


router.post('/register', (req, res, next) => {
	console.log('started')
	user.findOne({name: req.body.name}, (err, data) => {
		console.log('searching for one')
		if (err) {
			res.json({message: 'something went wrong with the server'})
		}else if(data) {
			res.json({message: 'username and/or email taken'})
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

router.get('/signIn', (req, res, next) => {
	console.log({
		name: req.query.name,
		password: req.query.password
	})
	user.findOne({name: req.query.name}, (err, data) => {
		console.log(data);
		if (err) return res.status(500).json({message: "there was a problem finding the user"});
		if (!data) return res.status(404).json({message: "no user found"});
		if (!RegExp(/(?=.*\d)(?=.*\w)(?=.*\W)/).test(req.query.password))  return res.status(500).json({message: "password did not meet validation"})
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

router.get('/me', (req, res, next) => {
	var token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ auth: false, message: 'no token provided'});

	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).json({ auth: false, message: 'failed to authenticate token'})
		}
		user.findById(decoded.id, { password: 0}, (err, data) => {
			if (err) return res.status(500).json({message: "there was a problem finding the user"});
			if (!data) return res.status(404).json({message: 'no user found'});
			console.log('found a user');
			res.status(200).json(data);
		})
	});
});

module.exports = router;