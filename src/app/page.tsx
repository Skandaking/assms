import { redirect } from 'next/navigation';
import { Inter } from 'next/font/google';

export default function Home() {
  redirect('/login');
}
