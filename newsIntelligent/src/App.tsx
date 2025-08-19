import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import MainPage from './pages/MainPage'
import NotificationSettingPage from './pages/NotificationSettingPage'
import ReadPage from './pages/ReadPage'
import SettingPage from './pages/SettingPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SettingChangePage from './pages/SettingChangePage'
import LoginPage from './pages/LoginPage'
import ArticlePage from './pages/Article'
import HeaderLayout from './layout/HeaderLayout'
import FeedBackLayout from './layout/FeedBackLayout'
import ProtectedRoute from './Routes/ProtectedRoute'
import EmailChangePage from './pages/EmailChangePage'
import MagicLink from './pages/MagicLink'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedBackLayout />}>
            <Route path="/" element={<HeaderLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/subscriptions" element={<SubscriptionPage />} />
                <Route path="/read-topic" element={<ReadPage />} />
                <Route path="/notification" element={<NotificationSettingPage />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route path="/settings/changes" element={<SettingChangePage />} />
              </Route>

              <Route path="/article" element={<ArticlePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/email-change" element={<EmailChangePage />} />
            <Route path="/login/magic" element={<MagicLink />} />
            <Route path="/signup/magic" element={<MagicLink />} />
            <Route path="/settings/notification-email/magic" element={<MagicLink />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
