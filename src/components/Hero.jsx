import React from 'react';
import bgHero from '../assets/image.png';

const Hero = () => {
  return (
    <section
      className="h-screen flex flex-col justify-center px-8 text-white bg-opacity-50"
      style={{
        backgroundImage: `url(${bgHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        
      }}
    >
      <div className="mt-20 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold">Find your perfect stay,</h1>
        <h1 className="text-6xl md:text-7xl font-extrabold text-white mt-2">Stress-free.</h1>
        <button className="mt-6 bg-white bg-opacity-60 px-12 py-5 text-black rounded-3xl font-bold text-2xl hover:bg-gray-100">
          Search Now
        </button>
        <p className="mt-6 text-lg font-light">
          “Smart Boarding Finder helps students and professionals easily find trusted boarding
          places through a simple and user-friendly platform.”
        </p>
      </div>
    </section>
  );
};

export default Hero;
