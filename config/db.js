const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        console.log(`Connected to Mongo!`);
    } catch (err) {
        console.error("Error connecting to mongo", err);
        process.exit(1);
    }
};

module.exports = connectDB;
