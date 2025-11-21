import { NextRequest } from 'next/server';

export interface AuthUser {
  _id: string;
  username: string;
  role: string;
}

export function checkAdminAuth(req: NextRequest): AuthUser | null {
  try {
    // 从请求头中获取用户信息
    const userHeader = req.headers.get('x-user');
    if (!userHeader) {
      return null;
    }

    const user = JSON.parse(userHeader) as AuthUser;
    
    // 检查用户是否是管理员
    if (user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (error) {
    console.error('权限检查失败:', error);
    return null;
  }
}