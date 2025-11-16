import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { MyProvider } from "./components/MyContext";

function App() {
  return (
    <>
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
        </Routes>
      </BrowserRouter>
    </MyProvider>
    </>
  )
}

export default App
