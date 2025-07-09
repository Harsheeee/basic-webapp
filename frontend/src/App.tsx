import React from 'react'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { Routes, Route } from 'react-router-dom'
//import '@mantine/core/styles.css';
import {MantineProvider} from '@mantine/core';


const App: React.FC=()=> {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MantineProvider>
  )
}

export default App;