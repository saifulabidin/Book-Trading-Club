export interface User {
  _id: string;
  username: string;
  email: string;
  // ...other properties
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  // ...other properties
}

// For API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
