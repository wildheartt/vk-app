export interface User {
  id: number;
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

export interface CreateUserRequest {
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

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
