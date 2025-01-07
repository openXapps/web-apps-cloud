import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import Home from '@/routes/Home';
import SignUserIn from '@/routes/SignUserIn';

export default function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="signin" element={<SignUserIn />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

