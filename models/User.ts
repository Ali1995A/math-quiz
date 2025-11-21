import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '请输入用户名'],
    unique: true, // 用户名不能重复
    trim: true,
    maxlength: [10, '用户名最多10个字'],
  },
  password: {
    type: String,
    required: [true, '请输入密码'],
  },
  role: {
    type: String,
    default: 'student',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);