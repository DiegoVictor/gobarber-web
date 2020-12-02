import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Theme from './styles/theme';
import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes />
      </AppProvider>

      <Theme />
    </BrowserRouter>
  );
};

export default App;
