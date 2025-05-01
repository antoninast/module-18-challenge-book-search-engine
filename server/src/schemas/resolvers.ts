import { Book } from '../models/Book.js';
import User from '../models/User.js';

import { AuthenticationError, signToken } from '../utils/auth-utils.js';

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
        savedBooks: [];
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    username: string;
}

interface BookI {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}
interface saveBookArgs {
    input: {
        userId: String
        book: BookI
    }
}
const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (_parent: any, { username }: UserArgs) => {
            return User.findOne({ username });
        },
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: unknown, { input }: AddUserArgs) => {
            const user = new User({ ...input });
            await user.save();
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: unknown, { input }: saveBookArgs, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const book = await Book.create({ ...input.book });
            await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: book } }
            );

            return book;
        }
    }
};

export default resolvers;