# Estrutura do front

```bash
src/
 ├─ lib/
 │   ├─ components/
 │   │   ├─ Navbar.svelte
 │   │   ├─ ServiceCard.svelte
 │   │   ├─ ServiceFilter.svelte
 │   │   ├─ ServiceForm.svelte
 │   │   ├─ AvailabilityCalendar.svelte
 │   │   ├─ BookingForm.svelte
 │   │   └─ NotificationBanner.svelte
 │   └─ stores/
 │       └─ userStore.ts
 ├─ routes/
 │   ├─ +layout.svelte
 │   ├─ +page.svelte                (home – lista de serviços)
 │   ├─ login/+page.svelte
 │   ├─ register/+page.svelte
 │   ├─ prestador/
 │   │   ├─ dashboard/+page.svelte
 │   │   ├─ services/+page.svelte
 │   │   ├─ availability/+page.svelte
 │   │   └─ bookings/+page.svelte
 │   └─ services/
 │       └─ [id]/+page.svelte       (detalhe do serviço)
 └─ app.css
```