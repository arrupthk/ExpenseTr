
//was using earlier
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   password: { type: String, required: true },
//   isPremiumUser: { type: Boolean, default: false },
//   totalExpense: { type: Number, default: 0 },
// });
// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
// const User = mongoose.model('User', userSchema);
// module.exports = User;


// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   password: { type: String, required: true },
//   isPremiumUser: { type: Boolean, default: false },
//   totalExpense: { type: Number, default: 0 },
// });
// const User = mongoose.model('User', userSchema);
// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  isPremiumUser: { type: Boolean, default: false },
  totalExpense: { type: Number, default: 0 },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
