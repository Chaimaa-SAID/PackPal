const Product = require('../models/product');

const addProduct = async (req, res) => {
  try {
    const {
        category,
        title,
        description,
        price,
        size,
        color,
        quantity,
        media
    } = req.body;
    
    const findProduct = await Product.findOne({ 
        title: title,
        size: size,
        color: color
    });
    
    if(findProduct){ 
        return res.json({message: "Le produit existe déjà avec la même taille et couleur."})
    }

    const newProduct = new Product({
        category,
        title,
        description,
        price,
        size,
        color,
        quantity,
        media
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(updatedProduct);
} catch (error) {
    res.status(500).json({ message: error.message });
}
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
