'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
}

interface Score {
  _id: string;
  userId: string;
  username: string;
  difficulty: string;
  score: number;
  createdAt: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'scores'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否登录且是管理员
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const userData = JSON.parse(stored);
      if (userData.role === 'admin') {
        setUser(userData);
      } else {
        router.push('/admin/login');
      }
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [activeTab, difficulty, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'x-user': JSON.stringify(user),
      };

      if (activeTab === 'users') {
        const res = await fetch('/api/admin/users', { headers });
        const data = await res.json();
        setUsers(data);
      } else {
        const url = difficulty === 'all'
          ? '/api/admin/scores'
          : `/api/admin/scores?difficulty=${difficulty}`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        setScores(data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteScore = async (scoreId: string) => {
    if (!confirm('确定要删除这条成绩记录吗？')) return;
    
    try {
      const headers = {
        'x-user': JSON.stringify(user),
      };

      const res = await fetch(`/api/admin/scores?id=${scoreId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (res.ok) {
        setScores(scores.filter(score => score._id !== scoreId));
        alert('删除成功！');
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？这会同时删除该用户的所有成绩记录！')) return;
    
    try {
      const headers = {
        'x-user': JSON.stringify(user),
      };

      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (res.ok) {
        setUsers(users.filter(user => user._id !== userId));
        alert('删除成功！');
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">检查权限中...</div>
        </div>
      </div>
    );
  }

  const logout = () => {
    localStorage.removeItem('currentUser');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">管理后台</h1>
              <p className="text-sm text-gray-600">欢迎, {user.username}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                返回首页
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标签页切换 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium text-lg transition ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              👥 用户管理
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`px-6 py-4 font-medium text-lg transition ${
                activeTab === 'scores'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 成绩管理
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'users' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">用户列表</h2>
                <div className="text-sm text-gray-500">
                  共 {users.length} 个用户
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">加载中...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">暂无用户数据</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">角色</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">注册时间</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'admin' ? '管理员' : '学生'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleString('zh-CN')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">成绩记录</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">全部难度</option>
                    <option value="easy">容易</option>
                    <option value="normal">普通</option>
                    <option value="hard">困难</option>
                  </select>
                  <div className="text-sm text-gray-500">
                    共 {scores.length} 条记录
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">加载中...</div>
              ) : scores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">暂无成绩数据</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">难度</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分数</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时间</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {scores.map((score) => (
                        <tr key={score._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{score.username}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              score.difficulty === 'easy' 
                                ? 'bg-green-100 text-green-800'
                                : score.difficulty === 'normal'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {score.difficulty === 'easy' ? '容易' : 
                               score.difficulty === 'normal' ? '普通' : '困难'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-600">{score.score}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(score.createdAt).toLocaleString('zh-CN')}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => deleteScore(score._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}