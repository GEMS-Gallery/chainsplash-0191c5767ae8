import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { backend } from '../../declarations/backend';

type FormData = {
  recipients: string;
  amounts: string;
};

function Send() {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const recipients = data.recipients.split(',').map(r => r.trim());
      const amounts = data.amounts.split(',').map(a => BigInt(a.trim()));
      
      // For simplicity, we're using a hardcoded 'from' account.
      // In a real app, you'd want to get this from the user's authenticated session.
      const from = 'user_account_id';
      
      const sendResult = await backend.sendICP(from, recipients, amounts);
      if ('ok' in sendResult) {
        setResult('Transaction successful!');
        reset();
      } else {
        setResult(`Error: ${sendResult.err}`);
      }
    } catch (error) {
      console.error('Error sending ICP:', error);
      setResult('An error occurred while sending ICP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Send ICP
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="recipients"
          control={control}
          defaultValue=""
          rules={{ required: 'Recipients are required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Recipients (comma-separated)"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          name="amounts"
          control={control}
          defaultValue=""
          rules={{ required: 'Amounts are required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Amounts (comma-separated)"
              fullWidth
              margin="normal"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </form>
      {result && (
        <Typography sx={{ mt: 2 }} color={result.startsWith('Error') ? 'error' : 'success'}>
          {result}
        </Typography>
      )}
    </Box>
  );
}

export default Send;
