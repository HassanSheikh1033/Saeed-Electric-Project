import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";
import Loader from '../components/Loader'
import Invoice from './Invoice';


export default function AddInvoice() {

    const [invoice, setInvoice] = useState(false)
    const [loading, setLoading] = useState(true)
    const [popup, setPopup] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false)
    const [discount, setDiscount] = useState(0)



    const [productData, setProductData] = useState({
        productId: '',
        quantity: 0
    })


    const changleHandler = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value })
    }


    useEffect(() => {

        const fetchLatest = async () => {

            // setLoading(true)

            const response = await fetch('http://localhost:4000/api/receipt/single/latest')

            const json = await response.json()

            if (response.ok) {
                setInvoice(json)
                setLoading(false)
            } else {
                // toast.error('Error fetching project')
                setLoading(false)
            }

        }

        fetchLatest()

    }, [refreshTrigger])



    const submitHandler = async (e) => {

        e.preventDefault()

        const response = await fetch(`http://localhost:4000/api/receipt/addproduct/${invoice._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        })

        const json = await response.json()

        if (response.ok) {
            toast.success('Product Added')
            setRefreshTrigger(!refreshTrigger)
            setProductData({
                productId: '',
                quantity: 0
            })
        } else {
            toast.error(json.message)
        }

    }



    //Creation of new invoice============================================================

    //New Invoice Data
    const [newInvoice, setNewInvoice] = useState({
        customerName: '',
        customerPhone: ''
    })



    //Handle Change Data
    const handleNewInvoiceChange = (e) => {
        const { name, value } = e.target

        setNewInvoice({ ...newInvoice, [name]: value })
    }



    //Creating new invoice
    const createNewInvoice = async (e) => {
        e.preventDefault()

        const response = await fetch('http://localhost:4000/api/receipt/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newInvoice)
        })

        const json = await response.json()

        if (response.ok) {
            toast.success('Invoice Created')
            setRefreshTrigger(!refreshTrigger)
            setPopup(false)
            setNewInvoice({
                customerName: '',
                customerPhone: ''
            })
        } else {
            toast.error(json.message)
        }
    }




    //Delete product from invoice ===========================================
    const handleDelete = async (productId) => {
        const response = await fetch(`http://localhost:4000/api/receipt/removeproduct/${invoice._id}/${productId}`, {
            method: 'DELETE',
        });

        const json = await response.json();

        if (response.ok) {
            toast.success('Product Removed')
            setRefreshTrigger(!refreshTrigger)
        } else {
            toast.error(json.message)
        }
    };



    //Handling discount of invoice==========================================
    useEffect(() => {
        setDiscount(invoice && invoice.discount)
    }, [invoice])


    const discountChange = async (e) => {
        setDiscount(e.target.value)
    }

    useEffect(() => {
        console.log(discount)
    }, [discount])


    //update discount======================================================
    const updateDiscount = async (e) => {

        e.preventDefault()


        const response = await fetch(`http://localhost:4000/api/receipt/adddiscount/${invoice._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ discount })
        })

        const json = await response.json()

        if (response.ok) {
            toast.success('Discount Added')
            setRefreshTrigger(!refreshTrigger)
        } else {
            toast.error(json.message)
        }
    }


    //Updating payment status=============================================
    const updatePaymentStatus = async () => {

        const response = await fetch(`http://localhost:4000/api/receipt/updatepayment/${invoice._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json()

        if (response.ok) {
            toast.success('Payment Status Updated')
            setRefreshTrigger(!refreshTrigger)
        } else {
            toast.error(json.message)
        }
    }


    // const handlePrint = () => {
    //     if (!invoiceRef.current) return;

    //     window.electron.print();
    // };

    const invoiceRef = useRef(null)


    const handlePrint = () => {
        if (!invoiceRef.current) return;

        // Create an iframe
        const printIframe = document.createElement('iframe');
        printIframe.style.display = 'none'; // Hide the iframe
        document.body.appendChild(printIframe);

        // Write the invoice content to the iframe
        const printDocument = printIframe.contentDocument || printIframe.contentWindow.document;
        printDocument.open();
        printDocument.write('<html><head><title>Print Invoice</title>');

        // Copy styles to the iframe
        Array.from(document.styleSheets).forEach((styleSheet) => {
            if (styleSheet.href) {
                printDocument.write(`<link rel="stylesheet" href="${styleSheet.href}">`);
            } else if (styleSheet.cssRules) {
                const newStyleEl = document.createElement('style');
                Array.from(styleSheet.cssRules).forEach((cssRule) => {
                    newStyleEl.appendChild(document.createTextNode(cssRule.cssText));
                });
                printDocument.write(newStyleEl.outerHTML);
            }
        });

        printDocument.write('</head><body>');
        printDocument.write(invoiceRef.current.outerHTML);
        printDocument.write('</body></html>');
        printDocument.close();

        // Trigger the print dialog
        printIframe.contentWindow.print();

        // Clean up by removing the iframe
        setTimeout(() => {
            document.body.removeChild(printIframe);
        }, 500); // Adjust the timeout as needed
    };




    return (
        <>
            {loading ?
                <Loader />
                :
                <main className=''>

                    <section className='flex p-5 ml-5 '>

                        <form
                            className='bg-white p-11 flex-basis2 border-4 border-double border-gray-200 rounded-xl custom-shadow flex flex-col gap-[125px]'
                            onSubmit={submitHandler}
                        >

                            <div className='flex flex-col  items-center justify-end gap-3'>
                                <p className='text-2xl font-semibold mb-4'>Add Product</p>
                                <div
                                    className="flex-[1] flex-row flex items-center gap-2"
                                >
                                    <label className="text-[21px]">Id</label><br />
                                    <input
                                        type="text"
                                        placeholder="product-123"
                                        className={`outline-none border-none bg-lighter w-[230px] mt-2 py-3 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                        name="productId"
                                        value={productData.productId}
                                        onChange={changleHandler}
                                    />
                                </div>

                                <div
                                    className="flex-[1]  flex-row flex items-center gap-2 mt-5"
                                >
                                    <label className="text-[21px]">Qty</label><br />
                                    <input
                                        type="number"
                                        placeholder="50"
                                        className={`outline-none border-none bg-lighter w-[230px] mt-2 py-3 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                        name="quantity"
                                        value={productData.quantity}
                                        onChange={changleHandler}
                                    />
                                </div>
                            </div>

                            <div
                                className="flex-[1] flex justify-end mt-[35px] items-end"
                            >
                                <button
                                    className="w-[200px] bg-orange-500  hover:bg-orange-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-lg font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                    type='submit'
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>



                        <div className='flex flex-col flex-basis1 items-center'>


                            <div className="py-2 inline-block w-[1025px] sm:px-6 lg:px-8">

                                <div
                                    className="overflow-y-scroll border-4 min-h-[325px] max-h-[325px] border-double p-4 custom-shadow rounded-lg border-gray-200 sm:rounded-lg  pl-10"
                                >
                                    <div className="grid add-invoice-grid gap-4">
                                        <div className="">
                                            <strong>Product ID</strong>
                                        </div>
                                        <div className="">
                                            <strong>Name</strong>
                                        </div>
                                        <div className="">
                                            <strong>Price</strong>
                                        </div>
                                        <div className="">
                                            <strong>Quantity</strong>
                                        </div>
                                        <div className="">
                                            <strong>Total</strong>
                                        </div>
                                        <div className="">
                                            <strong>Profit</strong>
                                        </div>
                                        <div className="">
                                            <strong>Action</strong>
                                        </div>
                                    </div>


                                    {invoice?.products?.map((item, index) => (
                                        <div key={index} className="grid add-invoice-grid gap-4 mt-6">
                                            <div className="">
                                                {item.product.productId}
                                            </div>
                                            <div className=" ">
                                                {item.product.name}
                                            </div>
                                            <div className="">
                                                {item.product.price}
                                            </div>
                                            <div className="">
                                                {item.quantity}
                                            </div>
                                            <div className=" ">
                                                {item.total}
                                            </div>
                                            <div className=" ">
                                                {item.profit}
                                            </div>
                                            <div onClick={() => handleDelete(item.product.productId)}
                                                className=" hover:cursor-pointer pl-4"
                                            >
                                                <MdDelete className='text-red-500' />
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>



                            <div
                                className='flex bg-white p-8 w-[965px] border-4 border-double border-gray-200 rounded-xl custom-shadow'
                            >

                                <div className=''>
                                    <div className='grid grid-cols-2 gap-5 ml-[450px] my-4'>

                                        <div className='flex justify-between items-center gap-3'>
                                            <p className=' text-[18px] font-semibold'>Sub Total Price:</p>

                                            <small className={`bg-lighter text-center text-[14px] rounded-lg py-2 px-4`}>
                                                {invoice?.subTotal}
                                            </small>

                                        </div>


                                        <div className='flex items-center justify-between gap-14'>

                                            <p className=' text-[18px] font-semibold'>Discount:</p>

                                            <form
                                                onSubmit={updateDiscount}
                                            >

                                                <input
                                                    className={`bg-lighter text-center text-[14px] rounded-lg py-2 px-1 w-[70px]`}
                                                    value={discount}
                                                    onChange={discountChange}
                                                    type='number'
                                                />

                                            </form>


                                        </div>

                                        <div className='flex items-center justify-between gap-11'>
                                            <p className=' text-[18px] font-semibold'>Total Price:</p>
                                            <small className={`bg-lighter text-center text-[14px] rounded-lg py-2 px-4`}>{invoice?.total}</small>
                                        </div>

                                        <div className='flex items-center justify-between gap-11'>
                                            <p className=' text-[18px] font-semibold'>Total Profit:</p>
                                            <small className={`bg-lighter text-center text-[14px] rounded-lg py-2 px-4`}>{invoice?.totalProfit}</small>
                                        </div>
                                    </div>



                                    <div className='flex items-center justify-start gap-4'>

                                        <button
                                            onClick={() => setPopup(true)}
                                            className="w-[155px] bg-orange-500 hover:bg-orange-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                        >
                                            New Bill
                                        </button>


                                        <div>
                                            <button
                                                className="w-[155px] bg-blue-500 hover:bg-blue-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                                onClick={handlePrint}
                                            >
                                                Print Invoice
                                            </button>

                                            <div ref={invoiceRef} className='test'>
                                                <Invoice invoice={invoice} />
                                            </div>


                                        </div>


                                        <button
                                            className={`w-[155px] ${invoice?.paid ? 'bg-green-500 cursor-not-allowed' : 'bg-red-500'} text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300`}
                                            disabled={invoice?.paid}
                                            onClick={updatePaymentStatus}
                                        >
                                            {invoice?.paid ? 'Paid' : 'Unpaid'}
                                        </button>
                                    </div>


                                </div>



                            </div>

                        </div>
                    </section>



                    {popup &&
                        <section className='bg-black/50 w-full h-screen absolute top-0 left-0 flex justify-center items-center'>

                            <form
                                className='bg-white w-[700px] rounded-xl overflow-hidden pt-10'
                                onSubmit={createNewInvoice}
                            >
                                <div className='px-10'>
                                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                                    <input
                                        type="text"
                                        className={`outline-none border-none bg-lighter w-[500px] mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                        name="customerName"
                                        placeholder="Enter Customer's Name"
                                        value={newInvoice.customerName}
                                        onChange={handleNewInvoiceChange}
                                    />
                                </div>

                                <div className='mt-4 px-10'>
                                    <label className="block text-sm font-medium text-gray-700">Phone No</label>
                                    <input
                                        type="text"
                                        className={`outline-none border-none bg-lighter w-[500px] mt-2 py-4 pl-6 pr-2 rounded-tl-[10px] rounded-tr-[40px] rounded-bl-[40px] rounded-br-[10px]`}
                                        name="customerPhone"
                                        placeholder='Enter Phone No'
                                        value={newInvoice.customerPhone}
                                        onChange={handleNewInvoiceChange}
                                    />
                                </div>


                                <div className='bg-gray-50 mt-10 flex justify-end gap-4 px-6 py-6'>
                                    <div onClick={() => setPopup(false)}
                                        className="w-[150px] bg-orange-500 hover:bg-orange-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300 cursor-pointer"
                                    >
                                        Cancel
                                    </div>

                                    <button
                                        type='submit'
                                        className="w-[150px] bg-blue-500 hover:bg-blue-700 text-white font-medium py-[10px] rounded-tl-[10px] rounded-br-[10px] rounded-tr-[40px] rounded-bl-[40px] inline-flex justify-center items-center text-[15px] font-Poppins  hover:scale-[1.01] active:scale-90 transition-all duration-300"
                                    >
                                        Create Invoice
                                    </button>
                                </div>
                            </form>
                        </section>
                    }
                </main>
            }
        </>
    )
}


