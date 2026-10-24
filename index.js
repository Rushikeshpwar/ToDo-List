import express from "express";
import path from "path";

const app = express();
const publicPath = path.resolve('public');  // Serve static files from the "public" directory
app.use(express.static(publicPath));        // Serve static files from the "public" directory

app.set("view engine", "ejs"); // Set EJS as the view engine

app.get('/', (req, res) => {
    res.render("list");
})
app.get('/add', (req, res) => {
    res.render("add");
})
app.get('/update', (req, res) => {
    res.render("update");
})

app.post('/add', (req, res) => {
    res.redirect("/");
})
app.post('/update', (req, res) => {
    res.redirect("/");
})



app.listen(3200, () => {
    console.log("Server is running on port 3200");
})

