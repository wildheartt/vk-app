import React from 'react';
import { render, screen } from '@testing-library/react';
import UserTable from '../components/UserTable';

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: false,
  }),
}));

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

jest.mock('../hooks/useUsers', () => ({
  useUsers: () => ({
    users: [
      {
        id: 1,
        firstName: 'Тестовое',
        lastName: 'Имя',
        email: 'test@test.com',
        phone: '+7 999 000 00 00',
        position: 'Разработчик',
        department: 'IT',
        salary: 100000,
        experience: 3,
        birthDate: '1990-01-01',
        address: 'Тестовый адрес 123',
        skills: 'React, TypeScript',
        hireDate: '2021-01-01',
        manager: 'Тестовый менеджер',
        status: 'Активный',
      },
    ],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('UserTable', () => {
  it('отображает заголовки таблицы', () => {
    render(<UserTable />);

    expect(
      screen.getByRole('columnheader', { name: 'Имя' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Фамилия' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Телефон' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Должность' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Отдел' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Зарплата' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Опыт' }),
    ).toBeInTheDocument();
  });

  it('отображает данные пользователей', () => {
    render(<UserTable />);

    expect(screen.getByText('Тестовое')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('Разработчик')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('100,000 ₽')).toBeInTheDocument();
  });

  it('показывает сообщение о загруженных данных', () => {
    render(<UserTable />);

    expect(
      screen.getByText('Все данные загружены (1 пользователей)'),
    ).toBeInTheDocument();
  });
});
