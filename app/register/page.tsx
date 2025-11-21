'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('🎉 注册成功！欢迎加入数学大冒险！');
        router.push('/'); // 注册成功后暂时跳回首页，后面改成跳登录页
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('网络有点卡，请检查一下网络哦！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 border-4 border-orange-400">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
          📝 新用户注册
        </h1>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">你的名字</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-yellow-200 focus:border-orange-400 outline-none transition text-gray-700 bg-yellow-50"
              placeholder="输入个响亮的名字"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">设置密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-yellow-200 focus:border-orange-400 outline-none transition text-gray-700 bg-yellow-50"
              placeholder="嘘，这是秘密"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-lg shadow-md transform active:scale-95 transition disabled:opacity-50"
          >
            {loading ? '正在创建...' : '✨ 立即注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-orange-400 hover:text-orange-600 font-bold underline">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}