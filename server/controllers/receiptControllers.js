const Receipt = require('../models/receiptModel')
const Product = require('../models/productModel');
const { trusted } = require('mongoose');


//Getting all incvoices
const getAllInvoices = async (req, res) => {
    try {
        const receipts = await Receipt.find({}).sort({ date: -1 });
        res.json(receipts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve invoices." });
    }
};


//Getting invoice by id
const getInvoiceById = async (req, res) => {
    try {
        const receiptId = req.params.id;
        const receipt = await Receipt.findById(receiptId).populate('products.product');
        if (!receipt) {
            return res.status(404).json({ message: "Invoice not found." });
        }
        res.json(receipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve invoice." });
    }
};


//Getting latest invoice
const getLatestInvoice = async (req, res) => {
    try {
        const receipt = await Receipt.findOne().sort({ date: -1 }).populate('products.product')

        if (!receipt) {
            return res.status(404).json({ message: "No invoices found." });
        }
        res.json(receipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


//Creating invoice
const createInvoice = async (req, res) => {
    try {
        const { customerName, customerPhone } = req.body;

        if (!customerName || !customerPhone) {
            return res.status(400).json({ message: "Customer name and phone number are required." });
        }

        const newReceipt = new Receipt({
            customer: {
                name: customerName,
                phoneNo: customerPhone,
            },
            // Initially, the receipt has no products, so we start with an empty array
            products: [],
            // The receipt is not paid initially
            paid: false,
        });

        await newReceipt.save();

        res.status(201).json(newReceipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the invoice." });
    }
};




//Adding products in the incvoice
const updateReceiptWithProducts = async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;

    try {
        // Find the receipt by ID
        const receipt = await Receipt.findById(id).populate('products.product');
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found." });
        }

        // Find the product by ID
        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ message: "Invalid product code." });
        }

        if (product.stock < quantity) {
            return res.status(404).json({ message: "Not Enough Stock" });
        }

        product.stock = product.stock - quantity
        await product.save()

        // Calculate total price for the product
        const totalPrice = quantity * product.price;
        const profit = quantity * product.profit;

        // Prepare the product object to be added to the receipt
        const productToAdd = {
            product: product._id,
            quantity,
            total: totalPrice,
            profit
        };

        // Calculate the subtotal
        const subtotal = receipt.subTotal + totalPrice;
        const total = subtotal - receipt.discount;
        const totalProfit = receipt.totalProfit + profit;
        console.log(totalProfit)

        // Update the receipt with the new product and subtotal
        receipt.products.push(productToAdd);
        receipt.subTotal = subtotal;
        receipt.total = total;
        receipt.totalProfit = totalProfit;


        // Save the updated receipt
        await receipt.save();

        res.status(200).json(receipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update the receipt." });
    }
};






//Removing products from the incvoice
const removeProductFromReceipt = async (req, res) => {
    const { receiptId, productId } = req.params;

    try {
        // Find the receipt by ID
        const receipt = await Receipt.findById(receiptId).populate('products.product');
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found." });
        }

        // Find the product to be removed
        const productToRemoveIndex = receipt.products.findIndex(p => p.product.productId === productId);
        if (productToRemoveIndex === -1) {
            return res.status(404).json({ message: "Product not found in the receipt." });
        }

        // Get the product details from the products array
        const productToRemove = receipt.products[productToRemoveIndex];

        // Calculate the adjustment for the subtotal
        const adjustmentAmount = productToRemove.total;
        const newSubtotal = receipt.subTotal - adjustmentAmount;
        const newTotal = receipt.total - adjustmentAmount;

        // Calculating the new profit
        const newProfit = receipt.totalProfit - productToRemove.profit;

        // Remove the product from the receipt's products array
        receipt.products.splice(productToRemoveIndex, 1);

        // Update the receipt's subtotal
        receipt.subTotal = newSubtotal;
        receipt.total = newTotal;
        receipt.totalProfit = newProfit;

        // Find the product by ID to update its stock
        const product = await Product.findOne({ productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found in the database." });
        }

        // Increase the product's stock by the quantity that was removed
        product.stock += productToRemove.quantity;
        await product.save();

        // Save the updated receipt
        await receipt.save();

        res.status(200).json(receipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove the product from the receipt." });
    }
};


//Applying discount
const applyDiscountToReceipt = async (req, res) => {
    const { id } = req.params;
    const { discount } = req.body;

    try {
        // Find the receipt by ID
        const receipt = await Receipt.findById(id);
        if (!receipt) {
            return res.status(404).json({ message: "Receipt not found." });
        }

        // Ensure the discount is a positive number or zero
        if (discount < 0) {
            return res.status(400).json({ message: "Discount cannot be negative." });
        }

        // Apply the discount to the receipt's total
        const newTotal = receipt.subTotal - discount;
        const newProfit = receipt.totalProfit - discount;

        // Update the receipt's discount and total
        receipt.discount = discount;
        receipt.total = newTotal;
        receipt.totalProfit = newProfit;

        // Save the updated receipt
        await receipt.save();

        res.status(200).json(receipt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to apply discount to the receipt." });
    }
};




// Update the payment system ==================================================
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Extract id from req.params

        // Find the receipt by id
        const existingReceipt = await Receipt.findById(id);
        if (!existingReceipt) {
            return res.status(404).send('Receipt not found.');
        }

        // Update the receipt
        const updatedReceipt = await Receipt.findByIdAndUpdate(
            id,
            { paid: true },
            { new: true } // Return the updated document
        );

        res.send(updatedReceipt);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error occurred while updating payment status.');
    }
};



//Receipt Date sorting========================================
const sortReceiptsByDate = async (req, res) => {
    try {
        // Parse start and end dates from the request body
        let startDate = new Date(req.body.startDate);
        let endDate = new Date(req.body.endDate);

        // Adjust the end date to the end of the day (23:59:59.999)
        endDate.setUTCHours(23, 59, 59, 999);

        console.log('Adjusted Start Date:', startDate.toISOString());
        console.log('Adjusted End Date:', endDate.toISOString());

        // Find receipts within the adjusted date range
        const receipts = await Receipt.find({
            date: {
                $gte: startDate.toISOString(),
                $lt: endDate.toISOString() // Use $lt to exclude the end date itself
            }
        }).sort({ date: -1 });

        console.log('Fetched receipts:', receipts.length); // Log the number of fetched receipts

        res.json(receipts);
    } catch (error) {
        console.error('Error fetching receipts:', error); // Log the error
        res.status(500).json({ message: 'An error occurred while fetching receipts.' });
    }
};




module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    getLatestInvoice,
    updateReceiptWithProducts,
    removeProductFromReceipt,
    applyDiscountToReceipt,
    updatePaymentStatus,
    sortReceiptsByDate
}


