import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ message: '用户不存在' }, { status: 400 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: '密码错误' }, { status: 400 });
    return NextResponse.json({ 
      message: '登录成功',
      user: { username: user.username, role: user.role, _id: user._id }
    });
  } catch (error) {
    return NextResponse.json({ message: '服务器错误' }, { status: 500 });
  }
}