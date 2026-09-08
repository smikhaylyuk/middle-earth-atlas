import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Eriador — A Living Atlas',
  description: 'Explore a painted Eriador from the Grey Havens and the Shire to Bree and Rivendell, and south through Eregion and Moria to Isengard, with a continuous day and night cycle, drifting mist and warm settlement lights.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
