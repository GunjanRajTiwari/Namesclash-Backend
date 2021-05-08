const mongoose = require("mongoose");

const GangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    comrades: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Gang", GangSchema);
