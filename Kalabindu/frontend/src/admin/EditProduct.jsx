import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";


export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });

    const allowedFields = ["title", "description", "price", "category", "image", "stock"];

    const loadProduct = async () => {
        const res = await api.get(`/products`);
        // Robust data extraction for the product list
        const productsArray = res.data.products || (Array.isArray(res.data) ? res.data : []);
        const product = productsArray.find((p) => p._id === id);
        if (product) setForm(product);
    }


    useEffect(() => {
        loadProduct();

    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.put(`/products/update/${form._id}`, form);
        alert("Product Updated Successfully");
        navigate("/admin/products");
    }

    return (
        <div className=" max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded-2xl ">
            <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {
                    allowedFields.map((key) => (
                        <input
                            key={key}
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key}
                            className="w-full p-2 border-gray-300 rounded-2xl"
                        />
                    ))
                }

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ">Edit Product</button>

            </form>


        </div>
    )
}