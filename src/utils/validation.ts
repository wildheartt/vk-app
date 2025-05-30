export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  birthDate: string;
  address: string;
  experience: number;
  skills: string;
  status: string;
  hireDate: string;
  manager: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateUserForm = (data: UserFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.firstName || data.firstName.length < 2) {
    errors.firstName = 'Имя должно содержать минимум 2 символа';
  }

  if (!data.lastName || data.lastName.length < 2) {
    errors.lastName = 'Фамилия должна содержать минимум 2 символа';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Некорректный email адрес';
  }

  if (!data.phone || data.phone.length < 10) {
    errors.phone = 'Номер телефона должен содержать минимум 10 символов';
  }
  if (!data.position || data.position.length < 2) {
    errors.position = 'Должность должна содержать минимум 2 символа';
  }

  if (!data.department || data.department.length < 2) {
    errors.department = 'Отдел должен содержать минимум 2 символа';
  }

  if (!data.salary || data.salary <= 0) {
    errors.salary = 'Зарплата должна быть больше 0';
  }

  if (!data.birthDate) {
    errors.birthDate = 'Дата рождения обязательна';
  }

  if (!data.address || data.address.length < 5) {
    errors.address = 'Адрес должен содержать минимум 5 символов';
  }

  if (data.experience < 0) {
    errors.experience = 'Опыт не может быть отрицательным';
  }
  if (!data.skills || data.skills.length < 2) {
    errors.skills = 'Навыки должны содержать минимум 2 символа';
  }

  if (!data.status) {
    errors.status = 'Статус обязателен';
  }
  if (!data.hireDate) {
    errors.hireDate = 'Дата найма обязательна';
  }

  if (!data.manager || data.manager.length < 2) {
    errors.manager = 'Менеджер должен содержать минимум 2 символа';
  }

  return errors;
};
