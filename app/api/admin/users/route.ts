import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { checkAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = checkAdminAuth(req as any);
  if (!user) {
    return NextResponse.json({ message: '无权限访问' }, { status: 403 });
  }

  try {
    await connectDB();

    // 获取所有用户，按注册时间倒序排列
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password'); // 不返回密码字段

    return NextResponse.json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({ message: '获取用户列表失败' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = checkAdminAuth(req as any);
  if (!user) {
    return NextResponse.json({ message: '无权限访问' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: '用户ID不能为空' }, { status: 400 });
    }

    await connectDB();

    // 删除用户及其相关的成绩记录
    const Score = (await import('@/models/Score')).default;
    await Score.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json({ message: '删除用户失败' }, { status: 500 });
  }
}