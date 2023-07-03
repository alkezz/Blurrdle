import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#292d2f" }}>
      <h1 style={{ color: "white" }}>Live Site Coming Soon!</h1>
      <LinearProgress color="secondary" sx={{ width: "50%" }} />
    </div>
  );
};

export default App;
