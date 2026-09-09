import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Eriador — A Living Atlas',
  description: 'Explore a living painted atlas of Middle-earth from the Grey Havens through Eriador, Lórien and Rohan, past Rauros to the Dead Marshes and the Black Gate, with flowing rivers, drifting mist and a shared day and night cycle.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
