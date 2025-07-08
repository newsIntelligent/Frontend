import './App.css'
import Header from './components/Header'
import MainPage from './pages/MainPage'

function App() {
 
  return (
    <div className='w-full'>
    <Header />
      <div className="pt-[167px] ">
        {/* MainPage 컴포넌트가 전체 페이지를 감싸도록 변경 */}
        <MainPage />
        
      </div>
    </div>

  )
}

export default App
