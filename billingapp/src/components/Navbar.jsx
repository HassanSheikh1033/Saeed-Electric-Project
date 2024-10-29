import React, { useState } from 'react'
import icon from '../assets/icon.png'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import { IoMenu } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { MdLibraryAdd } from "react-icons/md";
import SearchBar from './OnSearch';
import { useProductsContext } from '../context/ProductsContext';


export default function Navbar() {

  const navigate = useNavigate()


  const { dispatch } = useProductsContext()


  const handleSubmit = async (term) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: term }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      navigate('/view-products')

      const data = await response.json();
      
      setTimeout(() => {
        dispatch({ type: 'ADD_PRODUCT', payload: data })
      }, [500])

    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  };





  const [menu, setMenu] = useState([
    {
      id: 1,
      name: "Add Invoice",
      icon: <FaFileInvoice />,
      isActive: true,
      path: '/'
    },
    {
      id: 2,
      name: "Dashboard",
      icon: <MdSpaceDashboard />,
      isActive: false,
      path: '/dashboard'
    },
    {
      id: 3,
      name: "View-Products",
      icon: < MdRateReview />,
      isActive: false,
      path: '/view-products'
    },
    {
      id: 4,
      name: "Add-Products",
      icon: <MdLibraryAdd />,
      isActive: false,
      path: '/add-products'
    },
  ])


  const [sideMenuActive, setSideMenuActive] = useState(false)


  const changeActive = (id) => {
    setMenu(
      menu.map(item => item.id === id ? { ...item, isActive: true } : { ...item, isActive: false })
    )
  }




  return (
    <div className='w-max-full'>
      <div className='flex justify-between items-center p-5 shadow-custom'>


        <div
          onClick={() => setSideMenuActive(true)}
        >
          <IoMenu className='w-7 h-7 ml-9' />
        </div>


        <menu className={`min-h-screen z-500 py-8 px-6 w-[400px] bg-white adminMenu ${sideMenuActive ? 'menuActive' : 'menuInactive'}`}>

          <section className='flex items-center justify-between'>

            <div className="flex gap-4 items-center">
              <img src={icon} alt="" className="w-[30px]" />
              <h1 className="text-2xl font-bold font-Oswald">K-Electronics</h1>
            </div>

            <div
              className='cursor-pointer text-2xl'
              onClick={() => setSideMenuActive(false)}
            >
              <AiOutlineClose />
            </div>
          </section>


          <div className='space-y-6 mt-10'>
            {menu && menu.map(item => (
              <Link
                to={item.path}
                className={`flex items-center gap-3 text-xl px-4 py-3 ${item.isActive ? 'bg-orange-500 text-white' : ''} rounded-lg cursor-pointer w-[200px]`}
                key={item.id}
                onClick={() => [changeActive(item.id), setSideMenuActive(false)]}
              >
                <div>
                  {item.icon}
                </div>
                <p>{item.name}</p>
              </Link>
            ))}
          </div>
        </menu>




        <div>
          <SearchBar onSearch={handleSubmit} />
        </div>


        {/* Display search results here */}

        <div></div>
      </div>


    </div>
  )
}


