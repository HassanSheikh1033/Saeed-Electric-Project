import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddProducts from './components/AddProducts';
import ViewProducts from './components/ViewProducts'
import AddInvoice from './components/AddInvoice';
import { Toaster } from 'react-hot-toast'
import InvoiceData from './components/InvoiceData';
import { useEffect, useState } from 'react';
import Invoice from './components/Invoice';
import { ProductsContextProvider } from './context/ProductsContext';


function App() {


  return (
    <div className="App">

        <BrowserRouter>


          <Toaster
            position='top-center'
            reverseOrder={false}
          />


          <Navbar />
          <Routes>
            <Route path="/" element={<AddInvoice />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-products" element={<AddProducts />} />
            <Route path="/view-products" element={<ViewProducts />} />
            <Route path="/view-invoice/:id" element={<InvoiceData />} />
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;


