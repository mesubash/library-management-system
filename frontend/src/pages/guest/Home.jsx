import { Link } from "react-router-dom";

export default function Home() {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Our Library</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Browse Our Collection</h2>
            <p className="mb-4">
              Explore thousands of books available for all ages and interests.
            </p>
            <Link 
              to="/books"
              className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              View All Books
            </Link>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Member Benefits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Borrow up to 5 books at a time</li>
              <li>Access to premium online resources</li>
              <li>Personalized reading recommendations</li>
            </ul>
            <Link 
              to="/login"
              className="inline-block mt-4 text-primary hover:underline"
            >
              Become a member
            </Link>
          </div>
        </div>
      </div>
    )
  }