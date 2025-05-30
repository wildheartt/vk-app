import { User, CreateUserRequest } from '../types/user';

const API_BASE_URL = 'http://localhost:3001';

export const fetchUsers = async (
  page = 1,
  limit = 10
): Promise<{
  users: User[];
  totalCount: number;
  hasMore: boolean;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?_page=${page}&_limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Ошибка загрузки пользователей');
    }

    const users = await response.json();
    const totalCount = parseInt(response.headers.get('X-Total-Count') || '0');
    const hasMore = page * limit < totalCount;

    return { users, totalCount, hasMore };
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    throw error;
  }
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Ошибка создания пользователя');
    }

    return response.json();
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
};
