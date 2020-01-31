const express = require('express');
const jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();
const user = require('../schemas/users.js');
const project = require('../schemas/list_projects.js');
const router = express.Router();

router.put('/update', (req, res) => {
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
				res.status(200).send("all changes saved")
			});
		})
	})
})

router.put('/create-new', (req, res) => {
	var token = req.headers['x-access-token'];
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).json({ auth: false, message: 'failed to authenticate token'}) 
		}
		user.findById(decoded.id, { password: 0 }, (err, data) => {
			if (err) return res.status(500).json({message: "there was a problem finding the user"});
			if (!data) return res.status(404).json({message: 'no user found'});
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

router.put('/delete-project', (req, res) => {
	var token = req.headers['x-access-token'];
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).json({ auth: false, message: 'failed to authenticate token'})
		}
		user.findById(decoded.id, { password: 0 }, (err, data) => {
			if (err) return res.status(500).json({message: "there was a problem finding the user"});
			if (!data) return res.status(404).json({message: 'no user found'});
			const projects = data.projects;
			const index = projects.findIndex(x => x._id.toString() === req.body.id);
			projects.splice(index, 1);
			data.projects = projects;
			data.markModified("projects");
			data.save((err, data) => {
				console.log({
					saveData: data.projects[index],
					projects: projects[index],
					index: index
				})
				res.status(200).json({userData: data})
			})
			console.log("deleted project at the " + index + " place")
		})
	})
})

module.exports = router;