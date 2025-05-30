import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from '../components/UserForm';
import { useCreateUser, useUsers } from '../hooks/useUsers';

jest.mock('../hooks/useUsers', () => ({
  useCreateUser: jest.fn(),
  useUsers: jest.fn(),
}));

describe('UserForm', () => {
  const mockCreate = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useCreateUser as jest.Mock).mockReturnValue({
      create: mockCreate,
      loading: false,
      error: null,
    });

    (useUsers as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('отображает все поля формы', () => {
    render(<UserForm />);

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/фамилия/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/должность/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/отдел/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/зарплата/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/опыт работы/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/дата рождения/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/дата найма/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/адрес/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/навыки/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/менеджер/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/статус/i)).toBeInTheDocument();
  });

  it('показывает ошибки валидации при отправке пустой формы', async () => {
    render(<UserForm />);

    fireEvent.click(screen.getByText(/создать пользователя/i));

    await waitFor(() => {
      expect(
        screen.getByText('Имя должно содержать минимум 2 символа')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Фамилия должна содержать минимум 2 символа')
      ).toBeInTheDocument();
      expect(screen.getByText('Некорректный email адрес')).toBeInTheDocument();
      expect(
        screen.getByText('Номер телефона должен содержать минимум 10 символов')
      ).toBeInTheDocument();
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('успешно отправляет форму с валидными данными', async () => {
    const onSuccess = jest.fn();
    render(<UserForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/имя/i), {
      target: { value: 'Иван' },
    });
    fireEvent.change(screen.getByLabelText(/фамилия/i), {
      target: { value: 'Иванов' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ivan@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/телефон/i), {
      target: { value: '+7 999 123 45 67' },
    });
    fireEvent.change(screen.getByLabelText(/должность/i), {
      target: { value: 'Разработчик' },
    });
    fireEvent.change(screen.getByLabelText(/отдел/i), {
      target: { value: 'IT' },
    });
    fireEvent.change(screen.getByLabelText(/зарплата/i), {
      target: { value: '100000' },
    });
    fireEvent.change(screen.getByLabelText(/опыт работы/i), {
      target: { value: '3' },
    });
    fireEvent.change(screen.getByLabelText(/дата рождения/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/адрес/i), {
      target: { value: 'Тестовый адрес' },
    });
    fireEvent.change(screen.getByLabelText(/навыки/i), {
      target: { value: 'React, TypeScript' },
    });
    fireEvent.change(screen.getByLabelText(/менеджер/i), {
      target: { value: 'Тестовый менеджер' },
    });

    fireEvent.click(screen.getByText(/создать пользователя/i));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Иван',
          lastName: 'Иванов',
          email: 'ivan@test.com',
        })
      );
      expect(mockRefresh).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('показывает ошибку API при неудачной отправке', async () => {
    const apiError = 'Ошибка сервера';
    (useCreateUser as jest.Mock).mockReturnValue({
      create: jest.fn().mockRejectedValue(new Error(apiError)),
      loading: false,
      error: apiError,
    });

    render(<UserForm />);
    fireEvent.change(screen.getByLabelText(/имя/i), {
      target: { value: 'Тест' },
    });
    fireEvent.change(screen.getByLabelText(/фамилия/i), {
      target: { value: 'Тестов' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });

    fireEvent.click(screen.getByText(/создать пользователя/i));

    await waitFor(() => {
      expect(screen.getByText(`Ошибка: ${apiError}`)).toBeInTheDocument();
    });
  });

  it('блокирует форму во время отправки', () => {
    (useCreateUser as jest.Mock).mockReturnValue({
      create: mockCreate,
      loading: true,
      error: null,
    });

    render(<UserForm />);

    expect(screen.getByLabelText(/имя/i)).toBeDisabled();
    expect(screen.getByLabelText(/фамилия/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByText(/сохранение/i)).toBeDisabled();
  });
});
