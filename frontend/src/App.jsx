import './App.css';
import React, {useState, useEffect} from "react";
import axios from "axios";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import axiosInstance from "./api.js";
import TransactionForm from "./components/TransactionForm.jsx";
import Navbar from "./components/Navbar.jsx";
import Chart from "./components/Chart.jsx";

function App() {

  const AUTH_API = "http://localhost:5000/api/auth";
  const TRANSACTION_API = "http://localhost:5000/api/transaction";

  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser(username);
      setIsLogin(true);
    } else {
      setUser("");
      setIsLogin(false)
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username)  return;

      try {

        await axiosInstance.get("/api/auth/token/check");

      } catch (err) {
        console.error("Token invalid or expire.", err);
        localStorage.clear();
        setUser("");
        setIsLogin(false);
      }
    }

    const interval = setInterval(checkToken, 5*60*1000);
    checkToken();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLogin) {
      fetchTransactions();
    }
  }, [isLogin]);

  async function registerUser(userData) {
    try {
      const response = await axios.post(`${AUTH_API}/register`, userData);
      const {token, id, username, email} = response.data

      if (token && id && username && email) {
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        setIsLogin(true);
        setUser(username);

        alert("User registered.");
      }

    } catch (err) {
      console.error("Register failed.", err);
      alert("Register failed.");
    }
  }

  async function loginUser(userData) {
    try {
      const response = await axios.post(`${AUTH_API}/login`, userData);
      const {token, id, username, email} = response.data;

      if (token && id && username && email) {
        localStorage.setItem("token", token);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        setIsLogin(true);
        setUser(username);

        alert("User logged in.");
      }
    } catch (err) {
      console.error("Login failed.", err);
      alert("Login failed.")
    }
  }

  async function logoutUser() {
    localStorage.clear();
    setIsLogin(false);
  }

  async function fetchTransactions() {
    try {
      const response = await axiosInstance.get("/api/transaction");
      setTransactions(response.data);
    } catch (err) {
      console.error("GET request error.", err);
      alert("GET request error.");
    }
  }

  async function addTransaction(transactionData) {
    try {
      const response = await axiosInstance.post("/api/transaction", transactionData);
      fetchTransactions();
    } catch (err) {
      console.error("POST request error.", err);
      alert("POST request error.");
    }  
  }

  async function deleteTransaction(transactionId) {
    try {
      const response = await axiosInstance.delete(`/api/transaction/${transactionId}`);
      fetchTransactions();
    } catch (err) {
      console.error("DELETE request error.", err);
      alert("DELETE request error.");
    }
  }

  async function updateAllTransaction(transactionId, transactionData) {
    try {
      const response = await axiosInstance.put(`/api/transaction/${transactionId}`, transactionData);
      fetchTransactions();
    } catch (err) {
      console.error("PUT request error.", err);
      alert("PUT request error.");
    }
  }

  async function changePassword(userData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${AUTH_API}/change-password`, userData, {
        headers: {Authorization: `Bearer ${token}`}
      });
      localStorage.clear();
      setUser("");
      setIsLogin(false);
      setTransactions([]);
      setLoading(true);

      alert("Password changed successfully. Please login again.");

    } catch (err) {
      console.error("Failed to change your password.", err);
    }
  }

  async function forgotPassword(userData) {
    try {
      const response = await axios.post(`${AUTH_API}/forgot-password`, userData);
      alert(`Your temporary password ${response.data.temporaryPassword} has been set.`);

    } catch (err) {
      console.error("Failed to generate your temporary password.", err);
    }
  }

  if (loading)  return <div>Loading ...</div>;

  return (

    <BrowserRouter>

    <Navbar isLogin={isLogin} user={user} onLogout={logoutUser} />
    
    <Routes>

      <Route path='/dashboard' element={isLogin? (<Dashboard 
                                                  user={user}
                                                  transactions={transactions}
                                                  onAddTransaction={addTransaction}
                                                  onDeleteTransaction={deleteTransaction}
                                                  onUpdateAllTransaction={updateAllTransaction}
                                                  onLogout={logoutUser}
                                                  />)
        : (<Navigate to="/login" />)} />
      <Route path='/register' element={!isLogin? (<Register onRegister={registerUser}/>) : (<Navigate to="/dashboard" />)} />
      <Route path='/login' element={!isLogin? (<Login onLogin={loginUser} />) : (<Navigate to="/dashboard" />)} />
      <Route path='/add-transaction-form' element={<TransactionForm onAddTransaction={addTransaction} />} />
      <Route path='/' element={isLogin? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)} />
      <Route path='/chart' element={<Chart transactions={transactions} />} />
      <Route path='/change-password' element={<ChangePassword onChangePassword={changePassword} />} />
      <Route path='/forgot-password' element={<ForgotPassword onForgotPassword={forgotPassword} />} />

    </Routes>
    
    </BrowserRouter>

  );
}

export default App;