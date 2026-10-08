import { User } from '../models/User.js';

export const userRepository = {
  async findById(id, selectPassword = false) {
    const query = User.findById(id);
    if (selectPassword) query.select('+password');
    return await query.exec();
  },

  async findByEmail(email, selectPassword = false) {
    const query = User.findOne({ email });
    if (selectPassword) query.select('+password');
    return await query.exec();
  },

  async create(userData) {
    return await User.create(userData);
  },

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
};
