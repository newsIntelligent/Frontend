import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NotificationSettingPage from './pages/NotificationSettingPage'
import ReadPage from './pages/ReadPage'
import SettingPage from './pages/SettingPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SettingChangePage from './pages/SettingChangePage'

function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<SubscriptionPage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/read-topic" element={<ReadPage />} />
          <Route path="/notification" element={<NotificationSettingPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/settings/changes" element={<SettingChangePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
