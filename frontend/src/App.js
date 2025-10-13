import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import UpdateStudent from './UpdateStudent';

const App = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/add" element={<AddStudent />} />
          <Route path="/update/:id" element={<UpdateStudent />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
