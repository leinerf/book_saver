import createBookAPI from "../utils/bookApi.js"

export default async function bookAPITests() {
    const bookAPI = createBookAPI();
    const bookInfo = await bookAPI.getBookInfo(9780590353403);
    console.log(bookInfo);
    const authorKey = bookAPI._getBookAuthorKey(bookInfo);
    console.log(authorKey);
    const bookAuthor = await bookAPI.getBookAuthor(authorKey);
    console.log(bookAuthor);
    const bookImg = await bookAPI.getBookImgURL(9780590353403);
    console.log(bookImg);
    const bookAndAuthor = await bookAPI.getBookAndAuthor(9780590353403);
    console.log(bookAndAuthor);
}