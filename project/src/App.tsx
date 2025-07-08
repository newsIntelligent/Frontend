import "./App.css";
import Header from "./components/Header";
import UpdatesSideBar from "./components/UpdatesSideBar";

function App() {
  return (
    <>
      <Header />
      <div className="flex px-12 py-8 bg-gray-50">
        {/* 왼쪽: 사이드바 */}
        <UpdatesSideBar />

        {/* 오른쪽: 기존 본문 영역 */}
        <div className="ml-12 flex-1">
          <div className="h-[2000px] bg-gray-50">
            {/* 임시 스크롤 확인용 */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
