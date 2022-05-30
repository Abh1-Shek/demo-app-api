// necessary modules
const { ApolloServer, gql } = require('apollo-server');

// dummy link:
// https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg

// my data
const users = [
    {
      id: 1,
      userName: 'Abhishek Sharma',
      userBio: 'ash bio',
    },
    {
      id: 2,
      userName: 'Pratik Shukla',
      userBio: 'ps bio',
    },
    {
        id: 3,
        userName: 'Adarsh Sharma',
        userBio: 'as bio',
    },
    {
        id: 4,
        userName: "Lovish Dua",
        userBio: 'ld bio',
    },
    {
        id: 5,
        userName: "Prashant Chandel",
        userBio: 'pc bio',
    }
];

// basic layout
const typeDefs = gql`
    type User {
        id: Int
        userName: String
        userBio: String
    }

    type Query {
        users: [User]
        getUserDetails(id: Int): User
    }

    type Mutation {
        addUser(userName: String, userBio: String): User
    }
`;


// functions which determine how data is returned
const resolvers = {
    Query: {
        users: () => users,
        getUserDetails: (root, args, context) => {
            return users.find(user => user.id === args.id);
        }
    },
    Mutation: {
        addUser: async (root, args, context) => {
            const { userName, userBio } = args;
            users.push({
                id: users.length + 1,
                userName: userName,
                userBio: userBio
            })
            return {
                userName,
                userBio
            }
        }
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



