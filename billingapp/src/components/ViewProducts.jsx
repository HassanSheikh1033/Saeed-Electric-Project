import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useProductsContext } from '../context/ProductsContext';
import Loader from './Loader';


export default function ViewProducts() {

    const [isEditing, setIsEditing] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [formData, setFormData] = useState({});

    const { products, dispatch, loading, setLoading, refreshTrigger, setRefreshTrigger } = useProductsContext();

    useEffect(() => { setRefreshTrigger(!refreshTrigger) }, [])





    // Delete Single Products ==========================================
    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/delete/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setRefreshTrigger(prev => !prev)

        } catch (error) {
            console.error("Failed to delete product:", error);
        } finally {
            setLoading(false);
        }
    };




    // Edit your Products ==========================================
    const handleEdit = async (productId) => {
        setSelectedProductId(productId);
        console.log(productId);
        setIsEditing(true);
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/${productId}`);
        if (response.ok) {
            const product = await response.json();
            setFormData({
                productId: product.productId,
                name: product.name,
                price: product.price,
                purchase: product.purchase,
                stock: product.stock,
            });
        } else {
            console.error("Failed to fetch product details");
        }
    };




    // Update your Products ==========================================
    const handleUpdate = async (event) => {

        event.preventDefault()

        try {
            // setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/products/update/${selectedProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            // Optionally, refetch the products list here
            setRefreshTrigger(prev => !prev)
        } catch (error) {
            console.error("Failed to update product:", error);
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };





    useEffect(() => {
        // fetchProducts();
    }, []);




    return (
        <>
            {loading ? <Loader /> :
                <div className='flex flex-col p-4'>

                    <div className='flex justify-between items-center w-[1200px] mx-auto p-12'>
                        <p className='text-4xl text-blue-500 font-semibold'>Your Products</p>

                        <button
                            onClick={() => setRefreshTrigger(!refreshTrigger)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex flex-col items-center mt-6">

                        <div className="">

                            <div className="py-2 inline-block w-[1200px] sm:px-6 lg:px-8">


                                <div className="overflow-hidden border-b bg-white p-4 custom-shadow rounded-lg border-gray-200 sm:rounded-lg">


                                    <div className="grid table-grid py-2 px-8 gap-[50px]">

                                        <div className="">
                                            <strong>Product ID</strong>
                                        </div>
                                        <div className="">
                                            <strong>Name</strong>
                                        </div>
                                        <div className="">
                                            <strong>Purchase</strong>
                                        </div>
                                        <div className="">
                                            <strong>Retail Price</strong>
                                        </div>
                                        <div className="">
                                            <strong>Profit</strong>
                                        </div>
                                        <div className="">
                                            <strong>Stock</strong>
                                        </div>
                                        <div className="flex justify-center">
                                            <strong>Action</strong>
                                        </div>
                                    </div>


                                    {products.map((product, index) => (
                                        <div key={index} className="grid table-grid items-center py-2 px-8 gap-[50px] mt-6 border-b">
                                            <div className="">
                                                {product.productId}
                                            </div>
                                            <div className="">
                                                {product.name}
                                            </div>
                                            <div className="">
                                                {product.purchase}
                                            </div>
                                            <div className="">
                                                {product.price}
                                            </div>
                                            <div className="">
                                                {product.profit}
                                            </div>
                                            <div className="">
                                                {product.stock}
                                            </div>
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => handleDelete(product._id)} disabled={loading}>
                                                    <MdDelete className='text-red-500' />
                                                </button>
                                                <button onClick={() => handleEdit(product._id)} disabled={loading}>
                                                    <FaEdit className='text-blue-500' />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>





                    {isEditing && (
                        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                            <div className="min-h-screen pt-20 px-4 pb-40 text-center sm:block sm:p-0">

                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                <form
                                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[700px] "
                                    onSubmit={handleUpdate}
                                >
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h3 className="text-2xl leading-6 mb-5 font-medium text-gray-700" id="modal-title">
                                            Edit Product
                                        </h3>


                                        <section>

                                            <div className='flex gap-7 flex-row items-center justify-center'>
                                                <div className="mt-4">
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">ProductId</label>
                                                    <input
                                                        type="text"
                                                        className={`outline-none border-none bg-lighter w-[270px] mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                                        name="productId"
                                                        id="productId"
                                                        value={formData.productId}
                                                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                                    />
                                                </div>


                                                <div className="mt-4">
                                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>

                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        value={formData.name || ''}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className={`outline-none border-none bg-lighter w-[270px] mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                                    />
                                                </div>
                                            </div>



                                            <div className='flex gap-7 flex-row items-center justify-center'>
                                                <div className="mt-4">
                                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Retail Price</label>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        value={formData.price || ''}
                                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                        className={`outline-none border-none bg-lighter w-[270px]  mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                                    />
                                                </div>


                                                <div className="mt-4">
                                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                                                    <input
                                                        type="number"
                                                        name="stock"
                                                        id="stock"
                                                        value={formData.stock || ''} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                        className={`outline-none border-none bg-lighter w-[270px]  mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                                    />
                                                </div>
                                            </div>


                                            <div className='flex items-center justify-start'>
                                                <div className="mt-4 ml-11">
                                                    <label htmlFor="purchase" className="block text-sm font-medium text-gray-700">Purchase Price</label>
                                                    <input
                                                        type="number"
                                                        name="purchase"
                                                        id="purchase"
                                                        value={formData.purchase || ''}
                                                        onChange={(e) => setFormData({ ...formData, purchase: parseFloat(e.target.value) })}
                                                        className={`outline-none border-none bg-lighter w-[270px]  mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                                    />
                                                </div>

                                            </div>


                                        </section>
                                    </div>



                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 gap-4 sm:flex sm:flex-row-reverse">

                                        <button
                                            type="submit"
                                            className="w-[125px] bg-orange-500 hover:bg-orange-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                        >
                                            Update
                                        </button>

                                        <button type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="w-[125px] bg-blue-500 hover:bg-blue-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}



                </div>
            }
        </>
    );
}



