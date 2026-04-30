const User = require("../models/User");

exports.findByEmail = (email) => User.findOne({ email });
exports.findById = (id) => User.findById(id);
exports.createUser = (data) => User.create(data);
exports.saveUser = (user) => user.save();