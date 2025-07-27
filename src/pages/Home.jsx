import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import LoginPage from '../login';

function Home(){
    return(
        <div className="bg-gray-100">
            <Navbar/>
            <div className='h-24'></div>
            {/* <Hero/> */}
            <LoginPage/>
            <Footer/>
        </div>
    );    
}
export default Home;