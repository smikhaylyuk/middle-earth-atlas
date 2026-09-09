import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Eriador — A Living Atlas',
  description: 'Explore a living painted atlas of Middle-earth from the Grey Havens through Eriador, Lórien and Rohan, past Rauros and the Dead Marshes into Mordor, as far as Mount Doom and Barad-dûr, with flowing rivers, drifting mist and a shared day and night cycle.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
