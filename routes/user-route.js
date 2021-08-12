const { ensureAuth } = require("../middleware/auth");
const Gang = require("../models/Gang");
const User = require("../models/User");

const router = require("express").Router();

async function updateGang(gang) {
	await Gang.findOneAndUpdate(
		{ name: gang },
		{
			name: gang,
			$inc: {
				comrades: 1,
			},
		},
		{ upsert: true }
	);
}

router.patch("/set-gang", ensureAuth, async (req, res) => {
	try {
		const user = req.user;
		await User.findOneAndUpdate(
			{ googleId: user.googleId },
			{ gang: req.gang.strip().toLowerCase() }
		);
		res.status(200).send("ok");
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

module.exports = router;
