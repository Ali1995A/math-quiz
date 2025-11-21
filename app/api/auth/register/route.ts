import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    await connectDB();
    const existingUser = await User.findOne({ username });
    if (existingUser) return NextResponse.json({ message: '用户已存在' }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    return NextResponse.json({ message: '注册成功' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '服务器错误' }, { status: 500 });
  }
}