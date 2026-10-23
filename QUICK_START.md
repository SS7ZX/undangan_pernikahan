# Quick Start — Guest Invitation System

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Create `.env.local` in the project root:

   ```env
   SUPABASE_URL=https://PROJECT-REF.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=choose-a-long-unique-password
   ADMIN_SESSION_SECRET=generate-a-long-random-secret
   ```

   Generate a random session secret with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Keep the service role key on the server only. Never add `NEXT_PUBLIC_` to it or commit it.
3. Import the initial guest list from `_generated-guests.json`:

   ```bash
   npm run import:guests
   ```

4. Start the application and open the admin dashboard:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000/admin` and log in with `ADMIN_PASSWORD`.

## Managing invitations

- Add a guest from **Tambah Tamu** in the dashboard; a unique personal slug is generated.
- Use **Copy** or **WhatsApp** to share their `/guest/[slug]` link.
- RSVP status is saved as guests confirm attendance or decline.
- Wishes submitted from a personal guest link are saved with the sender's name and appear in the dashboard. Dashboard data refreshes every 30 seconds; **Muat ulang** refreshes immediately.
- Use **Export CSV** to download guest names, invitation links, RSVP statuses, and wishes.

The main invitation page (`/`) can still send wishes through WhatsApp, but only personal `/guest/[slug]` links are associated with a guest record.

## Supabase environment variables for hosting

Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the hosting provider's server-side environment settings, then redeploy. Do not expose the service role key to the browser.

See [GUEST_SYSTEM.md](./GUEST_SYSTEM.md) for the full guide.
