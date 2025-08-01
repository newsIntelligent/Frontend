import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Header from './components/Header'
import MainPage from './pages/MainPage'

const queryClient = new QueryClient();

function App() {
return (
    <QueryClientProvider client={queryClient}>
        <div className='w-full'>
      <Header />
        <div className="pt-[167px] ">
          {/* MainPage 컴포넌트가 전체 페이지를 감싸도록 변경 */}
          <MainPage />
        </div>
      </div>

    </QueryClientProvider>
    

  )
}

export default App
