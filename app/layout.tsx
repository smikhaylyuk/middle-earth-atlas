import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Middle-earth — A Living Atlas',
  metadataBase: new URL('https://smikhaylyuk.github.io/middle-earth-atlas/'),
  alternates: { canonical: 'https://smikhaylyuk.github.io/middle-earth-atlas/' },
  description: 'Explore a living painted atlas of Middle-earth from the Grey Havens through Eriador, Lórien and Rohan, past Rauros and the Dead Marshes into Mordor, as far as Mount Doom and Barad-dûr, and along the Anduin through Gondor to Minas Tirith, Osgiliath and the Pelennor, then east through Ithilien to Minas Morgul and Cirith Ungol, and west beneath the White Mountains to Erech, Lamedon and Ethring, with flowing rivers, drifting mist and a shared day and night cycle.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
