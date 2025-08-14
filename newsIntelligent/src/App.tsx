import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import NotificationSettingPage from './pages/NotificationSettingPage';
import ReadPage from './pages/ReadPage';
import SettingPage from './pages/SettingPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingChangePage from './pages/SettingChangePage';
import LoginPage from './pages/LoginPage';
import ArticlePage from './pages/Article';
import HeaderLayout from './layout/HeaderLayout';

const queryClient = new QueryClient();

function App() {
  console.log('API Base URL:', import.meta.env.VITE_API_URL);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<HeaderLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/subscriptions" element={<SubscriptionPage />} />
              <Route path="/read-topic" element={<ReadPage />} />
              <Route path="/notification" element={<NotificationSettingPage />} />
              <Route path="/settings" element={<SettingPage />} />
              <Route path="/settings/changes" element={<SettingChangePage />} />
              <Route path="/article" element={<ArticlePage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />             
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
