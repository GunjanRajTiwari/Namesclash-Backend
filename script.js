const Gang = require("./models/Gang");
const User = require("./models/User");
const admin = "102926832884649579291";

async function updateAllUser(req, res) {
	if (req.user.googleId !== admin) {
		return res
			.status(403)
			.send(
				"<h2 style='color:red'>You are Forbidden to access this page.</h2>"
			);
	}
	try {
		await User.updateMany({}, { gang: "newbie" }, function (err, docs) {
			if (err) {
				console.log(err);
			} else {
				console.log("Updated: ", docs);
			}
		});
		res.send("<h1 style='color:green'>Success</h1>");
	} catch (e) {
		res.status(500).send("Something went wrong!");
	}
}

// async function updateAllGang(req, res) {
// 	if (req.user.googleId !== admin) {
// 		return res
// 			.status(403)
// 			.send(
// 				"<h2 style='color:red'>You are Forbidden to access this page.</h2>"
// 			);
// 	}
// 	try {
// 		await Gang.updateMany({}, { comrades: 0 }, function (err, docs) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("Updated: ", docs);
// 			}
// 		});
// 		res.send("<h1 style='color:green'>Success</h1>");
// 	} catch (e) {
// 		res.status(500).send("Something went wrong!");
// 	}
// }

async function updateAllGang(req, res) {
	if (req.user.googleId !== admin) {
		return res
			.status(403)
			.send(
				"<h2 style='color:red'>You are Forbidden to access this page.</h2>"
			);
	}
	try {
		const allGang = await Gang.find({});
		allGang.forEach(async gang => {
			await Gang.updateOne(
				{ name: gang.name },
				{ name: gang.name.charAt(0).toUpperCase() + gang.name.slice(1) }
			);
		});

		res.send("<h1 style='color:green'>Success</h1>");
	} catch (e) {
		res.status(500).send("Something went wrong!");
	}
}

module.exports = { updateAllUser, updateAllGang };
