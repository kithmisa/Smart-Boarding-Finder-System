import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bgHero from '../assets/image.png';

const About = () => {
  return (
    <>
    
   <div
  className="relative flex-grow px-8 pt-32 pb-16 text-white"
  style={{
    backgroundImage: `url(${bgHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>

  <div className="relative z-10 bg-black bg-opacity-40 p-8 rounded-md max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-3 mt-10">1.Introduction</h1>

        <p className="text-lg mb-6">
        Smart Boarding Finder is an innovative digital platform designed to help university students and
        professionals quickly and conveniently find boarding places near their institution,especially
        around the University of Ruhuna.
        </p>

        <h2 className="text-2xl font-bold mb-3 mt-10">2.Our Mission</h2>

         <p className="text-lg mb-6">
        To simplify the boarding search experience through modern technology,making it stress-free and reliable for everyone.
        </p>

        <h2 className="text-2xl font-bold mb-3 mt-10">3.Why choose us?</h2>
        <ul className="list-disc pl-8 text-lg space-y-2">
          <li>Easy navigation and search interface</li>
          <li>Location-specific results</li>
          <li>Secure and verified listings</li>
          <li>Focused on student needs</li>
        </ul>

        <h2 className="text-2xl font-bold mb-3 mt-10">4.Our Services</h2>
        <ul className="list-disc pl-8 text-lg space-y-2">
          <li>Search boarding places by city or keywords</li>
          <li>Register and list your own boarding</li>
          <li>Contact boarding providers directly</li>
        </ul>
      </div>

      
    </div>
    
    </>
  );
};

export default About;