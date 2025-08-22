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
          {/* 앱 루트 레이아웃 */}
          <Route path="/" element={<FeedBackLayout />}>
            {/* 헤더 포함 레이아웃 (루트 하위 공통) */}
            <Route element={<HeaderLayout />}>
              {/* 메인 페이지: / */}
              <Route index element={<MainPage />} />

              {/* 보호된 페이지들 */}
              <Route element={<ProtectedRoute />}>
                {/* /subscriptions */}
                <Route path="subscriptions" element={<SubscriptionPage />} />
                {/* /read-topic */}
                <Route path="read-topic" element={<ReadPage />} />
                {/* /notification */}
                <Route path="notification" element={<NotificationSettingPage />} />
                {/* /settings */}
                <Route path="settings" element={<SettingPage />} />
                {/* /settings/changes */}
                <Route path="settings/changes" element={<SettingChangePage />} />
              </Route>

              {/* 기사 상세: /article?id=... */}
              <Route path="article" element={<ArticlePage />} />
            </Route>

            {/* 인증/매직링크 등 (헤더 없이) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="email-change" element={<EmailChangePage />} />
            <Route path="login/magic" element={<MagicLink />} />
            <Route path="signup/magic" element={<MagicLink />} />
            <Route path="settings/notification-email/magic" element={<MagicLink />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
