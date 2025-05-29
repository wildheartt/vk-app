import React, { useState } from 'react';
import { useCreateUser, useUsers } from '../hooks/useUsers';
import {
  validateUserForm,
  UserFormData,
  ValidationErrors,
} from '../utils/validation';

interface UserFormProps {
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { create, loading, error } = useCreateUser();
  const { refresh } = useUsers();

  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    birthDate: '',
    address: '',
    experience: 0,
    skills: '',
    status: 'Активный',
    hireDate: new Date().toISOString().split('T')[0],
    manager: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const handleInputChange = (
    field: keyof UserFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateUserForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await create(formData);

      refresh();

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: 0,
        birthDate: '',
        address: '',
        experience: 0,
        skills: '',
        status: 'Активный',
        hireDate: new Date().toISOString().split('T')[0],
        manager: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Ошибка при создании пользователя:', err);
    }
  };

  return (
    <div className="user-form-container">
      <form onSubmit={handleSubmit} className="user-form">
        {error && <div className="api-error">Ошибка: {error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Имя *</label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={loading}
              className={validationErrors.firstName ? 'error' : ''}
            />
            {validationErrors.firstName && (
              <span className="error-message">
                {validationErrors.firstName}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Фамилия *</label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={loading}
              className={validationErrors.lastName ? 'error' : ''}
            />
            {validationErrors.lastName && (
              <span className="error-message">{validationErrors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={loading}
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={loading}
              className={validationErrors.phone ? 'error' : ''}
              placeholder="+7 (999) 123-45-67"
            />
            {validationErrors.phone && (
              <span className="error-message">{validationErrors.phone}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="position">Должность *</label>
            <input
              id="position"
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              disabled={loading}
              className={validationErrors.position ? 'error' : ''}
            />
            {validationErrors.position && (
              <span className="error-message">{validationErrors.position}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department">Отдел *</label>
            <input
              id="department"
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              disabled={loading}
              className={validationErrors.department ? 'error' : ''}
            />
            {validationErrors.department && (
              <span className="error-message">
                {validationErrors.department}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="salary">Зарплата *</label>
            <input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) =>
                handleInputChange('salary', Number(e.target.value))
              }
              disabled={loading}
              className={validationErrors.salary ? 'error' : ''}
              min="0"
              step="1000"
            />
            {validationErrors.salary && (
              <span className="error-message">{validationErrors.salary}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Опыт работы (лет) *</label>
            <input
              id="experience"
              type="number"
              value={formData.experience}
              onChange={(e) =>
                handleInputChange('experience', Number(e.target.value))
              }
              disabled={loading}
              className={validationErrors.experience ? 'error' : ''}
              min="0"
              max="50"
            />
            {validationErrors.experience && (
              <span className="error-message">
                {validationErrors.experience}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="birthDate">Дата рождения *</label>
            <input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              disabled={loading}
              className={validationErrors.birthDate ? 'error' : ''}
            />
            {validationErrors.birthDate && (
              <span className="error-message">
                {validationErrors.birthDate}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="hireDate">Дата найма *</label>
            <input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleInputChange('hireDate', e.target.value)}
              disabled={loading}
              className={validationErrors.hireDate ? 'error' : ''}
            />
            {validationErrors.hireDate && (
              <span className="error-message">{validationErrors.hireDate}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Адрес *</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={loading}
            className={validationErrors.address ? 'error' : ''}
          />
          {validationErrors.address && (
            <span className="error-message">{validationErrors.address}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="skills">Навыки *</label>
          <textarea
            id="skills"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            disabled={loading}
            className={validationErrors.skills ? 'error' : ''}
            rows={3}
            placeholder="Например: React, TypeScript, Node.js"
          />
          {validationErrors.skills && (
            <span className="error-message">{validationErrors.skills}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="manager">Менеджер *</label>
            <input
              id="manager"
              type="text"
              value={formData.manager}
              onChange={(e) => handleInputChange('manager', e.target.value)}
              disabled={loading}
              className={validationErrors.manager ? 'error' : ''}
            />
            {validationErrors.manager && (
              <span className="error-message">{validationErrors.manager}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Статус *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={loading}
              className={validationErrors.status ? 'error' : ''}
            >
              <option value="Активный">Активный</option>
              <option value="Неактивный">Неактивный</option>
              <option value="В отпуске">В отпуске</option>
              <option value="На больничном">На больничном</option>
            </select>
            {validationErrors.status && (
              <span className="error-message">{validationErrors.status}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Сохранение...' : 'Создать пользователя'}
          </button>
        </div>
      </form>
    </div>
  );
};
