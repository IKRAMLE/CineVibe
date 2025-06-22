import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 min-h-screen">
      <Navbar searchQuery={""} setSearchQuery={() => {}} />
      <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[70vh] mt-5">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-3xl bg-gradient-to-tr from-gray-800 via-gray-900 to-blue-900 rounded-2xl shadow-2xl p-0 md:p-8 overflow-hidden">
          {/* Illustration */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-blue-700 to-blue-400 w-1/3 min-h-full py-12 px-6 ">
            <span className="text-7xl mb-4 animate-bounce">📬</span>
            <h2 className="text-white text-2xl font-bold mb-2">Let's Connect!</h2>
            <p className="text-blue-100 text-center text-sm">We'd love to hear from you.<br />Send us a message!</p>
          </div>
          {/* Form */}
          <div className="flex-1 w-full p-8">
            <h1 className="text-3xl font-bold text-white mb-6 text-center md:text-left">Contact Us</h1>
            <p className="text-gray-300 mb-8 text-center md:text-left max-w-xl">
              Have a question, suggestion, or just want to say hello? Fill out the form below and our team will get back to you as soon as possible.
            </p>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-5xl text-green-400 mb-4">✅</span>
                <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
                <p className="text-gray-300 text-center">Your message has been sent. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent transition-all"
                    placeholder="Name"
                  />
                  <label htmlFor="name" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-400 bg-gradient-to-r from-gray-900 to-transparent px-1">
                    Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent transition-all"
                    placeholder="Email"
                  />
                  <label htmlFor="email" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-400 bg-gradient-to-r from-gray-900 to-transparent px-1">
                    Email
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-transparent transition-all resize-none"
                    placeholder="Message"
                  />
                  <label htmlFor="message" className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-blue-400 bg-gradient-to-r from-gray-900 to-transparent px-1">
                    Message
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all text-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
