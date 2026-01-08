import { useState } from 'react'
import './App.css'
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePages.jsx";
import ReviewsSection from "./components/ReviewsSection";
import Footer from './components/Footer.jsx';


function App() {

  return (
    <>
      <Navbar />
      <HomePage />
      <ReviewsSection />
      <Footer />
    </>
  )
}

export default App
