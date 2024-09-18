import React, { useState } from 'react';

const DateFilterForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct the URL with query parameters
        const url = `mongodb://localhost:27017/api/receipt/getreceiptdate/getall?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Process the received data as needed
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };





    return (
        <div className="px-4">
            <div className="flex justify-center ml-[770px] items-center my-8">
                <form
                    className='flex gap-16 relative'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-600">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-600">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>

                   <div className='absolute top-8 left-[424px]'>
                   <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 mb-[25px] text-white font-bold py-2 px-4 rounded"
                    >
                        Filter
                    </button>
                   </div>
                </form>
            </div>
        </div>

    );
};


export default DateFilterForm;



