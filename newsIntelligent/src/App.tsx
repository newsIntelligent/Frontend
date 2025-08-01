import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* 다른 페이지 경로도 여기에 추가 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
