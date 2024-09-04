import { BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import FAQ from "./Components/FAQ/FAQ";
import Article from "./Components/Article/Article";
import Settings from "./Components/Profile/Settings/Settings";
import NotFound from "./Components/NotFound/NotFound";
import { ForgotPasswordForm } from './Components/Auth/ForgotPassword';
import { NewPasswordForm } from './Components/Auth/NewPassword';
import './App.css'

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
          <Route path="article" element={<Article />}/>
          <Route path="settings" element={<Settings />}/>
          <Route path="/forgot-password" element={<ForgotPasswordForm />} /> 
          <Route path="/reset-password" element={<NewPasswordForm />} /> 
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
