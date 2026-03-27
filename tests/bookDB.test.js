import createBookDB from "../utils/bookDB.js";

async function bookDBTests() {
    const bookDB = createBookDB();
    let response = undefined;

    response = await bookDB.addBookUsr("John Doe");
    let userUID = null;
    if (response.status === "error") {
        console.log(response)
    } else {
        console.assert(response.uid != undefined);
        userUID = response.uid;
    }

    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok")
    console.assert(response.uid != undefined)

    response = await bookDB.updateBookUsr(userUID, "Jane Doe");
    console.assert(response.status === "ok")
    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok")
    console.assert(response.username === "Jane Doe")
    console.assert(response.username != "John Doe")

    response = await bookDB.deleteBookUsr(userUID);
    console.assert(response.status === "ok")

    response = await bookDB.getBookUsr(userUID);
    console.assert(response.status === "ok")

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
        console.assert(response.status === "ok");
        console.assert(response.uid != undefined);
    }

    for (let i = 0; i < dummyBooks.length; i++) {
        const dummyBook = dummyBooks[i];
        const { name, isbn, description, author, uid } = dummyBook;
        response = await bookDB.getBook(uid);
        console.assert(response.status === "ok")
        console.assert(response.uid === uid)
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
        console.assert(grabbedBooks[i].uid === dummyBooks[i].uid)
    }
    bookDB.editBook( ≈ `
        ]\kf bnmdum ud y`)
    bookDB.closeDB();
}

if (
    import.meta.url === `file://${process.argv[1]}`
) {
    await bookDBTests();
}
export default bookDBTests;