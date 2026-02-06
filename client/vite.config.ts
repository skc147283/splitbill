import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Determine which API target based on mode
  const isDevelopment = mode === 'development' || mode === 'dev';
  const apiTarget = isDevelopment 
    ? 'http://localhost:5001' 
    : 'https://splitbill-api2.onrender.com';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    define: {
      __APP_MODE__: JSON.stringify(isDevelopment ? 'development' : 'production'),
    },
  };
});
