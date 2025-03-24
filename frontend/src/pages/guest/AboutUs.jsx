
export default function ContactUs() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-green-400">
        Contact Us
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section: Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg dark:text-white mb-2">
            Reach Out to Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Need help finding a book like <em>The Great Gatsby</em> or have a question about our services? We’re here to assist you! Contact us through any of the methods below, and our team will respond promptly.
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-300">
            <li>📧 Email: <a href="mailto:support@librarysystem.com" className="hover:underline">support@librarysystem.com</a></li>
            <li>📞 Phone: (123) 456-7890</li>
            <li>🏛️ Address: 123 Library Lane, Booktown</li>
          </ul>
        </div>

        {/* Right Section: Support & Hours */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg dark:text-white mb-2">
            We’re Here to Help
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our dedicated staff is committed to supporting your reading and research needs. Whether it’s tracking book availability or answering inquiries, we aim to make your library experience seamless and enjoyable.
          </p>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Open Monday - Friday, 9 AM - 5 PM
          </span>
        </div>
      </div>
    </div>
  );
}