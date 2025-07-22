import {useState} from 'react';

function Login(){
    const [email,setEmail]=useState('');
    const[password,setPassword]=useState('');

    const handleLogin= (e) => {
        e.preventDefault();
        console.log('Email:',email);
        console.log('Password:',password);
    };

    return(
        <div>
           <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
        </div>
    );
}

export default Login;