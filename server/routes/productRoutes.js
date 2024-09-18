const express = require('express')

const router = express.Router()

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts
} = require('../controllers/productControllers')


router.get('/all')

//Create product
router.post('/create', createProduct)

// Get all products
router.get('/', getAllProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product by ID
router.put('/update/:id', updateProduct);

// Delete a product by ID
router.delete('/delete/:id', deleteProduct);

// Search a product 
router.post('/search', searchProducts);


module.exports = router



