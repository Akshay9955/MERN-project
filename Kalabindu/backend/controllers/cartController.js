


import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

//Add item to cart

export const addToCart = async (req,res)=>{
    // try {
    //     const {userId, productId, pricePerUnit} =req.body;
    //     let cart = await Cart.findOne({userId});
    //     if(!cart){
    //         cart = await Cart.create({
    //             userId,
    //             items:[{
    //                 productId,
    //                 quantity: 1,
    //                 pricePerUnit
    //             }]
    //         });
    //     }else{
    //         const item = cart.items.find(
    //             i => i.productId.toString() === productId.toString()
    //         )

    //          if(item){
    //         item.quantity++;
    //     }else{
    //         cart.items.push({
    //             productId,
    //             quantity: 1,
    //             pricePerUnit
    //         });
    //     }

    //     }

    //     await cart.save();
    //     res.json({
    //         message: "Item added to cart successfully",
    //         cart
    //     })

        
    // } catch (error) {
    //     res.status(500).json({message: "Server error", error: error.message});
    
    // }

    try {
        const { productId } = req.body;
        const userId = req.user.id; // Get userId from authenticated token
        
        // Fetch product to retrieve current unit price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 1. Find an existing cart
        let cart = await Cart.findOne({ userId });
        
        // 2. If no cart exists, initialize a new instance (DO NOT use Cart.create here)
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // 3. Search for the product within the items array
        const item = cart.items.find(
            i => i.productId.toString() === productId.toString()
        );

        // 4. Update quantity or push a new item object
        if (item) {
            item.quantity++;
        } else {
            cart.items.push({
                productId,
                quantity: 1,
                pricePerUnit: product.price
            });
        }

        // 5. This single save triggers the pre-save middleware for BOTH new and existing carts!
        await cart.save();
        
        res.json({
            message: "Item added to cart successfully",
            cart
        });
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//Remove item from cart

export const removeItem = async(req, res) =>{
    try {
          const {productId} = req.body;
          const userId = req.user.id; // Get userId from authenticated token
          const cart = await Cart.findOne({userId});
          if(!cart){
            return res.status(404).json({message: "Cart not found"});
          }

          cart.items = cart.items.filter(
            item => item.productId.toString() !== productId.toString()
          );
          await cart.save();
          res.json({
            message: "Item removed from cart successfully",
            cart
          })

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    
    }
}


// Update item quantity in cart


export const updateQuantity = async(req, res) =>{
    try {
        const {productId, quantity} = req.body;
        const userId = req.user.id; // Get userId from authenticated token
        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1. Use remove endpoint to delete." });
        }

        const cart = await Cart.findOne({userId});
        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        const item = cart.items.find(
            item => item.productId.toString() === productId.toString()
        );
     
        if(!item){
            return res.status(404).json({message: "Item not found in cart"});
        
        }
        item.quantity = quantity;

        await cart.save();
        res.json({
            message: "Item quantity updated successfully",
            cart
        })

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    
    }
}

// get cart by user ID

// export const getCart = async(req, res) =>{
//     try {userId = req.user.id; // Get userId from authenticated token
//         const {userId}= req.body;
//         const cart = await Cart.findOne({userId}).populate('items.productId');
//         res.json({
//             message: "Cart fetched successfully",
//             cart
//         })

//     } catch (error) {
//         res.status(500).json({message: "Server error", error: error.message});
    
//     }
// }

// Get cart by user token
export const getCart = async (req, res) => {
    try {
        // FIX: Extract userId cleanly from the authenticated route middleware token
        const userId = req.user.id; 
        
        // Find the cart and populate product details
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            return res.json({ message: "Cart is empty", items: [], cartTotal: 0 });
        }

        res.json(cart); // Matches the .data structure your frontend expects
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
