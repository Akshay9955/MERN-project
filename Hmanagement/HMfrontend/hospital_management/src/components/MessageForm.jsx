import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

// Use Vite environment variable for backend URL (fallback to relative API path for dev proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();

    // Always use relative path to go through Vite proxy
    const url = "/api/v1/message/send";

    try {
      const res = await axios.post(
        url,
        { firstName, lastName, email, phone, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data?.message || "Message sent successfully.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send message. Please try again.";
      toast.error(message);
    }
  };

  return (
    <>
      <div className="container form-component message-form">
        <h2>Send Us A Message</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <textarea
            rows={7}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Send</button>
          </div>
        </form>
        <img src="/Vector.png" alt="vector" />
      </div>
    </>
  );
};

export default MessageForm;