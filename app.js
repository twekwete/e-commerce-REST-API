const express = require("express");
const app = express();
const PORT = 4500;

app.get('/',(req,res) => {
    res.send("Hello world");
})

app.listen(PORT,() => {
    console.log("listening at PORT: ",PORT);
})