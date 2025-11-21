import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Score from '@/models/Score';
import { checkAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = checkAdminAuth(req as any);
  if (!user) {
    return NextResponse.json({ message: '无权限访问' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty');

    await connectDB();

    let query = {};
    if (difficulty && difficulty !== 'all') {
      query = { difficulty };
    }

    // 获取所有成绩记录，按时间倒序排列
    const scores = await Score.find(query)
      .sort({ createdAt: -1 })
      .limit(100); // 限制返回100条记录

    return NextResponse.json(scores);
  } catch (error) {
    console.error('获取成绩列表失败:', error);
    return NextResponse.json({ message: '获取成绩列表失败' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = checkAdminAuth(req as any);
  if (!user) {
    return NextResponse.json({ message: '无权限访问' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const scoreId = searchParams.get('id');

    if (!scoreId) {
      return NextResponse.json({ message: '成绩ID不能为空' }, { status: 400 });
    }

    await connectDB();

    await Score.findByIdAndDelete(scoreId);

    return NextResponse.json({ message: '成绩删除成功' });
  } catch (error) {
    console.error('删除成绩失败:', error);
    return NextResponse.json({ message: '删除成绩失败' }, { status: 500 });
  }
}