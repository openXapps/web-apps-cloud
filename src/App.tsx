import Router from '@/routes/Router';

import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}

