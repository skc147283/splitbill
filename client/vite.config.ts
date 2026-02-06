import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Determine which API target based on mode and environment
  const isDevelopment = mode === 'development' || mode === 'dev';
  const apiTarget = isDevelopment 
    ? 'http://localhost:5001' 
    : (process.env.VITE_API_URL || 'https://splitbill-api.onrender.com');

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
      __API_URL__: JSON.stringify(apiTarget),
    },
  };
});
