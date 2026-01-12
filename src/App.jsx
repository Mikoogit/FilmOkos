import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePages.jsx";
import Footer from './components/Footer.jsx';
import Filmek from './pages/MoviesPage.jsx';
import Profil  from "./pages/Profilepage.jsx";
import Login from './pages/LoginPages.jsx';
import Error from './pages/ErrorPage.jsx';
import MovieReview from './pages/MovieReviewPage.jsx';
import ErrorPage from "./pages/ErrorPage.jsx";



function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/filmek' element={<Filmek/>}/>
        <Route path='/profil' element={<Profil/>}/>
        <Route path='/bejelentkezes' element={<Login/>}/>
        <Route path='/ertekelesek' element={<MovieReview/>}/>
        <Route path='*' element={<Error/>}/>

        <Route path="/" element={<HomePage />} />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    
      <Footer />
    </BrowserRouter>
    </>
  )
}
import Moviepage from './pages/MoviesPage.jsx';

export default App
