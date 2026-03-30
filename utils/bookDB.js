import { Pool } from "pg";

class BookDB {
    constructor() {
        this.pool = new Pool({
            user: process.env.DATABASE_USER || "postgres",
            password: process.env.DATABASE_PASSWORD || "password",
            host: process.env.DATABASE_HOST || "localhost",
            port: process.env.DATABASE_PORT || 5334,
            database: process.env.DATABASE || "postgres",
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            maxLifetimeSeconds: 60,
        })
    }
    writeQuery(text, params) {
        return this.pool.query(text, params);
    }
    async getBookUsr(uid) {
        try {
            const response = await this.writeQuery("select * from Users where uid = $1", [uid])
            if (response.rows.length === 0) {
                return { status: "ok", uid: -1 }
            }
            return { status: "ok", ...response.rows[0] };
        } catch (err) {
            return { status: "error", ...err };
        }
    }
    async addBookUsr(username) {
        try {
            const response = await this.writeQuery("insert into users (username) values ($1) returning uid", [username]);
            return { status: "ok", uid: response.rows[0].uid };
        } catch (err) {
            console.error(err);
            return { status: "error", ...err }
        }
    }
    async updateBookUsr(uid, username) {
        try {
            const response = await this.writeQuery("update Users set username = $1 where uid = $2 returning uid", [username, uid])
            return { status: "ok", uid: response.rows[0].uid }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async deleteBookUsr(uid) {
        try {
            const response = await this.writeQuery("delete from Users where uid=$1 returning uid", [uid])
            return { status: "ok", uid: response.rows[0].uid }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBooks() {
        try {
            const response = await this.writeQuery("select * from Books", [])
            return { status: "ok", books: response.rows }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBook(uid) {
        try {
            const response = await this.writeQuery("select * from Books where uid = $1", [uid])
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBookByISBN(isbn) {
        try {
            const response = await this.writeQuery("seect * from Books where isbn = $1", [isbn])
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async addBook(name, isbn, description, author) {
        try {
            const response = await this.writeQuery(
                "Insert into Books (name, isbn, description, author) values ($1, $2, $3, $4) returning uid", [name, isbn, description, author]
            )
            if (response.rows === 0) {
                return { status: "ok", uid: -1, msg: "check if the isbn is unique" }
            }
            return { status: "ok", uid: response.rows[0].uid }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async editBook(uid, details) {
        try {
            let conditions = ""
            if (details.name) {
                conditions += "name = \'" + details.name + "\',"
            }
            if (details.isbn) {
                conditions += "isbn = " + details.isbn + ","
            }
            if (details.description) {
                conditions += "description = \'" + details.description + "\',"
            }
            if (details.author) {
                conditions += "author = \'" + details.author + "\',"
            }
            conditions = conditions.substring(0, conditions.length - 1);
            const response = await this.writeQuery(
                `update Books set ${conditions} where uid = $1 returning uid`, [uid]
            )
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async deleteBook(uid) {
        try {
            const response = await this.writeQuery("delete from Books where uid=$1 returning uid", [uid])
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBookReviews() {
        try {
            const response = await this.writeQuery("select * from Book_Notes");
            return { status: "ok", bookReviews: response.rows }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getUsrBookReviews(user_id) {
        try {
            const response = await this.writeQuery("select * from Book_Notes where user_id = $1", [user_id])
            return { status: "ok", bookReviews: response.rows }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBookReview(user_id, book_id) {
        try {
            const response = await this.writeQuery(
                `select * from Book_Notes where user_id = $1 and book_id = $2`, [user_id, book_id]
            )
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async writeBookReview(user_id, book_id, review) {
        try {
            const response = await this.writeQuery(
                `insert into Book_Notes (user_id, book_id, notes, rating, read_date)
                values ($1, $2, $3, $4, $5) returning user_id, book_id
                `, [user_id, book_id, review.notes || "", review.rating || null, this._formatDate(review.read_date) || null]
            );
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async updateBookReview(user_id, book_id, review) {
        try {
            let conditions = ""
            if (review.notes) {
                conditions += "notes = \'" + review.notes + "\',"
            }
            if (review.rating) {
                conditions += "rating = " + review.rating + ","
            }
            if (review.read_date) {
                conditions += "read_date = \'" + this._formatDate(review.read_date) + "\' ,"
            }
            conditions = conditions.substring(0, conditions.length - 1);
            const response = await this.writeQuery(
                `update Book_Notes set ${conditions} where user_id=$1 and book_id=$2 returning user_id, book_id`, [user_id, book_id]
            )
            return { status: "ok", ...response.rows[0] }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async deleteBookReview(user_id, book_id) {
        try {
            const respsnse = await this.writeQuery(
                "delete from Book_Notes where user_id = $1 and book_id = $2", [user_id, book_id]
            )
            return { status: "ok" }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    _formatDate(date) {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
    closeDB() {
        this.pool.end();
    }
}

export default function createBookDB() {
    return new BookDB();
}