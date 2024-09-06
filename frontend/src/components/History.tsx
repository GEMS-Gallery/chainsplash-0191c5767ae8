import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import DataTable from 'react-data-table-component';
import { backend } from '../../declarations/backend';

type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: bigint;
  timestamp: bigint;
};

function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        // For simplicity, we're using a hardcoded account ID.
        // In a real app, you'd want to get this from the user's authenticated session.
        const accountId = 'user_account_id';
        const history = await backend.getTransactionHistory(accountId);
        setTransactions(history);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, []);

  const columns = [
    { name: 'Transaction ID', selector: (row: Transaction) => row.id, sortable: true },
    { name: 'From', selector: (row: Transaction) => row.from, sortable: true },
    { name: 'To', selector: (row: Transaction) => row.to, sortable: true },
    { 
      name: 'Amount', 
      selector: (row: Transaction) => row.amount.toString(),
      sortable: true
    },
    { 
      name: 'Timestamp', 
      selector: (row: Transaction) => new Date(Number(row.timestamp) / 1000000).toLocaleString(),
      sortable: true
    },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        Transaction History
      </Typography>
      <DataTable
        columns={columns}
        data={transactions}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
      />
    </div>
  );
}

export default History;
