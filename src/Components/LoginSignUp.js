import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignUp.css';



const LoginSignUp= () => {
    const navigate=useNavigate();

    const[formData,setFormData]=useState({name:'',password:'',confirmPassword:'',NIC:'',contact:'',});

const[error,setError]=useState('');

const handleChange=(e) =>{
    setFormData({...formData,[e.target.name]:e.target.value});
    setError('');
};

const handleSubmit=(e) => {
    e.preventDefault();

    const phonePattern=/^[0-9]{10}$/;
    const nicPattern=/^([0-9]{9}[vV]|[0-9]{12})$/;
    if(!phonePattern.test(formData.contact)){
        setError('Contact No must be 10 digits.');
        return;
    }

    if(!nicPattern.test(formData.NIC)){
        setError('NIC must be 2 digits or 9 digits with with letter v');
        return;
    }

    if(formData.password !==formData.confirmPassword){
        setError('Password do not match!');
        return;
    }
    
   // alert("Registration form submitted");  
    navigate('/owner');
    };

    return(
        
    <div className="background-wrapper">
        <div className="overlay"/>
            
        <form className="container" onSubmit={handleSubmit}>
            <div className="header">
                    <div className="text">Register as Owner</div>
                    <p>Create your account to post advertisement in your boarding</p>
                    <div className="underline"></div>
            </div>
        <div className="inputs">
            <div className="input">
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required/>
            </div>

            <div className="input">
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
            </div>

            <div className="input">
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
            </div>

            <div className="input">
                <input type="password" name="confirmPassword" placeholder="confirm password" onChange={handleChange} required/>
            </div>

            <div className="input">
                <input type="text" name="NIC" placeholder="NIC No" value={formData.NIC} onChange={handleChange} required/>
            </div>

            <div className="input">
                <input type="tel" name="contact" placeholder="Contact No" value={formData.contact} onChange={handleChange} required/>
            </div>

                {error && <p className="error-text">{error}</p>}

            <div className="submit-container">
                <button type="submit" className="submit">Register</button>
            </div>

        </div>
        
        

                  </form>
                
        </div>
    );

};

export default LoginSignUp;