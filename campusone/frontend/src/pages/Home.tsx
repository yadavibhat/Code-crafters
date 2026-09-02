import { useEffect, useState } from 'react';
import { fetchHealth } from '../lib/api';

export function Home() {
  const [status, setStatus] = useState<string>('loading...');

  useEffect(() => {
    fetchHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return <div>backend: {status}</div>;
}
