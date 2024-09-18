import React from 'react'
import CardList from './CardList';
import InvoiceGrid from './InvoiceGrid';
import { Link } from "react-router-dom";

export default function Dashboard() {


    const cardsData = [
        { type: 'green', title: 'Total Invoice', value: '2240' },
        { type: 'yellow', title: 'Total Invoice', value: '2240' },
        { type: 'green', title: 'Total Invoice', value: '2240' },
    ];


    return (
        <div className='flex flex-col p-4'>
            <div className='flex justify-between items-center py-12 w-[1300px] mx-auto'>
                <p className='text-5xl text-blue-500 font-semibold'>Overview</p>
                {/* <Link to={'/'} className=' bg-green-500 text-white text-[17px] p-3 hover:bg-green-600 rounded-lg'>Create Invoice</Link> */}
            </div>

            {/* <CardList cards={cardsData} /> */}


            <InvoiceGrid />
        </div>
    )
}


