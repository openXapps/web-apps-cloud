import { BrowserRouter, Routes, Route } from 'react-router';

import { ThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';

import Layout from './routes/Layout';
import Home from '@/routes/Home';
import SignUserIn from '@/routes/SignUserIn';

export default function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="signin" element={<SignUserIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

