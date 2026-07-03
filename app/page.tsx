import { redirect } from 'next/navigation';

// Root route has no content of its own. Middleware already enforces that you
// must be logged in to reach here at all; this just sends you on to the
// actual dashboard.
export default function RootPage() {
  redirect('/dashboard');
}