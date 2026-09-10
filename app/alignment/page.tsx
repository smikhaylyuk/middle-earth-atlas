import type { Metadata } from 'next';
import AlignmentReview from '@/components/alignment-review';
export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: 'Map alignment study — Middle-earth Atlas',
  description:
    'Compare the existing painted atlas with a fixed Tolkien reference, inspect proposed placements, and preserve native artwork detail.',
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};
export default function Page() {
  return <AlignmentReview />;
}
