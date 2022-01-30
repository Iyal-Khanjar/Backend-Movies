const bcrypt = require('bcryptjs')

const userData = {
    users: [
        {
            name: 'Ayal',
            email: 'ayal@gmail.com',
            password: bcrypt.hashSync('a', 8),
            isAdmin: true,
        },
        {
            name: 'Shadi',
            email: 'shadi@gmail.com',
            password: bcrypt.hashSync('s', 8),
            isAdmin: true,
        },
        {
            name: 'Timor',
            email: 'timor@gmail.com',
            password: bcrypt.hashSync('t', 8),
            isAdmin: true,
        },
    ]
}

module.exports = userData