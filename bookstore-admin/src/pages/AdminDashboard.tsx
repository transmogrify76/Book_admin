import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaBoxOpen,
  FaUsers,
  FaBook,
  FaCog,
  FaSignOutAlt,
  FaRupeeSign,
  FaCommentDots,
  FaTruck,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const decodeAdminIdFromToken = (token: string): string | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = JSON.parse(atob(base64));
    return decodedPayload.adminid || null; // Specifically get adminid from payload
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  subcategory_id: string;
  pages: string;
  language: string;
  publisher: string;
  year: string;
  category_name: string;
  subcategory_name: string;
  approval_status: string;
  file_base64: string;
  picture_base64: string;
}

interface Order {
  id: string;
  userid: string;
  status: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
  payment_methods: string;
  created_at: string;
}

interface Feedback {
  id: string;
  participantname: string;
  email: string;
  rating: number;
  review: string;
}

interface Category {
  id: string;
  name: string;
  subcategory: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

interface OrderSummary {
  id: string;
  bookId: string;
  userId: string;
  status: string;
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
}

interface Customer {
  email: string;
  name: string;
  orders: OrderSummary[];
  user_all_total_spending: number;
  user_last_order_date: string;
}

const navigation = [
  { name: 'Dashboard', icon: FaChartLine },
  { name: 'Inventory', icon: FaBook },
  { name: 'Orders', icon: FaTruck },
  { name: 'Customers', icon: FaUsers },
  { name: 'Analytics', icon: FaChartLine },
  { name: 'Reviews', icon: FaCommentDots },
  { name: 'Settings', icon: FaCog },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState('');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    subcategory_id: '',
    pages: '',
    language: '',
    publisher: '',
    year: '',
    userid: ''
  });
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const stats = [
    {
      label: 'Monthly Revenue',
      value: `₹${orders
        .filter(o => {
          const orderDate = new Date(o.created_at);
          const now = new Date();
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear() &&
            o.status === 'Delivered'
          );
        })
        .reduce((sum, o) => sum + o.total_price, 0)
        .toLocaleString('en-IN')}`,
      icon: FaRupeeSign,
      color: 'bg-green-100'
    },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Processing').length, icon: FaBoxOpen, color: 'bg-amber-100' },
    { label: 'Low Stock Books', value: books.filter(b => b.stock < 10).length, icon: FaBook, color: 'bg-red-100' },
    { label: 'Customer Feedback', value: feedbacks.length, icon: FaCommentDots, color: 'bg-blue-100' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5400/api/booksops/getallbookdata', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load books');
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'Inventory') fetchBooks();
  }, [activeTab, navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5400/api/booksops/loadcategories', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Category load failed');
      }
    };

    if (showAddBookModal) fetchCategories();
  }, [showAddBookModal, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'Orders') {
        try {
          setOrdersLoading(true);
          setOrdersError('');
          const token = localStorage.getItem('adminToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch('http://localhost:5400/api/orderops/allorderhistory', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to fetch orders');
          const data = await response.json();
          setOrders(data);
        } catch (err) {
          setOrdersError(err instanceof Error ? err.message : 'Failed to load orders');
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab, navigate]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (activeTab === 'Reviews') {
        try {
          setFeedbackLoading(true);
          setFeedbackError('');
          const token = localStorage.getItem('adminToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch('http://localhost:5400/api/feedback/getallfeedback', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to fetch feedback');
          const data = await response.json();
          setFeedbacks(data);
        } catch (err) {
          setFeedbackError(err instanceof Error ? err.message : 'Failed to load feedback');
        } finally {
          setFeedbackLoading(false);
        }
      }
    };

    fetchFeedbacks();
  }, [activeTab, navigate]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (activeTab === 'Customers') {
        try {
          setCustomersLoading(true);
          setCustomersError('');
          const token = localStorage.getItem('adminToken');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch('http://localhost:5400/api/analytics/listofcustomerandorderdetails', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to fetch customers');
          const data = await response.json();
          setCustomers(data);
        } catch (err) {
          setCustomersError(err instanceof Error ? err.message : 'Failed to load customers');
        } finally {
          setCustomersLoading(false);
        }
      }
    };

    fetchCustomers();
  }, [activeTab, navigate]);

  const handleToggleApproval = async (bookId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(
        `http://localhost:5400/api/adminapproval/update?id=${bookId}`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update approval status');
      }

      const result = await response.json();
      setBooks(books.map(book =>
        book.id === bookId ? { ...book, approval_status: result.current_status } : book
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Approval update failed');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5400/api/booksops/deletebookdata', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: bookId })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Book not found');
        }
        throw new Error('Failed to delete book');
      }

      setBooks(books.filter(book => book.id !== bookId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Authentication token not found');
      navigate('/login');
      return;
    }

    const adminId = decodeAdminIdFromToken(token);
    if (!adminId) {
      setError('Failed to get admin ID from token');
      return;
    }

    const formData = new FormData();
    formData.append('adminid', adminId); // Add adminid to form data
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('description', newBook.description);
    formData.append('price', newBook.price.toString());
    formData.append('quantity', newBook.stock.toString());
    formData.append('category_id', newBook.category_id);
    formData.append('subcategory_id', newBook.subcategory_id);
    formData.append('pages', newBook.pages);
    formData.append('language', newBook.language);
    formData.append('publisher', newBook.publisher);
    formData.append('year', newBook.year);

    if (bookFile) formData.append('book_file', bookFile);
    if (bookImage) formData.append('book_picture', bookImage);

    try {
      const response = await fetch('http://localhost:5400/api/adminroutes/uploadbooksdata', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Book upload failed');
      }

      // Refresh books list
      const booksResponse = await fetch('http://localhost:5400/api/booksops/getallbookdata', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!booksResponse.ok) throw new Error('Failed to refresh books');
      const booksData = await booksResponse.json();
      setBooks(booksData);

      // Reset form
      setShowAddBookModal(false);
      setNewBook({
        title: '',
        author: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: '',
        subcategory_id: '',
        pages: '',
        language: '',
        publisher: '',
        year: '',
        userid: ''
      });
      setSelectedCategoryId('');
      setSubcategories([]);
      setBookFile(null);
      setBookImage(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Book upload failed');
    }
  };
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      const response = await fetch(`http://localhost:5400/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order');
    } catch (err) {
      setOrdersError(err instanceof Error ? err.message : 'Update failed');
      setOrders(orders);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/95">
      <aside className="w-64 bg-white/90 backdrop-blur-lg border-r border-gray-200/75 shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            BookVerse Admin
          </h1>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navigation.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.name
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm border border-indigo-100'
                  : 'text-gray-600 hover:bg-gray-50/80 hover:shadow'
                }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${activeTab === item.name ? 'text-indigo-500' : 'text-gray-400'}`} />
              {item.name}
            </motion.button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white/90 backdrop-blur-lg px-6 py-4 border-b border-gray-200/75">
          <div className="flex items-center bg-gray-50/80 rounded-xl px-4 py-2.5 w-96 shadow-inner">
            <FaSearch className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent outline-none w-full placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/login');
            }}
            className="flex items-center px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50/80 rounded-xl transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-gray-50/50">
          <div className="space-y-6">
            {activeTab === 'Dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-gray-900">
                            {stat.label === 'Monthly Revenue' ? `₹${orders
                              .filter(order => {
                                const orderDate = new Date(order.created_at);
                                const currentDate = new Date();
                                return orderDate.getMonth() === currentDate.getMonth() &&
                                  orderDate.getFullYear() === currentDate.getFullYear();
                              })
                              .reduce((sum, order) => sum + order.total_price, 0)
                              .toLocaleString('en-IN')}` : stat.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color} shadow-inner`}>
                          <stat.icon className="text-lg text-gray-700" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
                    <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                      <div className="flex items-end justify-between h-full space-x-2">
                        {Array.from({ length: 6 }, (_, i) => {
                          const month = new Date();
                          month.setMonth(month.getMonth() - i);
                          const monthSales = orders
                            .filter(order => {
                              const orderDate = new Date(order.created_at);
                              return orderDate.getMonth() === month.getMonth() &&
                                orderDate.getFullYear() === month.getFullYear();
                            })
                            .reduce((sum, order) => sum + order.total_price, 0);

                          return (
                            <div key={i} className="flex flex-col items-center flex-1">
                              <div
                                className="w-full bg-indigo-500 rounded-t-lg transition-all duration-300 hover:bg-indigo-600"
                                style={{
                                  height: `${Math.min((monthSales / 100000) * 100, 100)}%`,
                                  maxHeight: '90%'
                                }}
                              />
                              <span className="text-xs text-gray-600 mt-1">
                                {month.toLocaleString('default', { month: 'short' })}
                              </span>
                            </div>
                          );
                        }).reverse()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="h-64 bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl p-4 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                        {Object.entries({
                          Delivered: orders.filter(o => o.status === 'Delivered').length,
                          Shipped: orders.filter(o => o.status === 'Shipped').length,
                          Processing: orders.filter(o => o.status === 'Processing').length
                        }).map(([status, count], index) => (
                          <div key={status} className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${status === 'Delivered' ? 'bg-green-500' :
                                status === 'Shipped' ? 'bg-blue-500' : 'bg-amber-500'
                              }`} />
                            <span className="text-sm text-gray-600">
                              {status}: {count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'Inventory' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Book Inventory</h2>
                  <button
                    onClick={() => setShowAddBookModal(true)}
                    className="flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <FaPlus className="w-4 h-4 mr-2" /> Add Book
                  </button>
                </div>

                {isLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading books...</div>
                ) : error ? (
                  <div className="p-6 text-red-600">{error}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          {['Title', 'Author', 'Category', 'Subcategory', 'Price', 'Stock', 'Approval', 'Files', 'Actions'].map((header, idx) => (
                            <th
                              key={idx}
                              className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {books.map(book => (
                          <tr key={book.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{book.author}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{book.category_name}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{book.subcategory_name}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">₹{book.price}</td>
                            <td className={`px-5 py-4 text-sm font-medium ${book.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                              {book.stock}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${book.approval_status === 'yes'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                                }`}>
                                {book.approval_status === 'yes' ? 'Approved' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                {book.file_base64 && (
                                  <a
                                    href={`data:application/pdf;base64,${book.file_base64}`}
                                    download={`${book.title}.pdf`}
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    <FaFilePdf className="w-4 h-4" />
                                  </a>
                                )}
                                {book.picture_base64 && (
                                  <img
                                    src={`data:image/png;base64,${book.picture_base64}`}
                                    alt="Book cover"
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleToggleApproval(book.id)}
                                  className={`p-1.5 rounded-lg ${book.approval_status === 'yes'
                                      ? 'text-red-600 hover:bg-red-50 hover:text-red-800'
                                      : 'text-green-600 hover:bg-green-50 hover:text-green-800'
                                    }`}
                                >
                                  {book.approval_status === 'yes' ? (
                                    <FaTimesCircle className="w-4 h-4" />
                                  ) : (
                                    <FaCheckCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50">
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Orders' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Order Management</h2>
                  <div className="flex items-center space-x-3">
                    <input
                      type="date"
                      className="bg-gray-50/80 border border-gray-200/50 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <select
                      className="bg-gray-50/80 border border-gray-200/50 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      <option>All Statuses</option>
                      <option>Processed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>
                {ordersLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading orders...</div>
                ) : ordersError ? (
                  <div className="p-6 text-red-600">{ordersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          {['Order ID', 'User ID', 'Quantity', 'Total', 'Payment Method', 'Delivery Address', 'Date', 'Status', 'Actions'].map((header, idx) => (
                            <th
                              key={idx}
                              className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{order.userid}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{order.quantity}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">₹{order.total_price}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{order.payment_methods}</td>
                            <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {order.delivery_address}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowEditOrderModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Customers' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Database</h2>
                </div>
                {customersLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading customers...</div>
                ) : customersError ? (
                  <div className="p-6 text-red-600">{customersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50/80">
                        <tr>
                          {['Name', 'Email', 'Total Orders', 'Total Spent', 'Last Purchase', 'Actions'].map((header, idx) => (
                            <th
                              key={idx}
                              className="px-5 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {customers.map(customer => (
                          <tr key={customer.email} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{customer.email}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">{customer.orders.length}</td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              ₹{customer.user_all_total_spending?.toLocaleString('en-IN') || 0}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              {customer.user_last_order_date ?
                                new Date(customer.user_last_order_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }) : 'N/A'}
                            </td>
                            <td className="px-5 py-4 text-sm text-gray-600">
                              <button className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded-lg hover:bg-indigo-50">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Feedback</h2>
                  <div className="flex items-center space-x-3">
                    <select
                      className="bg-gray-50/80 border border-gray-200/50 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    >
                      <option value="">All Ratings</option>
                      {[5, 4, 3, 2, 1].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                      ))}
                    </select>
                  </div>
                </div>
                {feedbackLoading ? (
                  <div className="p-6 text-center text-gray-500">Loading feedback...</div>
                ) : feedbackError ? (
                  <div className="p-6 text-red-600">{feedbackError}</div>
                ) : (
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {feedbacks
                      .filter(feedback =>
                        searchQuery ? Math.floor(feedback.rating % 6) === parseInt(searchQuery) : true
                      )
                      .map(feedback => {
                        const ratingValue = Math.min(5, Math.max(0, Math.floor(feedback.rating % 6)));
                        return (
                          <div key={feedback.id} className="border border-gray-200/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <span className="text-amber-500">
                                  {'★'.repeat(ratingValue)}
                                </span>
                                <span className="text-gray-300">
                                  {'★'.repeat(5 - ratingValue)}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-800 mb-3 text-sm">"{feedback.review}"</p>
                            <p className="text-xs text-gray-500">
                              {feedback.participantname} • {feedback.email}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-5">
                  <div className="border-b border-gray-200/50 pb-5">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">General Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dark Mode</span>
                        <button className="w-10 h-6 bg-gray-200 rounded-full p-1">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm transform translate-x-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-gray-200/75"
          >
            <h3 className="text-lg font-semibold mb-5">Add New Book</h3>
            <form onSubmit={handleAddBookSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.title}
                    onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.author}
                    onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                  value={newBook.description}
                  onChange={(e) => setNewBook(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.price}
                    onChange={(e) => setNewBook(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.stock}
                    onChange={(e) => setNewBook(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    required
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const category = categories.find(c => c.id === e.target.value);
                      setSelectedCategoryId(e.target.value);
                      setSubcategories(category?.subcategory || []);
                      setNewBook(prev => ({ ...prev, category_id: e.target.value }));
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select
                    required
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.subcategory_id}
                    onChange={(e) => setNewBook(prev => ({ ...prev, subcategory_id: e.target.value }))}
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.pages}
                    onChange={(e) => setNewBook(prev => ({ ...prev, pages: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.language}
                    onChange={(e) => setNewBook(prev => ({ ...prev, language: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook(prev => ({ ...prev, publisher: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl"
                    value={newBook.year}
                    onChange={(e) => setNewBook(prev => ({ ...prev, year: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book File (PDF) *
                  </label>
                  <input
                    required
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBookImage(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddBookModal(false);
                    setNewBook({
                      title: '',
                      author: '',
                      description: '',
                      price: 0,
                      stock: 0,
                      category_id: '',
                      subcategory_id: '',
                      pages: '',
                      language: '',
                      publisher: '',
                      year: '',
                      userid: ''
                    });
                    setSelectedCategoryId('');
                    setSubcategories([]);
                    setBookFile(null);
                    setBookImage(null);
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50/80 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl"
                >
                  Save Book
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showEditOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200/75"
          >
            <h3 className="text-lg font-semibold mb-5">Update Order Status</h3>
            <select
              className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
              value={selectedOrder.status}
              onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditOrderModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50/80 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status);
                  setShowEditOrderModal(false);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;