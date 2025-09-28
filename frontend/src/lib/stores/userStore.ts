import { writable } from "svelte/store";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "cliente" | "prestador";
};

const initialUser: User | null = null;

export const user = writable<User | null>(initialUser);

export function loginFake(role: "cliente" | "prestador") {
  const mockUser: User = {
    id: 1,
    name: role === "cliente" ? "João Cliente" : "Maria Prestadora",
    email: role === "cliente" ? "cliente@email.com" : "prestador@email.com",
    role,
  };
  user.set(mockUser);
}

export function logout() {
  user.set(null);
}
