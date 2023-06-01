import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.tsx';
import { MantineProvider } from '@mantine/core';
import './styles/main.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
