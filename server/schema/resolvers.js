
// const { AuthenticationError } = require('apollo-server');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');



const resolvers = {

  Query: {

    me: async (parent, args, context) => {
      if (context.user) {

        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw AuthenticationError;
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
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw  AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },


    createUser: async (parent, { username, email, password }) => {
      console.log("Createuser",username,email,password)
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      console.log(token,user,"Create")
      return { token, user };
    },


    saveBook: async (parent, { bookInput }, context) => {
      // Get the user from the context
      const user = context.user;
      console.log ("JASMINE", user)
      console.log("bookinput", bookInput)
      if (user) {
        return User.findByIdAndUpdate(
          context.user._id,

          { $addToSet: { savedBooks: { ...bookInput } } },
          { new: true, runValidators: true }
        );
      }
      throw AuthenticationError;


    },
    removeBook: async (parent, { bookId }, context) => {
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