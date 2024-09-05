import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import FAQ from "./Components/FAQ/FAQ";
import Article from "./Components/Article/Article";
import Settings from "./Components/Profile/Settings/Settings";
import NotFound from "./Components/NotFound/NotFound";
import './App.css'
import OtpEmailVerification from "./Components/Auth/Verify/Otp";
import EmailVerification from "./Components/Auth/Verify/Email";

function App() {

  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="article" element={<Article />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/signin/verify" element={<OtpEmailVerification />} />
          <Route path="/signup/verify" element={<EmailVerification />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
