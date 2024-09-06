import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import Home from './components/Home';
import Send from './components/Send';
import History from './components/History';

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ICP Payment System
          </Typography>
          <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
          <Link to="/send" style={{ color: 'white', marginRight: '1rem' }}>Send</Link>
          <Link to="/history" style={{ color: 'white' }}>History</Link>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Send />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
