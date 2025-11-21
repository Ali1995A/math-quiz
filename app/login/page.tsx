'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok) {
      // 把用户信息存到浏览器里 (LocalStorage)，这样刷新页面也能记住你
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      alert('欢迎回来！准备好挑战了吗？');
      router.push('/'); // 跳回主页
    } else {
      alert('❌ ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 border-4 border-blue-500">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🔑 登录挑战
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
            placeholder="你的名字" required
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
            placeholder="你的密码" required
          />
          <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-lg shadow-md transition transform active:scale-95">
            🚀 开始冒险
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-400 underline hover:text-blue-600">
            还没有账号？去注册
          </Link>
        </div>
      </div>
    </div>
  );
}