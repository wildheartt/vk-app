import React, { useState } from 'react';
import UserTable from './components/UserTable';
import { UserForm } from './components/UserForm';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <h1>VK App - Таблица пользователей</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="toggle-form-button"
        >
          {showForm ? 'Показать таблицу' : 'Добавить пользователя'}
        </button>
      </header>

      <main className="app-main">
        {showForm ? (
          <UserForm onSuccess={() => setShowForm(false)} />
        ) : (
          <UserTable />
        )}
      </main>
    </div>
  );
}

export default App;
