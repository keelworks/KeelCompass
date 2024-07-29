import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import SignIn from "./Components/Auth/SignIn/SignIn";
import SignUp from "./Components/Auth/SignUp/SignUp";
import FAQ from "./Components/FAQ/FAQ";

import './App.css'

function App() {

  return (
    <>
     <div className="app-container">
    <NavBar/>
    <div className="content">
    <BrowserRouter>

      <Routes>
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/faq" element={<FAQ />}/>
      </Routes>
      
    </BrowserRouter>
    </div>
    <Footer/>
    </div>
    </>
  )
}

export default App
