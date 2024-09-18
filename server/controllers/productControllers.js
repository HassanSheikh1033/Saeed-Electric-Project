const Product = require('../models/productModel')


//Creating a product
const createProduct = async (req, res) => {

  const { productId, name, price, stock, purchase } = req.body

  try {

    const profit = price - purchase;

    const exists = await Product.findOne({ productId })

    if (exists) {
      throw Error('Product Id shoul d be unique')
    }

    const product = await Product.create({ productId, name, price, stock, purchase, profit })

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}






// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// Update a product by ID
const updateProduct = async (req, res) => {

  const { productId, name, price, description, stock, purchase } = req.body;

  try {

    const profit = price - purchase

    const product = await Product.findByIdAndUpdate(req.params.id, {
      productId, name, price, description, stock,
      purchase, profit
    }, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Search products by name or productId
const searchProducts = async (req, res) => {
  try {
    const { searchTerm } = req.body; // Extracting the search term from the query parameters

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Searching for products where either the name or productId matches the search term
    const results = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search in the name field
        { productId: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search in the productId field
      ],
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, searchProducts
}





