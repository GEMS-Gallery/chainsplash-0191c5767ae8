import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

function Home() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // For simplicity, we're creating a new account each time.
        // In a real app, you'd want to store and retrieve the account ID.
        const result = await backend.createAccount();
        if ('ok' in result) {
          setAccountId(result.ok);
          const balanceResult = await backend.getBalance(result.ok);
          if ('ok' in balanceResult) {
            setBalance(balanceResult.ok);
          }
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card sx={{ minWidth: 275, mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Account Overview
        </Typography>
        <Typography variant="body1">
          Account ID: {accountId}
        </Typography>
        <Typography variant="body1">
          Balance: {balance !== null ? balance.toString() : 'N/A'} ICP
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Home;
