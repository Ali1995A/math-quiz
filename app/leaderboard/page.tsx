'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [list, setList] = useState<any[]>([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(true);

  // 每次切换难度，都去后台拉取最新数据
  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/score/leaderboard?difficulty=${difficulty}`);
        const data = await res.json();
        setList(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [difficulty]);

  // 难度按钮样式辅助函数
  const getBtnClass = (diff: string, color: string) => {
    const active = difficulty === diff;
    return `px-4 py-2 rounded-full font-bold transition border-b-4 ${
      active 
        ? `bg-${color}-500 text-white border-${color}-700 shadow-inner` 
        : `bg-white text-${color}-500 border-${color}-200 hover:bg-${color}-50`
    }`;
  };

  return (
    <div className="min-h-screen bg-purple-300 flex flex-col items-center p-4">
      <div className="bg-white/90 backdrop-blur w-full max-w-md rounded-3xl shadow-2xl border-4 border-purple-400 overflow-hidden flex flex-col h-[80vh]">
        
        {/* 头部标题 */}
        <div className="p-6 bg-purple-500 text-center">
          <h1 className="text-3xl font-black text-white mb-4">🏆 英雄榜</h1>
          
          {/* 难度切换开关 */}
          <div className="flex justify-center gap-2 bg-purple-600/30 p-2 rounded-2xl">
            <button 
              onClick={() => setDifficulty('easy')} 
              className={getBtnClass('easy', 'green')}
            >
              🌱 容易
            </button>
            <button 
              onClick={() => setDifficulty('normal')} 
              className={getBtnClass('normal', 'blue')}
            >
              🌊 普通
            </button>
            <button 
              onClick={() => setDifficulty('hard')} 
              className={getBtnClass('hard', 'red')}
            >
              🔥 困难
            </button>
          </div>
        </div>

        {/* 列表区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-gray-500 mt-10">正在寻找高手...</div>
          ) : list.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">暂时还没人上榜，快去抢第一！</div>
          ) : (
            list.map((item, index) => (
              <div key={item._id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:scale-[1.02] transition">
                {/* 排名图标 */}
                <div className="w-10 h-10 flex-shrink-0 font-black text-xl flex items-center justify-center mr-4">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                
                {/* 名字 */}
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{item.username}</div>
                  <div className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</div>
                </div>

                {/* 分数 */}
                <div className="font-black text-2xl text-orange-500">
                  {item.score}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <Link href="/" className="text-purple-500 font-bold hover:underline">
            ← 返回大厅
          </Link>
        </div>
      </div>
    </div>
  );
}