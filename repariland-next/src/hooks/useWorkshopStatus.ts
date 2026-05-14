import { useState, useEffect } from 'react';
import { getWorkshopStatus } from '@/lib/workshopHours';

export function useWorkshopStatus() {
  const [status, setStatus] = useState(() => getWorkshopStatus());

  useEffect(() => {
    const update = () => setStatus(getWorkshopStatus());
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return status;
}
