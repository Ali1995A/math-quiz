import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Score from '@/models/Score';

export async function POST(req: Request) {
  try {
    const { userId, username, difficulty, score } = await req.json();
    
    await connectDB();

    // 创建一条新的成绩记录
    await Score.create({
      userId,
      username,
      difficulty,
      score
    });

    return NextResponse.json({ message: '成绩保存成功！' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: '保存失败' }, { status: 500 });
  }
}