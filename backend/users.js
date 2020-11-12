import bcrypt from 'bcryptjs';

const users = [
    {
        name: "Admin test",
        email: "admin@example.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: true
    },
    {
        name: "Dummy",
        email: "dummy@example.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: false
    },
    {
        name: "John Doe",
        email: "johndoe@example.com",
        password: bcrypt.hashSync("12345", 10),
        isAdmin: false
    }
]

export default users;