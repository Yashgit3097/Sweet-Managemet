import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const baseUrl = 'http://localhost:5000';

const ITEMS = {
  'Kaju Katri': 730,
  'Kaju Maisur': 620,
  'Kaju Kasata': 810,
};

const quantities = ['250g', '500g', '1kg', "Custom"];

export default function App() {
  const [name, setName] = useState('');
  const [item, setItem] = useState(Object.keys(ITEMS)[0]);
  const [quantity, setQuantity] = useState('1000'); // default to grams
  const [price, setPrice] = useState(ITEMS[item]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterQuantity, setFilterQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Calculate price
  useEffect(() => {
    const grams = parseInt(quantity) || 0;
    setPrice((ITEMS[item] * grams) / 1000);
  }, [item, quantity]);

  const fetchUsers = async () => {
    setLoading(true);
    let params = [];
    if (search) params.push(`name=${search}`);
    if (filterStatus) params.push(`status=${filterStatus}`);
    if (filterQuantity) params.push(`quantity=${filterQuantity}`);
    const res = await fetch(`${baseUrl}/users?${params.join('&')}`);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filterStatus, filterQuantity]);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      alert('Name is required!');
      return;
    }

    if (!quantity || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity in grams.');
      return;
    }

    setLoading(true);

    // ✅ Always save with "g"
    const finalQuantity = `${parseInt(quantity)}g`;

    if (editingId) {
      await fetch(`${baseUrl}/users/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          item,
          quantity: finalQuantity,
        }),
      });
      setEditingId(null);
    } else {
      await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          item,
          quantity: finalQuantity,
        }),
      });
    }

    // Reset form
    setName('');
    setItem(Object.keys(ITEMS)[0]);
    setQuantity('');
    fetchUsers();
    setLoading(false);
  };


  const updateStatus = async (id, status) => {
    setLoading(true);
    await fetch(`${baseUrl}/users/${id}/${status}`, { method: 'PATCH' });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setName(user.name);
    setItem(user.item);
    setQuantity(user.quantity);
    setEditingId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      await fetch(`${baseUrl}/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          🍨 Shahjanand Sweets 🍨
        </h1>

        {/* Form */}
        <div className="bg-white shadow rounded p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {Object.keys(ITEMS).map((it) => (
                <option key={it}>{it}</option>
              ))}
            </select>

            <div className="flex gap-2">
              {/* Preset Dropdown */}
              <select
                value={['250', '500', '1000'].includes(quantity) ? `${quantity}` : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setQuantity(e.target.value);
                  }
                }}
                className="border p-2 rounded w-full"
              >
                <option value="">Custom</option>
                <option value="250">250g</option>
                <option value="500">500g</option>
                <option value="1000">1kg</option>
              </select>

              {/* Manual Input */}
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Grams"
                className="border p-2 rounded w-full"
              />
            </div>


            <input
              value={`₹ ${price}`}
              readOnly
              className="border p-2 rounded w-full bg-gray-100"
            />
          </div>

          <button
            onClick={handleAddOrUpdate}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {editingId ? 'Update User' : 'Add User'}
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={filterQuantity}
            onChange={(e) => setFilterQuantity(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Quantities</option>
            <option value="250g">250g</option>
            <option value="500g">500g</option>
            <option value="1000g">1kg</option>
            <option value="custom">Custom</option>
          </select>

          <button
            onClick={() => {
              const params = [];
              if (search) params.push(`name=${encodeURIComponent(search)}`);
              if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
              if (filterQuantity) params.push(`quantity=${encodeURIComponent(filterQuantity)}`);
              const url = `${baseUrl}/download?${params.join('&')}`;
              window.open(url, '_blank');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download Excel
          </button>


        </div>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* User Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border shadow rounded">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Item</th>
                  <th className="text-left px-4 py-2">Quantity</th>
                  <th className="text-left px-4 py-2">Price</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.item}</td>
                      <td className="px-4 py-2">{u.quantity}</td>
                      <td className="px-4 py-2">₹ {u.price}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${u.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => updateStatus(u._id, 'paid')}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Paid
                        </button>
                        <button
                          onClick={() => updateStatus(u._id, 'unpaid')}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        >
                          Unpaid
                        </button>
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
                        >
                          <FiEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs flex items-center gap-1"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-4 text-gray-500" colSpan="6">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
