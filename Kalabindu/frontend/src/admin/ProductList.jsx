import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";


export default function ProductList() {
    const [products, setProducts] = useState([]);

    // const loadProducts = async ()=>{
    //     const response = await api.get("/products");
    //     setProducts(response.data);
    // }

    const loadProducts = async () => {
        try {
            const response = await api.get("/products");
            // Access the specific key holding the array
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    }


    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/delete/${id}`);
            alert("Product Deleted Successfully");
            loadProducts();
        } catch (error) {
            console.log("Error deleting product:", error);

        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product List</h2>
                <Link to="/admin/products/add" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Add New Product</Link>

            </div>
            <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-200 px-4 py-2" >Title</th>
                        <th className="border border-gray-200 px-4 py-2" >Price</th>
                        <th className="border border-gray-200 px-4 py-2" >Stock</th>
                        <th className="border border-gray-200 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product) => (
                            <tr key={product._id} className="border-b border-gray-200">
                                <td className="border border-gray-200 px-4 py-2">{product.title}</td>
                                <td className="border border-gray-200 px-4 py-2">${product.price}</td>
                                <td className="border-gray-200 px-4 py-2">{product.stock}</td>
                                <td className="border-gray-200 px-4 py-2   ">
                                    <Link to={`/admin/products/update/${product._id}`} className="text-blue-500 hover:text-blue-600 px-4 py-2 pr-30">Edit</Link>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-red-500 hover:text-red-600 px-4 py-2  ">Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )

}