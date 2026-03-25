import { Pool } from "pg";

class BookDB {
    constructor() {
        this.pool = new Pool({
            user: "postgres",
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
            return { status: "ok", ...response.rows[0] };
        } catch (err) {
            return { status: "error", ...err };
        }
    }
    async addBookUsr(username) {
        try {
            const response = await this.writeQuery("insert into Users (username) values ($1) returning uid", username);
            return { status: "ok", uid: response.rows[0].uid };
        } catch (err) {
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
            const response = await this.writeQuery("delete from Users where id=$1 returning uid", [uid])
            return { status: "ok", uid: response.rows[0].uid }
        } catch (err) {
            return { status: "error", ...err }
        }
    }
    async getBookReviews() {}
}