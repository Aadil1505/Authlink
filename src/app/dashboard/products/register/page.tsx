'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const [uid, setUid] = useState('');
  const [metadata, setMetadata] = useState('');
  const [result, setResult] = useState('');

  // NFC keyboard-like reader handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (uid.length >= 14) {
          register(uid, metadata);
        }
      } else {
        setUid((prev) => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [uid, metadata]);

  const register = async (rawUID: string, meta: string) => {
    const uidArray = rawUID.match(/.{1,2}/g)?.map(hex => parseInt(hex, 16));
    if (!uidArray || uidArray.length !== 7) {
      setResult('❌ Invalid UID format');
      return;
    }

    const response = await fetch('/api/register-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: uidArray, metadata: meta }),
    });

    const data = await response.json();
    if (data.success) {
      setResult(`✅ Registered! PDA: ${data.pda}`);
    } else {
      setResult(`❌ Error: ${data.error}`);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Scan NFC to Register</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter product metadata"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">Waiting for UID scan... (auto submits on Enter)</p>
          <p className="text-xs break-all">Scanned UID: {uid}</p>
          <p className="text-sm mt-2">{result}</p>
        </CardContent>
      </Card>
    </main>
  );
}