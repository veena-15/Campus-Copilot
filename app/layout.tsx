import type { Metadata } from 'next';
import './globals.css';
import './auth.css';

export const metadata: Metadata = { title: 'Campus Copilot — Student success, in focus', description: 'A calm workspace for attendance, study plans, assignments, and grounded AI tutoring.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
