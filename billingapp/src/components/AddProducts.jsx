import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'
import { useProductsContext } from '../context/ProductsContext';

export default function AddProducts() {
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    price: null,
    stock: null,
    purchase: null,
  });

  const { setRefreshTrigger } = useProductsContext();


  const handleChange = (e) => {
    setFormData(prevState => {
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }


  useEffect(() => {
    console.log(formData)
  }, [formData])



  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const json = await response.json()

    if (response.ok) {
      console.log(json)
      toast.success("Product added successfully!");
      setRefreshTrigger(prev => !prev)
      setFormData({
        name: '',
        productId: '',
        price: 0,
        stock: 0,
        purchase: 0,
      })
    } else {
      console.log(json)
      toast.error(json.error)
    }


  };




  return (
    <main className="container my-[50px] ">
      <div className="overflow-hidden">
        <div className='' />
        <h1 className="heading text-center font-medium text-3xl">Add Products</h1>

        <form onSubmit={handleSubmit} className="w-[350px] md:w-[650px] lg:w-[800px] mx-auto mt-10">
          {/* Name and Code */}
          <div className="flex gap-7 flex-row">
            <div className="flex-[1]">
              <label className="text-xl">Name</label><br />
              <input
                type="text"
                placeholder="Radio"
                className={`outline-none border border-none bg-lighter w-full mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>


            <div className="flex-[1]">
              <label className="text-xl">Code</label><br />
              <input
                type="text"
                placeholder="Custom-112345"
                className={`outline-none border-none bg-lighter w-full mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                name="productId"
                value={formData.productId}
                onChange={handleChange}
              />
            </div>
          </div>


          {/* Price and Stock */}
          <div className="flex gap-7 flex-col md:flex-row mt-[30px]">
            <div className="flex-[1]">
              <label className="text-xl">Retail Price</label><br />
              <input
                type="number"
                placeholder="300"
                className={`outline-none border-none bg-lighter w-full mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>


            <div className="flex-[1]">
              <label className="text-xl">Stock</label><br />
              <input
                type="number"
                placeholder="50"
                className={`outline-none border-none bg-lighter w-[400px] mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>



          <div className="flex gap-7 flex-col md:flex-row mt-[30px]">
            <div className="flex-[1]">
              <label className="text-xl">purchase</label><br />
              <input
                type="number"
                placeholder="200"
                className={`outline-none border-none bg-lighter w-full mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                name="purchase"
                value={formData.purchase}
                onChange={handleChange}
              />
            </div>



            {/* Button */}
            <div className="flex-[1] flex justify-end mt-[35px]">
              <button
                className="w-[225px] bg-orange-500 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px]
              rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-lg 
              font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                type="submit"
              >
                Add Now
              </button>
            </div>

          </div>



        </form>
      </div>
    </main>
  );
}



