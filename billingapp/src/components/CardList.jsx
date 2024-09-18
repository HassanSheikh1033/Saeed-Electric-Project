import React from 'react';
import { FaFileInvoice } from 'react-icons/fa';



const CardList = ({ cards }) => {

  return (
    <div className='px-[45px] flex justify-between items-center'>
      {cards.map((card, index) => (
        <div key={index} className='flex items-center gap-5 p-4 w-[325px] h-[125px] bg-white rounded-md custom-shadow hover:shadow-lg'>
          <div className={`bg-green-600 flex items-center rounded-md justify-center h-[50px] w-[50px]`}>
            <FaFileInvoice className='text-white w-7 h-7' />
          </div>
          <div className='flex flex-col'>
            <p className='text-xl'>{card.title}</p>
            <div className='flex items-center gap-10'>
              <p>{card.value}</p>
              <hr className={`border-${card.type}-600 border-2 w-[125px] my-4`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;