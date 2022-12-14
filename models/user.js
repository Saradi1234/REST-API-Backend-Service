const mongoose = require("mongoose");

const schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const userschema = new schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, unique: true, required: true }
});

const User = mongoose.model("User", userschema);

module.exports = User