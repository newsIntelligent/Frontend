import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import NotificationSettingPage from './pages/NotificationSettingPage';
import ReadPage from './pages/ReadPage';
import SettingPage from './pages/SettingPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingChangePage from './pages/SettingChangePage';
import LoginPage from './pages/LoginPage';
import ArticlePage from './pages/Article';
import EmailChangePage from './pages/EmailChangePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="w-full pt-[167px]">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route path="/read-topic" element={<ReadPage />} />
            <Route path="/notification" element={<NotificationSettingPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/settings/changes" element={<SettingChangePage />} />
            <Route path="/login" element={<LoginPage />} />   
            <Route path="/article" element={<ArticlePage />} /> 
            <Route path="/email-change" element={<EmailChangePage />} />         
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
