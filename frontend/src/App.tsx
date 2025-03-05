import { Toaster } from "react-hot-toast";
import "./App.css";
import SearchPage from "./components/SearchPage";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <SearchPage />
      </BrowserRouter>
    </>
  );
}

export default App;
