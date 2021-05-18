const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    passwordHashed: {
        type: String,
        required: true,
    },
})

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.passwordHashed);
    return isValid ? foundUser : false;
}

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.passwordHashed = await bcrypt.hash(this.passwordHashed, 12);
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User;