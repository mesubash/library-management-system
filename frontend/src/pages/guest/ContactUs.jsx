import React from "react";
export default function ContactUs() {
    const [formData, setFormData] = React.useState({
      name: '',
      email: '',
      message: '',
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Placeholder for form submission logic (e.g., API call)
      console.log('Form submitted:', formData);
      alert('Thank you for your message! We’ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    };
  
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-green-400">
          Contact Us
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg dark:text-white mb-2">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have questions about our library services or need assistance? Reach out to us—we’re here to help!
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>📧 Email: support@librarysystem.com</li>
              <li>📞 Phone: (123) 456-7890</li>
              <li>🏛️ Address: 123 Library Lane, Booktown</li>
            </ul>
            <span className="inline-block mt-4 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Available 9 AM - 5 PM
            </span>
          </div>
  
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-lg dark:text-white mb-2">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-600 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-600 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-600 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-400"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-green-600 dark:hover:bg-green-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }