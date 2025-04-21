'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationScanPage() {
  const [uid, setUid] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (uid.length >= 14) {
          router.push(`/verification/${uid}`);
        }
      } else {
        setUid((prev) => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [uid]);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scan NFC Tag to Verify</h1>
      <p className="text-muted-foreground">UID will auto-redirect once scanned.</p>
      <div className="mt-4 text-lg bg-gray-100 p-4 rounded">
        <strong>UID:</strong> {uid}
      </div>
    </main>
  );
}