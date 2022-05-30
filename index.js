// necessary modules
const { ApolloServer, gql } = require('apollo-server');

// dummy link:
// https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg

dummyLink = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';

// my data
const users = [
    {
      id: 1,
      userName: 'Abhishek Sharma',
      userBio: 'ash bio',
      link: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    },
    {
      id: 2,
      userName: 'Pratik Shukla',
      userBio: 'ps bio',
      link: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    },
    {
        id: 3,
        userName: 'Adarsh Sharma',
        userBio: 'as bio',
        link: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    },
    {
        id: 4,
        userName: "Lovish Dua",
        userBio: 'ld bio',
        link: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    },
    {
        id: 5,
        userName: "Prashant Chandel",
        userBio: 'pc bio',
        link: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg',
    }
];

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
        addUser(userName: String, userBio: String): User
        addProfilePicture(id: Int, link: String): User
    }
`;


// A function that will update the link of user with id = id
function updateLink(users, id, link) {
    let idx = -1;
    for(let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            users[i].link = link;
            idx = i;
            break;
        }
    }
    return users[idx];
}

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
            const { userName, userBio, link } = args;
            users.push({
                id: users.length + 1,
                userName: userName,
                userBio: userBio,
                link: link,
            })
            return {
                userName,
                userBio,
                link,
            }
        },
        addProfilePicture: async (root, args, context) => {
            const { id, link } = args;
            const user = updateLink(users, id, link);
            return user;
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



