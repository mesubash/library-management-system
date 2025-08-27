# Library Management System

A comprehensive **Library Management System** built with React (Vite + TypeScript + Tailwind CSS) and Supabase backend. This system provides a complete solution for managing library operations with user authentication, book management, and administrative features.

## 🚀 Live Demo

The frontend is deployed and accessible at:

[Library-Management-System](https://lms.subashsdhami.com.np/)

## ✨ Features

### 🔐 Authentication & User Management
- **Email Confirmation**: Complete Supabase email verification workflow
- **Password Security**: Show/hide toggles on all password fields
- **User Roles**: Separate admin and regular user experiences
- **Profile Management**: Update personal information and change passwords
- **Test Accounts**: Quick admin access for testing

### 📚 Book Management
- **Book Catalog**: Browse and search extensive book collection
- **Request System**: Users can request books with availability tracking
- **Admin Controls**: Add, edit, delete, and manage book inventory
- **Responsive Design**: Beautiful book cards with detailed information
- **Guest Access**: Login prompts for unauthenticated users

### 🛠️ Admin Features
- **Book Management**: Full CRUD operations with responsive dialogs
- **Copy Tracking**: Manage multiple copies of books
- **Borrower History**: Track lending and return history
- **User Management**: Admin-specific interface and controls

### 🎨 User Experience
- **Light/Dark Mode**: Soft, eye-friendly color palette
- **Responsive Design**: Mobile-first approach for all devices
- **Beautiful UI**: Modern, clean interface with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation support

### 📄 Legal & Information
- **About Us**: Comprehensive developer information
- **Terms of Service**: Nepal-specific legal terms
- **Privacy Policy**: Data protection and privacy guidelines
- **Cookie Policy**: Cookie usage and management

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Type Safety**: Full TypeScript support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd library-management-system
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Environment Setup**
Create `.env.local` file in the frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up authentication with email confirmation
3. Configure email templates for verification
4. Set up database tables for books and user profiles

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📱 Usage

### For Users
1. **Registration**: Sign up with email confirmation
2. **Browse Books**: Explore the book catalog
3. **Request Books**: Submit borrowing requests
4. **Profile**: Manage personal information

### For Admins
1. **Login**: Use admin credentials or test admin button
2. **Manage Books**: Add, edit, delete books and manage copies
3. **User Management**: Track borrowing history and user activity
4. **Admin Tools**: Access comprehensive management features

## 🎯 Recent Enhancements

### ✅ Authentication Improvements
- Email confirmation workflow with Supabase
- Duplicate registration prevention with proper error handling
- Password visibility toggles across all forms

### ✅ Admin Experience
- Fixed book management navigation and dialogs
- Removed irrelevant sections for admin users
- Enhanced book management with responsive design

### ✅ UI/UX Enhancements
- Softer color palette for better eye comfort
- Responsive dialogs and mobile optimization
- Guest user prompts for better UX flow

## 🌐 Deployment

This project is optimized for deployment on **Vercel**:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions, issues, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed with ❤️ by Subash Dhami**
