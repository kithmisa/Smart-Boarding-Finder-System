import React from 'react';
import image from '../assets/image.png'; // Add your background image to /assets folder
//import { FaFacebook, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

 
function Home() {
   const navigate = useNavigate();
  return (
   <div className="bg-gray-100 text-white font-sans">
   
    
     { /* Home Section*/}
      <section
        className="h-screen flex flex-col justify-center px-8 pt-20"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold">Find your perfect stay,</h1>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mt-2">Stress-free.</h1>
          
          <button
          onClick={() => {
          console.log("Navigating...");
          navigate('/search');
  }}
          className="mt-6 bg-white bg-opacity-50 px-12 py-5 text-black rounded-3xl font-bold text-2xl hover:bg-gray-100">
              Search Now
          </button>


          <p className="mt-6 text-lg font-light">
            “Smart Boarding Finder helps students and professionals easily find trusted boarding
            places through a simple and user-friendly platform.”
          </p>
        </div>
     
     
     </section>

     
    </div>
  );
}

export default Home;


