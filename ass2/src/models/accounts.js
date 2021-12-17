require("dotenv");
const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  {SALT_ROUNDS} = process.env;

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
});

AccountSchema.pre("validate", async function (next) {
  let mail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!mail.test(String(this.email)))
    throw {status: 400, msg: "Invalid email!"};

  let pass =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,64}$/;

  if (!pass.test(String(this.password)))
    throw {status: 400, msg: "Invalid password!"};

  next();
});

AccountSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, Number(SALT_ROUNDS));
    next();
  } catch (err) {
    console.log(err)
    return {
      status: 500,
      msg: "Something went wrong!",
    };
  }
});

const Account = mongoose.model("accounts", AccountSchema);

module.exports = Account;
