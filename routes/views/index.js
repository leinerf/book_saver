import express from "express"
import axios from "axios"

export default function viewRoutes() {
    const router = express.Router();
    const api = axios.create({ baseURL: process.env.BASE_API || "http://localhost:3000/api" })
    router.get("/books", (req, res) => {;
    })
    router.get(
        "/users/:uid/reviews",
        async(req, res) => {
            const response = await api.get(`/users/${req.params.uid}/reviews`);
            console.log(response.data);
            return res.render("reviews.ejs");
        }
    )

    return router;
}