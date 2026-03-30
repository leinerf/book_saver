import express from "express"
import createBookAPI from "../../utils/bookApi.js";

export default function apiRoutes(db) {
    const bookAPI = createBookAPI();
    const router = express.Router();
    router.post("/users", async function(req, res) {
        try {
            const response = await db.addBookUsr(req.body.username);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when creating user" })
            }
            return res.status(200).json({ uid: response.uid })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when creating user" })
        }
    })
    router.get("/users/:uid", async(req, res) => {
        try {
            const uid = req.params.uid;
            const response = await db.getBookUsr(uid);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when trying to get user" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when trying to get user" })
        }
    })
    router.put("/users/:uid", async(req, res) => {
        try {
            const uid = parseInt(req.params.uid);
            const response = await db.updateBookUsr(uid, req.body.username);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when trying to update user" })
            }
            return res.status(200).json({ uid: response.uid })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when trying to update user" })
        }
    })
    router.delete("/users/:uid", async(req, res) => {
        try {
            const uid = parseInt(req.params.uid);
            const response = await db.deleteBookUsr(uid);

            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "internal issues when trying to delete" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "internal issues when trying to delete" })
        }
    })
    router.get("/books", async(req, res) => {
        try {
            const response = await db.getBooks()
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal error when getting books" })
            }
            return res.status(200).json({ books: response.books })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal error when getting books" })
        }
    })
    router.post("/books", async(req, res) => {
        try {
            const isbn = parseInt(req.body.isbn);
            let response = await db.getBookByISBN(parseInt(isbn));
            if (response.status === "ok") {
                return res.status(200).json({ msg: "book already in database" })
            }
            response = await bookAPI.getBookAndAuthor(isbn);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when adding book" })
            }
            const name = response.title
            const description = response.description ? response.description : null
            const author = response.author ? response.author : null
            response = await db.addBook(name, isbn, description, author)
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "internal issues occured when adding book" })
            }
            return res.status(200).json({ uid: response.uid })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when adding book" })
        }
    })
    router.get("/books/:uid", async(req, res) => {
        try {
            const uid = parseInt(req.params.uid);
            const response = await db.getBook(uid)
            if (response.status != "ok") {
                return res.status(500).json({...response })
            }
            return res.status(200).json({...response })
        } catch (err) {
            return res.status(500).json({...err })
        }
    })
    router.put("/books/:uid", async(req, res) => {
        try {
            const uid = parseInt(req.params.uid);
            const name = req.body.name;
            const isbn = parseInt(req.body.isbn);
            const description = req.body.description;
            const author = req.body.author;
            const response = await db.editBook(uid, { name, isbn, description, author });
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when updating book" });
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when updating book" });
        }
    })
    router.delete("/books/:uid", async(req, res) => {
        try {
            const uid = parseInt(req.params.uid);
            const response = await db.deleteBook(uid);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues when deleting book" });
            }
            return res.status(200).json({...response });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues when deleting book" });
        }
    })
    router.get("/reviews", async(req, res) => {
        try {
            const response = await db.getBookReviews();
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when grabbing reviews" });
            }
            return res.status(200).json({ reviews: response.bookReviews });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when grabbing reviews" })
        }
    })
    router.get("/users/:user_id/reviews", async(req, res) => {
        try {
            const user_id = parseInt(req.params.user_id);
            const response = await db.getUsrBookReviews(user_id);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when grabbing reviews for user" });
            }
            return res.status(200).json({ reviews: response.bookReviews })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "internal issues occured when grabbing reviews for user" })
        }
    })
    router.get("/users/:user_id/reviews/:book_id", async(req, res) => {
        try {
            const user_id = parseInt(req.params.user_id);
            const book_id = parseInt(req.params.book_id);
            const response = await db.getBookReview(user_id, book_id);
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when getting review" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when getting reviews" })
        }
    })
    router.post("/users/:user_id/reviews/:book_id", async(req, res) => {
        try {
            const user_id = parseInt(req.params.user_id);
            const book_id = parseInt(req.params.book_id);
            const response = await db.writeBookReview(user_id, book_id, {
                notes: req.body.notes,
                rating: req.body.rating,
                read_date: new Date(req.body.read_date)
            })
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when writing review" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when writing review" })
        }
    })
    router.put("/users/:user_id/reviews/:book_id", async(req, res) => {
        try {
            const user_id = parseInt(req.params.user_id);
            const book_id = parseInt(req.params.book_id);
            const response = await db.updateBookReview(user_id, book_id, {
                notes: req.body.notes,
                rating: req.body.rating,
                read_date: new Date(req.body.read_date)
            })
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when updating review" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when updating review" })
        }
    })
    router.delete("/users/:user_id/reviews/:book_id", async(req, res) => {
        try {
            const user_id = req.params.user_id;
            const book_id = req.params.book_id;
            const response = await db.deleteBookReview(user_id, book_id)
            if (response.status != "ok") {
                console.error(response)
                return res.status(500).json({ msg: "Internal issues occured when deleting user review" })
            }
            return res.status(200).json({...response })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ msg: "Internal issues occured when deleting user review" })
        }
    })

    return router;
}