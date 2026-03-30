import axios from "axios";

class BookApi {
    constructor() {
        this.bookApi = axios.create({
            baseURL: "https://openlibrary.org/isbn"
        });
        this.authorApi = axios.create({
            baseURL: "https://openlibrary.org/authors"
        });
    }
    async getBookInfo(isbn) {
        try {
            const response = await this.bookApi.get("/" + isbn + ".json");
            return { status: "ok", ...response.data }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBookAuthor(authorKey) {
        try {
            const response = await this.authorApi.get("/" + authorKey + ".json")
            return { status: "ok", ...response.data }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    getBookImgURL(isbn) {
        return "https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg"
    }
    async getBookAndAuthor(isbn) {
        try {
            const bookInfo = await this.getBookInfo(isbn);
            const authorKey = this._getBookAuthorKey(bookInfo);
            const bookAuthor = authorKey != "" ? await this.getBookAuthor(authorKey) : "";
            const bookImg = this.getBookImgURL(isbn);

            return {
                status: "ok",
                title: bookInfo.title,
                isbn: isbn,
                description: bookInfo.description ? bookInfo.description.value : "",
                author: bookAuthor != "" ? bookAuthor.fuller_name : "",
                bookImg
            }
        } catch (err) {
            return { status: "error", ...err }
        }

    }
    _getBookAuthorKey(bookInfo) {
        try {
            if (bookInfo.authors === undefined) {
                return "";
            }
            return bookInfo.authors[0].key.split("/")[2];
        } catch (err) {
            console.log(err);
            return "";
        }
    }
}

export default function createBookAPI() {
    return new BookApi();
}