const { ensureAuth } = require("../middleware/auth");
const Gang = require("../models/Gang");
const User = require("../models/User");
const { updateAllUser, updateAllGang, addName } = require("../script");

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
		console.log(req.body);
		const gang = req.body.gang;
		await User.findOneAndUpdate({ googleId: user.googleId }, { gang });
		updateGang(gang);
		res.status(200).send("ok");
	} catch (e) {
		console.log(e);
		res.status(500).send(e);
	}
});

router.get("/admin/reset-user", ensureAuth, updateAllUser);
router.get("/admin/reset-gang", ensureAuth, updateAllGang);
router.get("/admin/addName/:name", ensureAuth, addName);

module.exports = router;
