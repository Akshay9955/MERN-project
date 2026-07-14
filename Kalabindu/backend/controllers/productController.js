// 1. Fix: Only import the model ONCE. Use "Product" (singular).
import Product from "../models/Products.js";

// Create a new product
export const createProduct = async (req, res) => {
    try {
         // 2. Fix: Lowercase the variable holding the single product data
         const newProduct = await Product.create(req.body);
         res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
         });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get all products
export const getProducts = async (req, res) => {
    try {
          const {search, category}= req.query;
          let filter ={};
          if(search){
            filter.title = {$regex: search, $options: "i"};  //case-insensitive search on title
          }
          if(category){
            filter.category = category;
          }

        const allProducts = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Products fetched successfully",
            products: allProducts,
        });

    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
};

//Update a product

export const updateProduct = async (req,res)=>{
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({
            message: "Product updated successfully",
            product: updated,
        });



    } catch (error) {
         res.status(500).json({message: "Server error", error: error.message});
    }
}


//Delete a product

export const deleteProduct = async (req,res)=>{
    try {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Product deleted successfully",
            product: deleteProduct,
        });

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    
    }
}