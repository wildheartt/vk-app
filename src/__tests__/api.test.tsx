import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserTable from '../components/UserTable';
import { fetchUsers, createUser } from '../api/users';

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

const server = setupServer(
  rest.get('http://localhost:3001/users', (req, res, ctx) => {
    const mockUsers = [
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
    ];

    return res(
      ctx.status(200),
      ctx.set('X-Total-Count', '1'),
      ctx.json(mockUsers)
    );
  }),

  rest.post('http://localhost:3001/users', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 2,
        firstName: 'Новый',
        lastName: 'Пользователь',
      })
    );
  }),

  rest.get('http://localhost:3001/users', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Server Error' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('API Network Tests', () => {
  describe('fetchUsers API', () => {
    it('успешно загружает пользователей из API', async () => {
      const result = await fetchUsers(1, 10);

      expect(result.users).toHaveLength(1);
      expect(result.users[0].firstName).toBe('Тестовое');
      expect(result.totalCount).toBe(1);
      expect(result.hasMore).toBe(false);
    });

    it('обрабатывает ошибки API корректно', async () => {
      server.use(
        rest.get('http://localhost:3001/users', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Server Error' }));
        })
      );

      await expect(fetchUsers(1, 10)).rejects.toThrow(
        'Ошибка загрузки пользователей'
      );
    });
  });

  describe('createUser API', () => {
    it('успешно создает нового пользователя', async () => {
      const newUser = {
        firstName: 'Тестовое',
        lastName: 'Имя',
        email: 'test@test.com',
        phone: '+7 999 000 00 00',
        position: 'Разработчик',
        department: 'IT',
        salary: 100000,
        birthDate: '1990-01-01',
        address: 'Тестовый адрес 123',
        experience: 3,
        skills: 'React, TypeScript',
        status: 'Активный',
        hireDate: '2021-01-01',
        manager: 'Тестовый менеджер',
      };

      const result = await createUser(newUser);

      expect(result.id).toBe(2);
      expect(result.firstName).toBe('Новый');
    });

    it('обрабатывает ошибки создания пользователя', async () => {
      server.use(
        rest.post('http://localhost:3001/users', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Bad Request' }));
        })
      );

      const newUser = {
        firstName: 'Тест',
        lastName: 'Пользователь',
        email: 'test@example.com',
        phone: '+7 999 123 45 67',
        position: 'Разработчик',
        department: 'IT',
        salary: 100000,
        birthDate: '1990-01-01',
        address: 'Тестовый адрес',
        experience: 3,
        skills: 'React, TypeScript',
        status: 'Активный',
        hireDate: '2021-01-01',
        manager: 'Тестовый менеджер',
      };

      await expect(createUser(newUser)).rejects.toThrow(
        'Ошибка создания пользователя'
      );
    });
  });

  describe('UserTable with real API calls', () => {
    it('renders users from API and handles loading states', async () => {
      render(<UserTable />, { wrapper });

      expect(screen.getByText('Загрузка...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Тестовое')).toBeInTheDocument();
      });

      expect(screen.getByText('test@test.com')).toBeInTheDocument();
      expect(screen.getByText('Тестовый адрес 123')).toBeInTheDocument();
      expect(screen.getByText('Тестовый менеджер')).toBeInTheDocument();
    });

    it('handles API errors and shows error message', async () => {
      server.use(
        rest.get('http://localhost:3001/users', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ message: 'Server Error' }));
        })
      );

      render(<UserTable />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText(/ошибка загрузки данных/i)).toBeInTheDocument();
      });
    });
  });
});
