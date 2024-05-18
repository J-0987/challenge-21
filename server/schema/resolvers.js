const {Book, User} = require('../models');

const resolvers ={

    Query: {
        book: async() => { 
            return Book.find();

        },

        user:async() => {
            return User.find();

        },
        me:async() => {
            

        },
        
        mutations : {
            login: async(parent, {username, email, password}) => {
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
            createUser: async(parent, {username, email, password}) => {
                const user = await User.create({username, email, password});
            
                if (!user) {
                    return res.status(400).json({ message: 'Something is wrong!' });
                }
                const token = signToken(user);
                return { token, user };
            },
            saveBook: async(parent, {authors, description, bookId, image, link, title}) => {
                console.log(user);
                try {
                    const updatedUser = await User.findOneAndUpdate(
                      { _id: user._id },
                      { $addToSet: { savedBooks: body } },
                      { new: true, runValidators: true }
                    );
                    return res.json(updatedUser);
                  } catch (err) {
                    console.log(err);
                    return res.status(400).json(err);
                  }
            },
            removeBook: async(parent, {bookId}) => {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                  );
                  return res.json(updatedUser);
            }
        }
    }
}

module.exports = resolvers;