# Social Media App - Checklist Taskow

Status:

- [ ] not started
- [x] done

## P0 - Krytyczne (bezpieczenstwo i bugfixy)

### Task P0.1 - Naprawa usuwania notyfikacji

- [ ] Dodac `@Param('id') id: string` w kontrolerze notyfikacji
- [ ] Dopisac test e2e: usuniecie notyfikacji wlasnego usera
- [ ] Zweryfikowac, ze nie da sie usunac notyfikacji innego usera

### Task P0.2 - Zabezpieczenie endpointu tworzenia wiadomosci

- [ ] Dodac `AuthenticationGuard` do `POST /messages`
- [ ] Dodac walidacje czlonkostwa w group chacie (guard/service check)
- [ ] Zablokowac mozliwosc wysylki do obcego `groupChatId`
- [ ] Dopisac testy integracyjne dla scenariusza "user spoza czatu"

### Task P0.3 - Refactor `deviceId` i sesji logowania

- [ ] Ujednolicic semantyke `deviceId` vs `loginSession.id`
- [ ] Zmienic `confirm-session`, aby dzialal na bezpiecznym tokenie sesji
- [ ] Usunac/dezaktywowac `isVerified: true // DEV ONLY`
- [ ] Dodac mechanizm weryfikacji nowego urzadzenia (kod/token)
- [ ] Dopisac testy dla: nowe urzadzenie, stare urzadzenie, niewazna weryfikacja

### Task P0.4 - Privacy API consistency

- [ ] Ujednolicic `GET /users/:id/privacy` (czy zwraca dla `:id`, czy tylko dla `@UserId`)
- [ ] Dopasowac frontend do finalnej kontraktowej wersji endpointu
- [ ] Dopisac testy kontraktowe API dla privacy

### Task P0.5 - Szybkie porzadki quality

- [ ] Usunac `console.log` z kodu produkcyjnego (client/server)
- [ ] Dodac ESLint rule blokujaca `console.log` poza dev
- [ ] Sprawdzic brak regresji po cleanupie

---

## P1 - Core UX i funkcje podstawowe

### Task P1.1 - Feed page (frontend)

- [ ] Zaimplementowac `client/src/app/feed/page.tsx`
- [ ] Podpiac pobieranie feedu z API
- [ ] Dodac loading/skeleton i empty state
- [ ] Dodac paginacje lub infinite scroll

### Task P1.2 - Admin dashboard

- [ ] Zastapic placeholder `admin/page.tsx` realnym dashboardem
- [ ] Dodac metryki: users/posts/comments/messages
- [ ] Dodac szybkie akcje moderatora (linki do list i filtracja)

### Task P1.3 - Akcje admina: Remove/Ban

- [ ] Podpiac przyciski `Remove` i `Ban` w tabelach admina
- [ ] Dodac potwierdzenia modalne i komunikaty sukces/blad
- [ ] Dodac backend banowania (model + endpointy + guardy)
- [ ] Uwzglednic ban przy logowaniu i socketach

### Task P1.4 - Ustawienia (settings)

- [ ] Dodac strone `settings` (link juz istnieje w navbarze)
- [ ] Sekcja usuwania konta (z potwierdzeniem haslem)
- [ ] Sekcja zmiany motywu
- [ ] Sekcja aktywnych sesji/urzadzen i wylogowanie z innych
- [ ] Sekcja filtrow/cenzury tresci (ustawienie profilu)

### Task P1.5 - Auth rozszerzony

- [ ] Flow resetu hasla (request reset + token + nowe haslo)
- [ ] Flow zmiany hasla dla zalogowanego usera
- [ ] Flow zmiany maila z potwierdzeniem nowego adresu
- [ ] Ochrona rate-limit dla endpointow auth

---

## P2 - Funkcje spolecznosciowe i produktowe

### Task P2.1 - Proponowani znajomi

- [ ] Zaprojektowac algorytm sugestii (mutual friends, wspolne cechy)
- [ ] Dodac endpoint `/users/:id/suggestions`
- [ ] Dodac sekcje UI z CTA do zaproszenia

### Task P2.2 - Moderacja i zgloszenia

- [ ] Dodac model `Report` (post/comment/user)
- [ ] Dodac endpointy tworzenia i przegladania zgloszen
- [ ] Dodac panel moderatora do obslugi zgloszen
- [ ] Dodac statusy: open/in-review/closed

### Task P2.3 - Dostepnosc postow

- [ ] Dodac poziom widocznosci posta (PUBLIC/FRIENDS/PRIVATE)
- [ ] Wymusic filtrowanie postow po polityce widocznosci
- [ ] Dodac kontrole widocznosci w UI tworzenia/edycji posta

### Task P2.4 - Panel szkol i danych profilu

- [ ] Dokonczyc zakladki `about` (education/work/relationships)
- [ ] Dodac formularze i zapis dla `schools/jobs/hobbies/languages`
- [ ] Powiazac pola z privacy settings

### Task P2.5 - QR add friend + start chat

- [ ] Generowanie QR z identyfikatorem usera
- [ ] Skanowanie QR i wysylanie zaproszenia
- [ ] Opcja "dodaj i utworz chat" po akceptacji

---

## P3 - Niefunkcjonalne

### Task P3.1 - Responsywnosc

- [ ] Audyt mobile dla: chat, admin, profile, feed
- [ ] Poprawa layoutow z fixed heights i overflow
- [ ] Testy manualne: 360px, 768px, 1024px, desktop

### Task P3.2 - Testy

- [ ] Zastapic szablonowe e2e testami realnych flow
- [ ] Dodac e2e dla auth/feed/chat/admin/privacy
- [ ] Dodac smoke test po deployu

### Task P3.3 - Upgrade readiness

- [ ] Uporzadkowac ostrzezenia TS (`baseUrl` deprecation)
- [ ] Przygotowac migracje Prisma pod nowe wymagania configu
- [ ] Sprawdzic compatibility lockfile/deps

---

## Proponowany plan sprintow

### Sprint 1 (stabilizacja)

- [ ] P0.1
- [ ] P0.2
- [ ] P0.3
- [ ] P0.4
- [ ] P0.5

### Sprint 2 (core UX)

- [ ] P1.1
- [ ] P1.2
- [ ] P1.3
- [ ] P1.4
- [ ] P1.5

### Sprint 3 (funkcje rozwojowe)

- [ ] P2.1
- [ ] P2.2
- [ ] P2.3
- [ ] P2.4
- [ ] P2.5

### Sprint 4 (jakosc i utrzymanie)

- [ ] P3.1
- [ ] P3.2
- [ ] P3.3
