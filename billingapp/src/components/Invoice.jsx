// Invoice.js
import React from 'react';

const Invoice = ({ invoice }) => {
  if (!invoice) return <div>Loading...</div>;


  

  return (
    <div className="invoice-container">
      <div className="invoice-header flex justify-between items-center">
        <p>Customer Name: {invoice.customer.name}</p>
        <p>Phone: {invoice.customer.phoneNo}</p>
        <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
      </div>
      
      <div className="invoice-body">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((item, index) => (
              <tr key={index}>
                <td>{item.product.productId}</td>
                <td>{item.product.name}</td>
                <td>{item.product.price}</td>
                <td>{item.quantity}</td>
                <td>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="invoice-footer flex flex-col items-end">
        <p className='flex justify-between w-[200px]'>Subtotal: <span>{invoice.subTotal}</span></p>
        <p className='flex justify-between w-[200px]'>Discount: <span>{invoice.discount}</span></p>
        <p className='flex justify-between w-[200px]'>Total: <span>{invoice.total}</span></p>
        <p className='flex justify-between w-[200px]'>Payment: <span>{invoice.paid ? 'Paid' : 'Pending'}</span></p>
      </div>
    </div>
  );
};

export default Invoice;
