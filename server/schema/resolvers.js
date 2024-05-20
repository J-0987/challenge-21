
const Book = require('../models/Book');
const User = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {

  Query: {
    
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw AuthenticationError;
    },

  

    // user: {
    //   books: async (parent) => {
    //     // parent is the User document
    //     // return the savedBooks field
    //     return parent.savedBooks;
    //   },
    // },
    users: async () => {
      // Fetch all users from the database
      const users = await User.find();
      return users;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },


      createUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      },


      saveBook: async (parent, { authors, description, bookId, image, link, title }, context) => {
        // Get the user from the context
        const user = context.user;

        if (!user) {
          throw new Error('Authentication error');
        }

        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } },
            { new: true, runValidators: true }
          );

          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error saving book');
        }
      },
      removeBook: async (parent, { bookId }) => {
        if (!user) {
          throw new Error('Authentication error');
        }
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );

          if (!updatedUser) {
            throw new Error('No user found with this id');
          }

          return updatedUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error removing book');
        }
      },
    },
  };


module.exports = resolvers;