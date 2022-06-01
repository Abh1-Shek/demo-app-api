// necessary modules
const { ApolloServer, gql } = require('apollo-server');
var mysql = require('mysql2');

// dummy link:
// https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'database_name'
});

connection.connect();


// basic layout
const typeDefs = gql`
    type User {
        id: Int
        userName: String
        userBio: String
        link: String
    }

    type Query {
        users: [User]
        getUserDetails(id: Int): User
    }

    type Mutation {
        addProfilePicture(id: Int, link: String): User
    }
`;


// a function to get the user from database by id
async function getUser(id) {
    const getQuery = "select * from users where id = " + id.toString();
    let result = await new Promise((resolve, reject) => {
        connection.query(getQuery, function (error, results, fields) {
            if (error) throw error;
            resolve(results);
        });
    });

    return result[0];
}

// A function that will update the link of user with id = id
async function updateLink(id, link) {
    const updateQuery = "update users set link = '" + link.toString() + "' where id =" + id.toString();
    let result = await new Promise((resolve, reject) => {
            connection.query(updateQuery, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        }
    )
    console.log("result =", result);
    return getUser(id);
}


async function getAllUsers() {
    let result = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM users", function (error, results, fields) {
            if (error) throw error;
            resolve(results)
        })
    })
    return result;
}

// functions which determine how data is returned
const resolvers = {
    Query: {
        users: () => getAllUsers(),
        getUserDetails: async (root, args, context) => getUser(args.id),
    },
    Mutation: {
        addProfilePicture: async (root, args, context) => updateLink(args.id, args.link),
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
});



server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});

