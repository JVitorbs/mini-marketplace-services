import { writable } from "svelte/store";

export type Variation = {
  name: string;
  price: number;
  duration: number;
};

export type Service = {
  id: number;
  name: string;
  description: string;
  variations: Variation[];
};

export const services = writable<Service[]>([]);

let serviceId = 1;

export function addService(service: Omit<Service, "id">) {
  services.update((s) => [...s, { id: serviceId++, ...service }]);
}

export function removeService(id: number) {
  services.update((s) => s.filter((service) => service.id !== id));
}
