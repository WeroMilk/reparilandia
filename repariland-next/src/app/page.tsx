'use client';

import dynamic from 'next/dynamic';
import DesktopStageFrame from '@/components/DesktopStageFrame';

const App = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  return (
    <DesktopStageFrame>
      <App />
    </DesktopStageFrame>
  );
}
