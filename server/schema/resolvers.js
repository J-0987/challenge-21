
const { AuthenticationError } = require('apollo-server');
const { User } = require('../models');



const resolvers = {

  Query: {
    
    me: async (parent, args, context) => {
      if (context.user) {

        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },

  
    users: async () => {
      return User.find().populate('savedBooks');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('savedBooks');
    },
 
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
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
        if (context.user) {
          return User.findByIdAndUpdate(
            context.user._id,

            { $addToSet: { savedBooks: { authors, description, bookId, image, link, title } } },
            { new: true, runValidators: true }
          );
        }
        throw new AuthenticationError('You need to be logged in!');

       
      },
      removeBook: async (parent, { bookId }) => {
        if (context.user) {
          return User.findByIdAndUpdate(
            context.user._id,
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
        }
      },
    },
  };


module.exports = resolvers;