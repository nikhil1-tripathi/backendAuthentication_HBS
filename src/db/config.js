const mongoose = require("mongoose");

module.exports = mongoose
  .connect("mongodb+srv://nikhil:nikhil@cluster0.u6lsh.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("our database is working");
  })
  .catch((e) => {
    console.log(e);
  });
