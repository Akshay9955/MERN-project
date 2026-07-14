import Address from "../models/Address.js";


// Save a new address
export const saveAddress = async (req, res) => {
  try {
    const { userId, fullName, phone, address, city, state, pincode, Country } = req.body;

    // Validate required fields
    if (!userId || !fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ 
        success: false, 
        message: "All required fields must be provided." 
      });
    }

    // Create and save the new address
    const newAddress = new Address({
      userId,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      Country
    });

    const savedAddress = await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: savedAddress
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while saving address",
      error: error.message
    });
  }
};

// Get all addresses for a specific user
// export const getAddress = async (req, res) => {
//   try {
//     const { userId } = req.params; // Or req.query, or req.user.id if using auth middleware

//     if (!userId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "User ID is required." 
//       });
//     }

//     // Find all addresses matching the userId
//     const addresses = await Address.find({ userId });

//     return res.status(200).json({
//       success: true,
//       count: addresses.length,
//       data: addresses
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching addresses",
//       error: error.message
//     });
//   }
// };


// Get all addresses for a specific user (Filtering duplicates)
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required." 
      });
    }

    // 1. Fetch all raw documents from the database matching the user
    const allAddresses = await Address.find({ userId }).sort({ createdAt: -1 });

    // 2. ADD THIS FILTER BLOCK: Strip out exact string duplicates before responding
    const uniqueAddresses = allAddresses.filter((addr, index, self) => {
      // Create a unified text block string of the core destination details
      const addressString = `${addr.fullName}-${addr.address}-${addr.city}-${addr.state}-${addr.pincode}`
        .toLowerCase()
        .replace(/\s+/g, ''); // Removes spaces for precise comparison

      // Keep only the first document that generates this unique string fingerprint
      return self.findIndex((a) => {
        const testString = `${a.fullName}-${a.address}-${a.city}-${a.state}-${a.pincode}`
          .toLowerCase()
          .replace(/\s+/g, '');
        return testString === addressString;
      }) === index;
    });

    // 3. CHANGE THIS: Return 'uniqueAddresses' instead of the raw database records
    return res.status(200).json({
      success: true,
      count: uniqueAddresses.length,
      data: uniqueAddresses // Frontend now receives clean data automatically!
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching addresses",
      error: error.message
    });
  }
};
