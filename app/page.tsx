'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 检查有没有登录
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-green-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">➕</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce">➖</div>

      <div className="text-center z-10">
        <h1 className="text-6xl font-black text-white drop-shadow-lg mb-8 tracking-wider">
          数学大冒险
        </h1>

        {!user ? (
          // 未登录显示这个
          <div className="space-y-4">
            <p className="text-xl text-green-800 font-bold mb-6">
              快来测试你的数学能力吧！
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <button className="px-8 py-3 bg-white text-green-600 font-bold rounded-full shadow-lg hover:scale-105 transition text-xl border-b-4 border-green-200">
                  登录
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-full shadow-lg hover:scale-105 transition text-xl border-b-4 border-yellow-600">
                  注册
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // 登录后显示这个
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              你好, <span className="text-green-600">{user.username}</span>! 👋
            </h2>
            <p className="text-gray-500 mb-6">准备好挑战哪个难度了吗？</p>
            
            <div className="space-y-3 grid grid-cols-1 gap-2">
              <Link href="/quiz?difficulty=easy" className="w-full">
                <button className="w-full py-4 bg-green-400 hover:bg-green-500 text-white font-bold rounded-2xl text-xl shadow-md transition border-b-4 border-green-600 flex items-center justify-center gap-2">
                  🌱 容易 (20以内)
                </button>
              </Link>

              <Link href="/quiz?difficulty=normal" className="w-full">
                <button className="w-full py-4 bg-blue-400 hover:bg-blue-500 text-white font-bold rounded-2xl text-xl shadow-md transition border-b-4 border-blue-600 flex items-center justify-center gap-2">
                  🌊 普通 (100以内)
                </button>
              </Link>

              <Link href="/quiz?difficulty=hard" className="w-full">
                <button className="w-full py-4 bg-red-400 hover:bg-red-500 text-white font-bold rounded-2xl text-xl shadow-md transition border-b-4 border-red-600 flex items-center justify-center gap-2">
                  🔥 困难 (1000以内)
                </button>
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
              {/* 这里看排行榜是什么样子的！ */}
              <Link href="/leaderboard" className="text-purple-500 font-bold text-sm hover:text-purple-700 flex items-center gap-1">
                🏆 查看排行榜
              </Link>
              <div className="flex gap-4">
                <Link href="/admin/login" className="text-blue-500 font-bold text-sm hover:text-blue-700 flex items-center gap-1">
                  ⚙️ 管理后台
                </Link>
                <button onClick={logout} className="text-red-400 font-bold text-sm hover:text-red-600">退出登录</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}