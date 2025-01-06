import { ThemeProvider } from '@/context/theme-provider';
import Home from './routes/Home';

export default function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
    </ThemeProvider>
  );
}

