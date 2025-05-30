import React, { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useUsers } from '../hooks/useUsers';

const UserTable = () => {
  const { users, loading, error, hasMore, loadMore } = useUsers();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [loadMore, hasMore, loading]);

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore, hasMore, loading]);

  if (loading && users.length === 0) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных: {error}</div>;
  }

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Должность</th>
              <th>Отдел</th>
              <th>Зарплата</th>
              <th>Опыт</th>
              <th>Дата рождения</th>
              <th>Адрес</th>
              <th>Навыки</th>
              <th>Дата найма</th>
              <th>Менеджер</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="table-row">
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.position}</td>
                <td>{user.department}</td>
                <td>{user.salary.toLocaleString()} ₽</td>
                <td>
                  {user.experience} {user.experience === 1 ? 'год' : 'лет'}
                </td>
                <td>{new Date(user.birthDate).toLocaleDateString('ru-RU')}</td>
                <td>{user.address}</td>
                <td>{user.skills}</td>
                <td>{new Date(user.hireDate).toLocaleDateString('ru-RU')}</td>
                <td>{user.manager}</td>
                <td>
                  <span
                    className={`status ${user.status.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div ref={ref} className="loading-trigger">
          {loading && (
            <div className="loading-more">
              <div className="spinner"></div>
              <span>Загружаем еще данные...</span>
            </div>
          )}
        </div>
      )}

      {hasMore && !loading && (
        <div className="manual-load-more">
          <button onClick={handleLoadMore} className="load-more-button">
            Загрузить еще
          </button>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className="end-message">
          Все данные загружены ({users.length} пользователей)
        </div>
      )}
    </div>
  );
};

export default UserTable;
