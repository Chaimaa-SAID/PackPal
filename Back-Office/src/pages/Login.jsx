import React, { useState } from "react";
import logoLogin from "../assets/logo 1.png";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { loginFailure } from '../Redux/actions/Login';
import { loginSuccess } from '../Redux/actions/Login';
import { fetchUserSuccess } from '../Redux/actions/Login';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      const response = await fetch("https://packpal-backend.vercel.app/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message); 
      } else {
        localStorage.setItem('token', data.token);
        dispatch(loginSuccess(data.token));
        try {
          const token = data.token;
          const response = await fetch('https://packpal-backend.vercel.app/user/getOneUser', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          navigate("/Dashboard"); 
          const userData = await response.json();
          dispatch(fetchUserSuccess(userData));
        
        } catch (error) {
          console.error('Error fetching user data:', error);
        } 
      }
    } catch (error) {
      setErrorMessage("Invalid Email or Incorrect Password."); 
      dispatch(loginFailure(error.message)); 
    }
  };
      
  return (
    <div
      className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden">
          <div
            className="w-full lg:w-1/2 flex flex-col items-center justify-center p-12 bg-[#0C2D57] "  
          >
            <img src={logoLogin} alt="Logo" className="h-12 mb-8" />
            <h1 className="text-white text-3xl mb-3 ">Welcome Back</h1>
            
          </div>
          <div className="w-full lg:w-1/2 py-16 px-12 bg-[#d9a74a]">
            <h2 className="text-3xl mb-4 text-white text-center font-bold">
              Login
            </h2>
            <p className="mb-4 text-white text-center font-semibold">
              Login to your account Boss.
            </p>
            <form action="#">
              <div className="mt-5">
                <label className="mb-4 block text-white font-medium">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-md py-2 px-2 w-full"
                />
              </div>
              <div className="mt-5">
                <label className="mb-4 block text-white font-medium">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="border rounded-md py-2 px-2 w-full"
                />
              </div>
              {errorMessage && <span className="text-violet-600 mb-8">{errorMessage}</span>}
              <div className="mt-5">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-[#0C2D57] py-3 text-center text-white border-0 rounded-md font-semibold"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
