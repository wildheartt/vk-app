import { useState, useEffect } from 'react';
import { fetchUsers, createUser } from '../api/users';
import { User, CreateUserRequest } from '../types/user';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadUsers = async (pageNum: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchUsers(pageNum, 10);

      if (reset) {
        setUsers(data.users);
      } else {
        setUsers((prev) => [...prev, ...data.users]);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1, true);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadUsers(nextPage);
    }
  };

  const refresh = () => {
    setPage(1);
    loadUsers(1, true);
  };

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);

    try {
      const newUser = await createUser(userData);
      return newUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка создания пользователя';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
