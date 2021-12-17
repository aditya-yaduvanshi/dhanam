const router = require("express").Router();
const {Account} = require("../models"),
  {sendMail} = require("../utils");

router
  .route("/auth")
  .post(async (req, res, _next) => {
    try {
      let data = req.body;

      if (data.password != data.password2)
        throw {status: 400, msg: "Invalid password!"};

      if (await Account.findOne({email: data.email}))
        throw {status: 400, msg: "Account already exists!"};

      let user = await Account.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!user) throw {status: 500, msg: "Something went wrong!"};

      sendMail({to: data.email, name: data.name});

      return res.status(201).json({ok: 1, msg: "Account created!"});
    } catch (err) {
      return res.status(err.status ? err.status : 500).json({ok: 0, msg: err.msg ? err.msg : "Something went wrong!"});
    }
  });

module.exports = router;
