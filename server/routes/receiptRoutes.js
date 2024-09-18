const express = require('express')

const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getLatestInvoice,
    updateReceiptWithProducts,
    removeProductFromReceipt,
    applyDiscountToReceipt,
    updatePaymentStatus,
    sortReceiptsByDate
} = require('../controllers/receiptControllers')

const router = express.Router()


//Getting all invoices
router.get('/all', getAllInvoices)


//Getting signle invoice
router.get('/:id', getInvoiceById)


//Getting all invoices
router.get('/single/latest', getLatestInvoice)


//Creating Invoice
router.post('/create', createInvoice)


//Adding Products in the receipt
router.patch('/addproduct/:id', updateReceiptWithProducts)


//Removing product from receipt
router.delete('/removeproduct/:receiptId/:productId', removeProductFromReceipt);


//Adding Discount
router.patch('/adddiscount/:id', applyDiscountToReceipt)



//update Payment 
router.patch('/updatepayment/:id', updatePaymentStatus)


//date sorting
router.post('/getreceiptdate/getall', sortReceiptsByDate)

module.exports = router