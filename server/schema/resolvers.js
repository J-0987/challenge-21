const { Book, User } = require('../models');

const resolvers = {

  Query: {
    book: async () => {
      return Book.find();

    },

    user: async () => {
      return User.find();

    },
    me: async () => {


    },
  },

  Mutation: {
      login: async (parent, { username, email, password }) => {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
          return res.status(400).json({ message: "Can't find this user" });
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          return res.status(400).json({ message: 'Wrong password!' });
        }
        const token = signToken(user);
        return { token, user };
      },
      createUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });

        if (!user) {
          return res.status(400).json({ message: 'Something is wrong!' });
        }
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