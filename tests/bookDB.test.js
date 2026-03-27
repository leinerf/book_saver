import createBookDB from "../utils/bookDB.js";

async function bookDBTests() {
    const bookDB = createBookDB();
    let response = undefined;

    console.log("BookUsrFunctionsTests")
    response = await bookDB.addBookUsr("John Doe");
    let userUID = null;
    if (response.status === "error") {
        console.log(response)
    } else {
        console.assert(response.uid != undefined, "addBookUsr Failed to add user");
        userUID = response.uid;
    }

    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok", "status code was not ok getBookUsr")
    console.assert(response.uid != undefined, "could not get userUID")

    response = await bookDB.updateBookUsr(userUID, "Jane Doe");
    console.assert(response.status === "ok", "status code was not ok for updateBookUsr")
    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok", "status for getBookUsr was not ok")
    console.assert(response.username === "Jane Doe", "getBookUsr: username was not the same as Jane Doe")
    console.assert(response.username != "John Doe", "getBookUsr: username was John Doe")

    response = await bookDB.deleteBookUsr(userUID);
    console.assert(response.status === "ok", "deleteBookUsr: status was not ok")

    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok", "getBookUsr: status was not ok")

    console.log("BookFunctionsTests")
    const dummyBooks = [{
        name: "book1",
        isbn: 1111111111111,
        description: "lorem ipsum 1",
        author: "John Doe1"
    }, {
        name: "book2",
        isbn: 2222222222222,
        description: "lorem ipsum 2",
        author: "John Doe2"
    }, {
        name: "book3",
        isbn: 3333333333333,
        description: "lorem ipsum 3",
        author: "John Doe3"
    }];
    for (let i = 0; i < dummyBooks.length; i++) {
        const dummyBook = dummyBooks[i];
        const { name, isbn, description, author } = dummyBook;
        response = await bookDB.addBook(name, isbn, description, author);
        dummyBook.uid = response.uid;
        console.assert(response.status === "ok", "addBook: failed to add book with isbn " + isbn);
        console.assert(response.uid != undefined, "addBook: uid was undefined");
    }

    for (let i = 0; i < dummyBooks.length; i++) {
        const dummyBook = dummyBooks[i];
        const { name, isbn, description, author, uid } = dummyBook;
        response = await bookDB.getBook(uid);
        console.assert(response.status === "ok", "getBook: status was not ok")
        console.assert(response.uid === uid, "getBook: faild to get book with uid: " + uid)
    }

    response = await bookDB.getBooks();
    const grabbedBooks = response.books;
    dummyBooks.sort((a, b) => {
        if (a.uid < b.uid) {
            return -1
        } else if (a.uid > b.uid) {
            return 1
        }
        return 0;
    })
    grabbedBooks.sort((a, b) => {
        if (a.uid < b.uid) {
            return -1
        } else if (a.uid > b.uid) {
            return 1
        }
        return 0;
    })
    for (let i = 0; i < dummyBooks.length; i++) {
        console.assert(grabbedBooks[i].uid === dummyBooks[i].uid, "getBooks: failed to get matching books(uid)")
    }
    let book = dummyBooks[0];
    response = await bookDB.editBook(book.uid, { name: "updated book" })
    console.assert(response.status === "ok", "editBook: status code was not ok")
    response = await bookDB.getBook(book.uid)
    console.assert(response.name === "updated book", "editBook: book name was not updated")

    for (let i = 0; i < grabbedBooks.length; i++) {
        response = await bookDB.deleteBook(grabbedBooks[i].uid);
        console.assert(response.status === "ok", "deleteBook: status was not ok for uid: " + grabbedBooks[i].uid);
    }

    console.log("BooksForReviewFunctionsTests")
    const dummyBooksForReview = [{
        name: "book1",
        isbn: 1111111111111,
        description: "lorem ipsum 1",
        author: "John Doe1"
    }, {
        name: "book2",
        isbn: 2222222222222,
        description: "lorem ipsum 2",
        author: "John Doe2"
    }, {
        name: "book3",
        isbn: 3333333333333,
        description: "lorem ipsum 3",
        author: "John Doe3"
    }];

    const dummyUsr = { username: "person1" };
    response = await bookDB.addBookUsr(dummyUsr.username);
    console.assert(response.status === "ok", "addUsr: failed to add usr " + dummyUsr.username);
    console.assert(response.uid != undefined, "addUsr: uid was undefined");
    dummyUsr.uid = response.uid;

    const dummyUsr2 = { username: "person2" }
    response = await bookDB.addBookUsr(dummyUsr2.username);
    console.assert(response.status === "ok", "addUsr: failed to add usr " + dummyUsr2.username);
    console.assert(response.uid != undefined, "addUsr: uid was undefined");
    dummyUsr2.uid = response.uid;

    for (let i = 0; i < dummyBooksForReview.length; i++) {
        const dummyBook = dummyBooksForReview[i];
        const { name, isbn, description, author } = dummyBook;

        response = await bookDB.addBook(name, isbn, description, author);
        console.assert(response.status === "ok", "addBook: failed to add book with isbn " + isbn);
        console.assert(response.uid != undefined, "addBook: uid was undefined");
        dummyBook.uid = response.uid;

        response = await bookDB.writeBookReview(
            dummyUsr.uid,
            dummyBook.uid, {
                notes: "this is a good book " + name,
                rating: Math.ceil(Math.random() * 5),
                read_date: new Date(`December ${1}, 1995 03:24:00`)
            }
        )
        console.assert(response.status === "ok", `writeBookReview: writing review for book ${dummyBook.uid} and usr ${dummyUsr.uid}`);

        response = await bookDB.writeBookReview(
            dummyUsr2.uid,
            dummyBook.uid, {
                notes: "this is a bad book " + name,
                rating: Math.ceil(Math.random() * 5),
                read_date: new Date(`November ${1}, 1995 03:24:00`)
            }
        )
        console.assert(response.status === "ok", `writeBookReview: writing review for book ${dummyBook.uid} and usr ${dummyUsr2.uid}`);
    }

    response = await bookDB.getUsrBookReviews(dummyUsr.uid);
    console.assert(response.status === "ok", "getUsrBookReviews: status was not okay");
    console.assert(response.bookReviews.length === 3, "getUsrBookReviews: not able to grab usr reviews");
    response.bookReviews.forEach((review) => {
        console.assert(review.user_id === dummyUsr.uid, "getUsrReviews: grabbed a review that was not assigned to usr: " + dummyUsr.uid);
    });

    response = await bookDB.getBookReview(dummyUsr.uid, dummyBooksForReview[0].uid);
    console.assert(response.status === "ok", "getBookReview: status for getting book was not okay")
    console.assert(response.user_id === dummyUsr.uid, "getBookReview: did not grabbed a review with the right user: " + dummyUsr.uid);
    console.assert(response.book_id === dummyBooksForReview[0].uid, "getBookReview: did not grab book with right id: " + dummyBooksForReview[0].uid)

    response = await bookDB.getBookReviews();
    console.assert(response.status === "ok", "getBookReviews: status was not okay")
    console.assert(response.bookReviews.length === 6, "getBookReviews: not able to grab all of the reviews");

    response = await bookDB.updateBookReview(dummyUsr.uid, dummyBooksForReview[1].uid, {
        notes: "updated note for book2",
        read_date: new Date(`December 25, 1995 03:24:00`)
    });
    console.log(response);
    // TODO: fix syntax error for updating book reviews"
    console.assert(response.status === "ok", `updateBookReview: did not return status ok, msg: ${JSON.stringify(response)}`);

    response = await bookDB.getBookReview(dummyUsr.uid, dummyBooksForReview[1].uid)
    console.assert(response.status === "ok", "getBookReview: status was not okay")
    console.assert(response.rating === dummyBooksForReview[1].rating, "updateBookReview: the rating did not stay the same");
    console.assert(response.notes === "updated note for book2", "updateBookReview: the notes was not updated");
    console.assert(response.read_date === new Date(`December 25, 1995 03:24:00`));

    for (let i = 0; i < dummyBooksForReview.length; i++) {
        const dummyBook = dummyBooksForReview[i];

        response = await bookDB.deleteBookReview(dummyUsr.uid, dummyBook.uid);
        console.assert(response.status === "ok", `deleteBookReview: was not able to delete review for usr: ${dummyUsr.uid} and book: ${dummyBook.uid}`)

        response = await bookDB.deleteBook(dummyUsr2.uid, dummyBook.uid);
        console.assert(response.status === "ok", `deleteBookReview: was not able to delete review for usr: ${dummyUsr2.uid} and book: ${dummyBook.uid}`)

        response = await bookDB.deleteBook(dummyBook.uid);
        console.assert(response.status === "ok", `deleteBook: was not able to delete book: ${dummyBook.uid}`)
    }

    response = await bookDB.deleteBookUsr(dummyUsr.uid);
    console.assert(response.status === "ok");
    response = await bookDB.deleteBookUsr(dummyUsr2.uid);
    console.assert(response.status === "ok");

    bookDB.closeDB();
}

if (
    import.meta.url === `file://${process.argv[1]}`
) {
    await bookDBTests();
}
export default bookDBTests;