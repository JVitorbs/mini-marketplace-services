import { writable } from "svelte/store";

export type Booking = {
  id: number;
  serviceId: number;
  serviceName: string;
  variation: string;
  clientName: string;
  clientId: number;
  date: string;
  time: string;
};

export const bookings = writable<Booking[]>([]);

let bookingId = 1;

export function addBooking(data: Omit<Booking, "id">) {
  bookings.update((b) => [...b, { id: bookingId++, ...data }]);
}

export function cancelBooking(id: number) {
  bookings.update((b) => b.filter((booking) => booking.id !== id));
}
