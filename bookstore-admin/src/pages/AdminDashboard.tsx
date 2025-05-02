import React, { useState } from 'react';
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
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [books, setBooks] = useState([
    { id: 'B001', title: 'The Midnight Library', author: 'Matt Haig', price: 499, stock: 12 },
    { id: 'B002', title: 'Atomic Habits', author: 'James Clear', price: 399, stock: 23 },
    { id: 'B003', title: 'Ikigai', author: 'Héctor García', price: 299, stock: 7 },
  ]);

  const [orders, setOrders] = useState([
    { id: 'O001', customer: 'Rahul Sharma', total: 899, status: 'Processing', items: 3, date: '2024-03-15' },
    { id: 'O002', customer: 'Priya Patel', total: 1499, status: 'Shipped', items: 5, date: '2024-03-14' },
    { id: 'O003', customer: 'Amit Singh', total: 659, status: 'Delivered', items: 2, date: '2024-03-13' },
  ]);

  const customers = [
    { id: 'C001', name: 'Rahul Sharma', email: 'rahul@example.com', orders: 5, joined: '2023-01-15' },
    { id: 'C002', name: 'Priya Patel', email: 'priya@example.com', orders: 2, joined: '2023-02-20' },
    { id: 'C003', name: 'Amit Singh', email: 'amit@example.com', orders: 8, joined: '2022-12-05' },
  ];

  const reviews = [
    { id: 'R001', book: 'The Alchemist', rating: 4.5, comment: 'Life-changing read!', author: 'Neha Gupta', date: '2024-03-10' },
    { id: 'R002', book: '1984', rating: 5, comment: 'Timeless classic', author: 'Ravi Desai', date: '2024-03-12' },
    { id: 'R003', book: 'Wings of Fire', rating: 4, comment: 'Inspiring autobiography', author: 'Sonia Mehta', date: '2024-03-14' },
  ];

  const stats = [
    { label: 'Monthly Revenue', value: '₹1,84,420', icon: FaRupeeSign, color: 'bg-green-100' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Processing').length, icon: FaBoxOpen, color: 'bg-amber-100' },
    { label: 'Low Stock Books', value: books.filter(b => b.stock < 10).length, icon: FaBook, color: 'bg-red-100' },
    { label: 'New Reviews', value: reviews.length, icon: FaCommentDots, color: 'bg-blue-100' },
  ];

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50/95">
      {/* Sidebar */}
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
              className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50/50">
          <div className="space-y-6">
            {/* Dashboard Tab */}
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
                          <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
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
                    <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-gray-400">
                      Sales Chart Placeholder
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-200/50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                    <div className="h-64 bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl flex items-center justify-center text-gray-400">
                      Pie Chart Placeholder
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Inventory Tab */}
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80">
                      <tr>
                        {['Title', 'Author', 'Price', 'Stock', 'Actions'].map((header, idx) => (
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
                          <td className="px-5 py-4 text-sm text-gray-600">₹{book.price}</td>
                          <td className={`px-5 py-4 text-sm font-medium ${
                            book.stock < 10 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {book.stock}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-3">
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
              </div>
            )}

            {/* Orders Tab */}
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
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80">
                      <tr>
                        {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((header, idx) => (
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
                          <td className="px-5 py-4 text-sm text-gray-600">{order.customer}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{order.date}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">₹{order.total}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
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
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'Customers' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Database</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80">
                      <tr>
                        {['Name', 'Email', 'Total Orders', 'Joined', 'Actions'].map((header, idx) => (
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
                        <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{customer.email}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{customer.orders}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{customer.joined}</td>
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
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'Reviews' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="px-6 py-5 border-b border-gray-200/50">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Reviews</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {reviews.map(review => (
                    <div key={review.id} className="border border-gray-200/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <span className="text-amber-500">
                            {'★'.repeat(Math.floor(review.rating))}
                          </span>
                          <span className="text-gray-300">
                            {'★'.repeat(5 - Math.floor(review.rating))}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-800 mb-3 text-sm">"{review.comment}"</p>
                      <p className="text-xs text-gray-500">
                        {review.author} • {review.book}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
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

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200/75"
          >
            <h3 className="text-lg font-semibold mb-5">Add New Book</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200/75 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50/80 rounded-xl"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors">
                Save Book
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Order Modal */}
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
              onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
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