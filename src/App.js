// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './utils/firebase';
import Navbar from './components/Navbar';
import Class from './components/Class';
import Pop from './components/Pop'; // This is likely the line causing the issue
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import HomePage from './components/HomePage';
import Translate from './components/translate';
import TextToSpeech from './components/TextToSpeech';
import SpeechToText from './components/SpeechToText';
import Chat from './components/Chat';



const App = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/class" element={<Class />} />
        <Route path="/pop" element={<Pop />} />
        <Route path="/chat" element={<Chat />} />
        <Route path ="/calendar" element={<Calendar />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/text2speech" element={<TextToSpeech />} />
        <Route path="/speech2text" element={<SpeechToText />} />
        
      </Routes>
    </Router>
  );
};

export default App;
