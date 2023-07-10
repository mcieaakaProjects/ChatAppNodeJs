const express = require('express');

app = express();

app.get("/", (req, res) => {
    res.send("Hey There");
});

app.listen(3000, () => {
    console.log("Listening on 3000");
});