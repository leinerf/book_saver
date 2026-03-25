Tables
id user_name
primary(id)

user_id book_id notes rating read_date
primary(user_id + book_id)

id name(not null) isbn(unique not null) description author
primary(id)