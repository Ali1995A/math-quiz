import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Score from '@/models/Score';

export const dynamic = 'force-dynamic'; // 这一行很重要，强制每次都查最新数据

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty') || 'easy';

    await connectDB();

    // 查找指定难度的前 20 名，按分数从高到低排序
    const scores = await Score.find({ difficulty })
      .sort({ score: -1, createdAt: -1 }) // 分数高的在前，分数一样的时间新的在前
      .limit(20);

    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json({ message: '获取排行榜失败' }, { status: 500 });
  }
}