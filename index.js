import express from "express";
import bodyParser from "body-parser";
import createBookDB from "./utils/bookDB.js";
import apiRoutes from "./routes/api/index.js";
import viewRoutes from "./routes/views/index.js"

const app = express();
const db = createBookDB();

app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extends: true }))

app.use("/api", apiRoutes(db));
app.use("/", viewRoutes())
app.listen(3000, (req, res) => {
    console.log("listening on port http://localhost:3000")
})