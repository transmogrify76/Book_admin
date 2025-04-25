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

  // Sample Data
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

  const [customers,] = useState([
    { id: 'C001', name: 'Rahul Sharma', email: 'rahul@example.com', orders: 5, joined: '2023-01-15' },
    { id: 'C002', name: 'Priya Patel', email: 'priya@example.com', orders: 2, joined: '2023-02-20' },
    { id: 'C003', name: 'Amit Singh', email: 'amit@example.com', orders: 8, joined: '2022-12-05' },
  ]);

  const [reviews, ] = useState([
    { id: 'R001', book: 'The Alchemist', rating: 4.5, comment: 'Life-changing read!', author: 'Neha Gupta', date: '2024-03-10' },
    { id: 'R002', book: '1984', rating: 5, comment: 'Timeless classic', author: 'Ravi Desai', date: '2024-03-12' },
    { id: 'R003', book: 'Wings of Fire', rating: 4, comment: 'Inspiring autobiography', author: 'Sonia Mehta', date: '2024-03-14' },
  ]);

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

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`${stat.color} rounded-xl p-4 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className="text-2xl opacity-75" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  Sales Chart Placeholder
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Order Status</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  Pie Chart Placeholder
                </div>
              </div>
            </div>
          </div>
        );

      case 'Inventory':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Book Inventory</h2>
              <button 
                onClick={() => setShowAddBookModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Add Book
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">Title</th>
                    <th className="px-4 py-3 text-left text-sm">Author</th>
                    <th className="px-4 py-3 text-sm">Price</th>
                    <th className="px-4 py-3 text-sm">Stock</th>
                    <th className="px-4 py-3 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{book.title}</td>
                      <td className="px-4 py-3">{book.author}</td>
                      <td className="px-4 py-3 text-center">₹{book.price}</td>
                      <td className={`px-4 py-3 text-center ${
                        book.stock < 10 ? 'text-red-600 font-bold' : ''
                      }`}>
                        {book.stock}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-indigo-600 hover:text-indigo-800 mr-3">
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Orders':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Order Management</h2>
              <div className="flex gap-4">
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2"
                  onChange={(e) => {/* Implement date filter */}}
                />
                <select 
                  className="border rounded-lg px-3 py-2"
                  onChange={(e) => {/* Implement status filter */}}
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
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm">Order ID</th>
                    <th className="px-4 py-3 text-sm">Customer</th>
                    <th className="px-4 py-3 text-sm">Date</th>
                    <th className="px-4 py-3 text-sm">Total</th>
                    <th className="px-4 py-3 text-sm">Status</th>
                    <th className="px-4 py-3 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-center">{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3 text-center">{order.date}</td>
                      <td className="px-4 py-3 text-center">₹{order.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowEditOrderModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Customers':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Customer Database</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm">Name</th>
                    <th className="px-4 py-3 text-sm">Email</th>
                    <th className="px-4 py-3 text-sm">Total Orders</th>
                    <th className="px-4 py-3 text-sm">Joined</th>
                    <th className="px-4 py-3 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3 text-center">{customer.orders}</td>
                      <td className="px-4 py-3 text-center">{customer.joined}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-indigo-600 hover:text-indigo-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Reviews':
        return (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map(review => (
                <div key={review.id} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-amber-500">
                        {'★'.repeat(review.rating)}
                      </span>
                      <span className="text-gray-400 ml-1">
                        {'★'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-800 mb-2">"{review.comment}"</p>
                  <p className="text-sm text-gray-600">
                    {review.author} - {review.book}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-xl font-semibold">Select a category</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg">
        <div className="p-6 text-2xl font-bold text-indigo-600">BookVerse Admin</div>
        <nav className="mt-6 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center px-6 py-3 text-gray-600 transition-all ${
                activeTab === item.name
                  ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                  : 'hover:bg-gray-50 hover:border-l-4 hover:border-gray-200'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 border-b">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-96">
            <input
              type="text"
              placeholder="Search books, orders, customers..."
              className="bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/login');
            }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FaSignOutAlt className="mr-2" /> Sign Out
          </button>
        </header>

        {/* Main Content Area */}
        <main className="p-6 overflow-auto">
          <div className="space-y-6">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Book</h3>
            {/* Add form fields here */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowAddBookModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Save Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Order Status</h3>
            <select
              className="w-full border rounded-lg p-2 mb-4"
              value={selectedOrder.status}
              onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditOrderModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(selectedOrder.id, selectedOrder.status);
                  setShowEditOrderModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;