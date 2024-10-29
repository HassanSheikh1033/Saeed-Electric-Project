import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DateFilterForm from "./DateFilterForm";
import Loader from "./Loader";


const InvoiceGrid = () => {

  const [invoices, setInvoices] = useState([]);
  const [totalSales, setTotalSales] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  // Set startDate to the first day of the current month
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0].replace(/\d{2}$/, '01'));

  // Set endDate to the current date
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);


  // Getting all the Invoices ==================================================
  useEffect(() => {

    const fetchInvoices = async () => {

      const start = new Date().toISOString().split("T")[0].replace(/\d{2}$/, '01')
      const end = new Date().toISOString().split("T")[0]

      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/receipt/getreceiptdate/getall`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ startDate: start, endDate: end })
        });
        if (!response.ok) {
          throw new Error('Failed to Fetch');
        }

        const data = await response.json();
        setInvoices(data);

        setTotalSales(data.reduce((total, invoice) => total + invoice.total, 0))

        setTotalProfit(data.reduce((total, invoice) => total + invoice.totalProfit, 0))

        setIsLoading(false);

      } catch (error) {
        console.error('Failed to Fetch:', error);
      }
    };

    fetchInvoices();

  }, [refreshTrigger]);




  //Converting date format
  const formatDate = (dateString) => {
    const months = [
      "Jan", "Feb", "March", "April", "May", "June",
      "July", "August", "Sept", "Oct", "Nov", "Dec"
    ];

    // Convert the input string to a Date object
    const date = new Date(dateString);

    // Extract components of the date
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    // Construct and return the formatted date string
    return `${month} ${day}, ${year}`;
  }


  //Updating payment status
  const updatePaymentStatus = async (invoiceId) => {

    const response = await fetch(`http://localhost:4000/api/receipt/updatepayment/${invoiceId}`, {
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



  //Sorting receipts according to date.
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  }


  //Handling date filters=====================
  const handleSubmit = async (event) => {

    event.preventDefault();

    const response = await fetch('http://localhost:4000/api/receipt/getreceiptdate/getall', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ startDate, endDate })
    });


    const data = await response.json();

    if (response.ok) {

      setInvoices(data);
      setTotalSales(data.reduce((total, invoice) => total + invoice.total, 0))
      setTotalProfit(data.reduce((total, invoice) => total + invoice.totalProfit, 0))
      
      toast.success('Filtered applied successfully');

    } else {
      toast.error('Failed to fetch filtered invoices');
    }
  }



  return (
    <>
      {isLoading ? <Loader /> :
        <main className="flex flex-col">

          {/* <DateFilterForm /> */}

          <section className="w-[1300px] px-4 mx-auto flex justify-between items-center my-8">


            <div className="space-y-2">
              <h1 className="font-semibold text-lg text-zinc-600">
                Total Sales: {totalSales}
              </h1>

              <h1 className="font-semibold text-lg text-zinc-600">
                Total Profit: {totalProfit}
              </h1>
            </div>

            <form
              className='flex gap-16 items-end'
              onSubmit={handleSubmit}
            >

              <div>
                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-600">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-600">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>


              <div className=''>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 mb-[0px] text-white font-bold py-2 px-4 rounded"
                >
                  Filter
                </button>
              </div>


            </form>


          </section>



          <section
            className="overflow-hidden border-b p-4 custom-shadow rounded-lg border-gray-200 sm:rounded-lg w-[1300px] mx-auto"
          >


            {/* Header Row */}
            <div className="grid grid-cols-10 px-10 gap-[40px] invoice-grid">
              <div className="">
                <strong>Invoice ID</strong>
              </div>
              <div className="">
                <strong>Customer Name</strong>
              </div>
              <div className="">
                <strong>Phone-No</strong>
              </div>
              <div className="">
                <strong>Amount</strong>
              </div>
              <div className="">
                <strong>Discount</strong>
              </div>
              <div className="">
                <strong>Profit</strong>
              </div>
              <div className="">
                <strong>Date</strong>
              </div>
              <div className="">
                <strong>Status</strong>
              </div>
              <div className="">
                <strong>Action</strong>
              </div>
            </div>


            {/* Invoice Items */}
            {invoices.map((invoice, index) => (
              <div key={index} className="grid grid-cols-10 px-10 gap-[40px] mt-6 invoice-grid items-center">
                <div className="">
                  {index + 1}
                </div>
                <div className="">
                  {invoice.customer.name}
                </div>
                <div className="">
                  {invoice.customer.phoneNo}
                </div>
                <div className="">
                  {invoice.total}
                </div>
                <div className="">
                  {invoice.discount}
                </div>
                <div className="">
                  {invoice.totalProfit}
                </div>
                <div className="">
                  {formatDate(invoice.date)}
                </div>

                <div
                  className={`${invoice.paid ? 'bg-green-500 cursor-not-allowed' : 'bg-red-500 cursor-pointer'} text-white font-bold w-fit py-2 px-4 rounded`}
                  onClick={() => updatePaymentStatus(invoice._id)}
                  disabled={invoice.paid}
                >
                  {invoice.paid ? 'Paid' : 'Unpaid'}
                </div>

                <div className="">
                  <Link
                    to={`/view-invoice/${invoice._id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </Link>
                </div>

              </div>
            ))}


          </section>



        </main>
      }
    </>
  );
};



export default InvoiceGrid;


