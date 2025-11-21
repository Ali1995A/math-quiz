const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 数据库连接配置 - 使用与项目相同的连接字符串
const MONGODB_URI = 'mongodb+srv://admin:MathTest123@cluster0.lsnk67w.mongodb.net/mathquiz?retryWrites=true&w=majority&appName=Cluster0';

// 用户模型
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdminUser() {
  try {
    // 连接数据库
    await mongoose.connect(MONGODB_URI);
    console.log('✅ 数据库连接成功');

    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️  管理员用户已存在，正在更新密码...');
      // 更新密码
      const hashedPassword = await bcrypt.hash('admin123', 10);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ 管理员密码已更新');
    } else {
      // 创建新的管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      console.log('✅ 管理员用户创建成功');
    }

    console.log('🎉 管理员账号信息:');
    console.log('   用户名: admin');
    console.log('   密码: admin123');
    console.log('   角色: admin');

  } catch (error) {
    console.error('❌ 创建管理员用户失败:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 数据库连接已关闭');
  }
}

// 运行脚本
createAdminUser();