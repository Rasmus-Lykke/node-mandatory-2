const express = require("express");
const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
 
// parse application/json
app.use(express.json());

const fs = require("fs");

const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("./public/footer/footer.html", "utf8");
const frontPage = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");

app.get("/", (req, res) => {
    return res.send(navbarPage + frontPage + footerPage);
});


