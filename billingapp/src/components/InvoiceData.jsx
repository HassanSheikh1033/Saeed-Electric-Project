import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

const InvoiceData = () => {


    const [isLoading, setIsLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);

    const { id } = useParams()


    useEffect(() => {

        const fetchData = async () => {

            setIsLoading(true);

            try {
                const response = await fetch(`http://localhost:4000/api/receipt/${id}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setInvoice(data);
                setIsLoading(false);

            } catch (error) {

                console.error("There has been a problem with your fetch operation:", error);
                toast.error('Error Fetching Data');
                setIsLoading(false);
            }
        };

        fetchData(); // Call the fetch function
    }, [id]); // Re-run effect if the id changes

    if (isLoading) {
        return <Loader />;
    }



    return (
        <main className='my-10'>

            <section className='w-[1000px] mx-auto'>

                <div className='flex justify-between items-center'>
                    <h1 className='text-4xl text-center font-bold my-5'>Invoice Data</h1>

                    <div
                        className={`text-xl font-semibold rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] ${invoice.paid ? 'bg-green-500' : 'bg-red-500'} min-w-[250px] text-white inline-flex items-center justify-center py-2`}
                    >
                        {invoice.paid ? 'Paid' : 'Unpaid'}
                    </div>
                </div>

                <div className='mb-10 mt-16 flex gap-20 justify-between'>
                    <h3
                        className='text-xl font-semibold'
                    >
                        Name: {invoice.customer.name}</h3>
                    <h3
                        className='text-xl font-semibold'
                    >
                        Phone: {invoice.customer.phoneNo}</h3>
                    <h3
                        className='text-xl font-semibold'
                    >
                        Date: {invoice.date.split('T')[0]}</h3>
                </div>

            </section>

            <section
                className="border-4 border-double py-6 px-12 custom-shadow rounded-lg border-gray-200 sm:rounded-lg w-[1000px] mx-auto max-h-[320px] overflow-y-scroll"
            >
                <div className="grid gap-4 invoice-data-grid">
                    <div className=""><strong>Product ID</strong></div>
                    <div className=""><strong>Name</strong></div>
                    <div className=""><strong>Price</strong></div>
                    <div className=""><strong>Quantity</strong></div>
                    <div className=""><strong>Total</strong></div>
                </div>

                {invoice?.products?.map((item, index) => (
                    <div key={index} className="grid gap-4 mt-10 invoice-data-grid">
                        <div className="">{item.product.productId}</div>
                        <div className="">{item.product.name}</div>
                        <div className="">{item.product.price}</div>
                        <div className="">{item.quantity}</div>
                        <div className="">{item.total}</div>
                    </div>
                ))}
            </section>

            <section className='w-[1000px] h-[50px] items-center custom-shadow mx-auto my-10 px-12 flex justify-between'>
                <h3 className='text-xl font-semibold'>Subtotal: {invoice.subTotal}</h3>
                <h3 className='text-xl font-semibold'>Discount: {invoice.discount}</h3>
                <h3 className='text-xl font-semibold'>Total: {invoice.total}</h3>
            </section>

        </main>
    );
};

export default InvoiceData;
