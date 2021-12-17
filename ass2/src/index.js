require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose"),
  {accounts} = require("./apis"),
  {PORT, HOST, MONGO_URI} = process.env,
  app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/api/accounts", accounts);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT || 5000, HOST, () =>
      console.log("server running on:", PORT || 5000)
    );
    console.log("database connected");
  })
  .catch((err) => console.log(err));
