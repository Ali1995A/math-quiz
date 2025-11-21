'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// 题目生成器
const generateQuestion = (diff: string) => {
  let max = 20;
  if (diff === 'normal') max = 100;
  if (diff === 'hard') max = 1000;

  // 随机决定是加法还是减法 (0是加, 1是减)
  const isPlus = Math.random() > 0.5;
  let a = Math.floor(Math.random() * max);
  let b = Math.floor(Math.random() * max);

  // 如果是减法，保证 a >= b，防止出现负数
  if (!isPlus && a < b) {
    [a, b] = [b, a];
  }

  const correctAnswer = isPlus ? a + b : a - b;
  const operator = isPlus ? '+' : '-';

  // 生成3个错误选项 (在正确答案附近随机波动)
  const options = new Set<number>();
  options.add(correctAnswer);

  while (options.size < 4) {
    // 错误答案在正确答案的 +/- 10 范围内，且不能小于0
    let wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
    if (wrong < 0) wrong = 0;
    if (wrong !== correctAnswer) options.add(wrong);
  }

  // 打乱选项顺序
  return {
    text: `${a} ${operator} ${b} = ?`,
    correct: correctAnswer,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
};

export default function QuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = searchParams.get('difficulty') || 'easy';

  // 游戏状态
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. 初始化：生成20个题目
  useEffect(() => {
    const qList = [];
    for (let i = 0; i < 20; i++) {
      qList.push(generateQuestion(difficulty));
    }
    setQuestions(qList);
  }, [difficulty]);

  // 2. 倒计时逻辑
  useEffect(() => {
    if (gameOver) return;
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(false); // 时间到，算错，自动下一题
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQ, gameOver, questions]);

  // 处理答题
  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 5);

    if (currentQ + 1 >= 20) {
      finishGame(isCorrect ? score + 5 : score);
    } else {
      setCurrentQ((c) => c + 1);
      setTimeLeft(10); // 重置时间
    }
  };

  // 游戏结束，自动提交分数
  const finishGame = async (finalScore: number) => {
    setGameOver(true);
    setScore(finalScore); // 修正最后显示的分数
    
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setSaving(true);
      const user = JSON.parse(userStr);
      try {
        await fetch('/api/score/submit', {
          method: 'POST',
          body: JSON.stringify({
            userId: user._id,
            username: user.username,
            difficulty,
            score: finalScore
          })
        });
      } catch (e) {
        console.error('保存失败');
      } finally {
        setSaving(false);
      }
    }
  };

  if (questions.length === 0) return <div className="text-center p-10">正在出题...</div>;

  // 结算界面
  if (gameOver) {
    return (
      <div className="min-h-screen bg-yellow-300 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-orange-400">
          <h1 className="text-4xl font-black text-orange-500 mb-4">🎉 考试结束!</h1>
          <p className="text-gray-500 text-xl mb-6">你的最终得分是</p>
          <div className="text-8xl font-black text-green-500 mb-8">{score}</div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => router.push('/')} className="px-6 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300">
              返回主页
            </button>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg">
              再玩一次
            </button>
          </div>
          {saving && <p className="mt-4 text-sm text-gray-400">正在保存成绩...</p>}
        </div>
      </div>
    );
  }

  // 答题界面
  const currentQuestion = questions[currentQ];

  return (
    <div className="min-h-screen bg-blue-300 flex flex-col items-center justify-center p-4">
      {/* 顶部进度条 */}
      <div className="w-full max-w-md bg-blue-500 rounded-full h-4 mb-6 overflow-hidden border-2 border-white">
        <div 
          className="bg-yellow-400 h-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / 20) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md border-b-8 border-blue-200 relative">
        {/* 分数和倒计时 */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-xl font-bold text-blue-500">
            第 {currentQ + 1} / 20 题
          </div>
          <div className="text-xl font-bold text-green-500">
            得分: {score}
          </div>
        </div>

        {/* 倒计时圆圈 */}
        <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black border-4 shadow-lg ${timeLeft <= 3 ? 'bg-red-500 border-red-200 text-white animate-bounce' : 'bg-white border-blue-500 text-blue-500'}`}>
          {timeLeft}
        </div>

        {/* 题目 */}
        <div className="text-center my-10">
          <h2 className="text-5xl font-black text-gray-700">{currentQuestion.text}</h2>
        </div>

        {/* 选项按钮 */}
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((opt: number, index: number) => (
            <button
              key={index}
              onClick={() => handleNext(opt === currentQuestion.correct)}
              className="py-6 bg-blue-50 hover:bg-blue-100 active:bg-blue-500 active:text-white rounded-2xl text-3xl font-bold text-blue-600 transition border-2 border-blue-100 hover:border-blue-300"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}