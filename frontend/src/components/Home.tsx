import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

function Home() {
  const [walletId, setWalletId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const result = await backend.createWallet();
        if ('ok' in result) {
          setWalletId(result.ok);
          const balanceResult = await backend.getBalance(result.ok);
          if ('ok' in balanceResult) {
            setBalance(Number(balanceResult.ok));
          }
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ minWidth: 275, mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Wallet Overview
        </Typography>
        <Typography variant="body1">
          Wallet ID: {walletId}
        </Typography>
        <Typography variant="body1">
          Balance: {balance !== null ? balance.toFixed(8) : 'N/A'} ICP
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Home;
