// import React, { useState, useEffect } from 'react';
// import { FiEdit, FiTrash2 } from 'react-icons/fi';

// const baseUrl = 'https://sweet-managemet.onrender.com';

// const ITEMS = {
//   'Kaju Katri': 730,
//   'Kaju Maisur': 620,
//   'Kaju Kasata': 810,
// };

// const quantities = ['250g', '500g', '1kg', "Custom"];

// export default function App() {
//   const [name, setName] = useState('');
//   const [item, setItem] = useState(Object.keys(ITEMS)[0]);
//   const [quantity, setQuantity] = useState('1000'); // default to grams
//   const [price, setPrice] = useState(ITEMS[item]);
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [filterQuantity, setFilterQuantity] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   // Calculate price
//   useEffect(() => {
//     const grams = parseInt(quantity) || 0;
//     setPrice((ITEMS[item] * grams) / 1000);
//   }, [item, quantity]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     let params = [];
//     if (search) params.push(`name=${search}`);
//     if (filterStatus) params.push(`status=${filterStatus}`);
//     if (filterQuantity) params.push(`quantity=${filterQuantity}`);
//     const res = await fetch(`${baseUrl}/users?${params.join('&')}`);
//     const data = await res.json();
//     setUsers(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [search, filterStatus, filterQuantity]);

//   const handleAddOrUpdate = async () => {
//     if (!name.trim()) {
//       alert('Name is required!');
//       return;
//     }

//     if (!quantity || parseInt(quantity) <= 0) {
//       alert('Please enter a valid quantity in grams.');
//       return;
//     }

//     setLoading(true);

//     // ✅ Always save with "g"
//     const finalQuantity = `${parseInt(quantity)}g`;

//     if (editingId) {
//       await fetch(`${baseUrl}/users/${editingId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           item,
//           quantity: finalQuantity,
//         }),
//       });
//       setEditingId(null);
//     } else {
//       await fetch(`${baseUrl}/users`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           item,
//           quantity: finalQuantity,
//         }),
//       });
//     }

//     // Reset form
//     setName('');
//     setItem(Object.keys(ITEMS)[0]);
//     setQuantity('');
//     fetchUsers();
//     setLoading(false);
//   };


//   const updateStatus = async (id, status) => {
//     setLoading(true);
//     await fetch(`${baseUrl}/users/${id}/${status}`, { method: 'PATCH' });
//     fetchUsers();
//   };

//   const handleEdit = (user) => {
//     setName(user.name);
//     setItem(user.item);
//     setQuantity(user.quantity);
//     setEditingId(user._id);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setLoading(true);
//       await fetch(`${baseUrl}/users/${id}`, { method: 'DELETE' });
//       fetchUsers();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
//           🍨 Shahjanand Sweets 🍨
//         </h1>

//         {/* Form */}
//         <div className="bg-white shadow rounded p-4 md:p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <input
//               type="text"
//               placeholder="Customer Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border p-2 rounded w-full"
//             />

//             <select
//               value={item}
//               onChange={(e) => setItem(e.target.value)}
//               className="border p-2 rounded w-full"
//             >
//               {Object.keys(ITEMS).map((it) => (
//                 <option key={it}>{it}</option>
//               ))}
//             </select>

//             <div className="flex gap-2">
//               {/* Preset Dropdown */}
//               <select
//                 value={['250', '500', '1000'].includes(quantity) ? `${quantity}` : ''}
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     setQuantity(e.target.value);
//                   }
//                 }}
//                 className="border p-2 rounded w-full"
//               >
//                 <option value="">Custom</option>
//                 <option value="250">250g</option>
//                 <option value="500">500g</option>
//                 <option value="1000">1kg</option>
//               </select>

//               {/* Manual Input */}
//               <input
//                 type="number"
//                 min="1"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 placeholder="Grams"
//                 className="border p-2 rounded w-full"
//               />
//             </div>


//             <input
//               value={`₹ ${price}`}
//               readOnly
//               className="border p-2 rounded w-full bg-gray-100"
//             />
//           </div>

//           <button
//             onClick={handleAddOrUpdate}
//             className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             {editingId ? 'Update User' : 'Add User'}
//           </button>
//         </div>

//         {/* Search & Filter */}
//         <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border p-2 rounded flex-1"
//           />

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="">All Status</option>
//             <option value="paid">Paid</option>
//             <option value="unpaid">Unpaid</option>
//           </select>

//           <select
//             value={filterQuantity}
//             onChange={(e) => setFilterQuantity(e.target.value)}
//             className="border p-2 rounded"
//           >
//             <option value="">All Quantities</option>
//             <option value="250g">250g</option>
//             <option value="500g">500g</option>
//             <option value="1000g">1kg</option>
//             <option value="custom">Custom</option>
//           </select>

//           <button
//             onClick={() => {
//               const params = [];
//               if (search) params.push(`name=${encodeURIComponent(search)}`);
//               if (filterStatus) params.push(`status=${encodeURIComponent(filterStatus)}`);
//               if (filterQuantity) params.push(`quantity=${encodeURIComponent(filterQuantity)}`);
//               const url = `${baseUrl}/download?${params.join('&')}`;
//               window.open(url, '_blank');
//             }}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Download Excel
//           </button>


//         </div>

//         {/* Spinner */}
//         {loading && (
//           <div className="flex justify-center my-8">
//             <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}

//         {/* User Table */}
//         {!loading && (
//           <div className="overflow-x-auto">
//             <table className="w-full bg-white border shadow rounded">
//               <thead className="bg-indigo-600 text-white">
//                 <tr>
//                   <th className="text-left px-4 py-2">Name</th>
//                   <th className="text-left px-4 py-2">Item</th>
//                   <th className="text-left px-4 py-2">Quantity</th>
//                   <th className="text-left px-4 py-2">Price</th>
//                   <th className="text-left px-4 py-2">Status</th>
//                   <th className="text-left px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length > 0 ? (
//                   users.map((u) => (
//                     <tr key={u._id} className="border-b">
//                       <td className="px-4 py-2">{u.name}</td>
//                       <td className="px-4 py-2">{u.item}</td>
//                       <td className="px-4 py-2">{u.quantity}</td>
//                       <td className="px-4 py-2">₹ {u.price}</td>
//                       <td className="px-4 py-2">
//                         <span
//                           className={`px-2 py-1 rounded text-xs ${u.status === 'paid'
//                             ? 'bg-green-100 text-green-700'
//                             : 'bg-yellow-100 text-yellow-700'
//                             }`}
//                         >
//                           {u.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 flex flex-wrap gap-2">
//                         <button
//                           onClick={() => updateStatus(u._id, 'paid')}
//                           className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
//                         >
//                           Paid
//                         </button>
//                         <button
//                           onClick={() => updateStatus(u._id, 'unpaid')}
//                           className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
//                         >
//                           Unpaid
//                         </button>
//                         <button
//                           onClick={() => handleEdit(u)}
//                           className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
//                         >
//                           <FiEdit /> Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(u._id)}
//                           className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs flex items-center gap-1"
//                         >
//                           <FiTrash2 /> Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="text-center py-4 text-gray-500" colSpan="6">
//                       No users found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const baseUrl = 'https://sweet-managemet.onrender.com';

const ITEMS = {
  'Kaju Katri': 730,
  'Kaju Maisur': 620,
  'Kaju Kasata': 810,
};

export default function App() {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterQuantity, setFilterQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // For multiple items
  const [items, setItems] = useState([
    {
      item: Object.keys(ITEMS)[0],
      quantity: '1000',
      price: ITEMS[Object.keys(ITEMS)[0]]
    }
  ]);

  // Calculate prices when items change - fixed infinite loop
  useEffect(() => {
    const updatedItems = items.map(it => {
      const grams = parseInt(it.quantity) || 0;
      const price = (ITEMS[it.item] * grams) / 1000;
      return {
        ...it,
        price: isNaN(price) ? 0 : price
      };
    });

    // Only update if prices actually changed
    if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
      setItems(updatedItems);
    }
  }, [items.map(i => `${i.item}-${i.quantity}`)]); // Only recompute when item or quantity changes

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let params = [];
      if (search) params.push(`name=${search}`);
      if (filterStatus) params.push(`status=${filterStatus}`);
      if (filterQuantity) params.push(`quantity=${filterQuantity}`);

      const res = await fetch(`${baseUrl}/users?${params.join('&')}`);
      const data = await res.json();

      // Ensure data has proper structure
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, filterStatus, filterQuantity]);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      alert('Name is required!');
      return;
    }

    // Validate all items
    for (const it of items) {
      if (!it.quantity || parseInt(it.quantity) <= 0) {
        alert('Please enter valid quantities for all items.');
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare items for API
      const apiItems = items.map(it => ({
        item: it.item,
        quantity: `${parseInt(it.quantity)}g`,
        price: (ITEMS[it.item] * parseInt(it.quantity)) / 1000
      }));

      const totalPrice = apiItems.reduce((sum, it) => sum + it.price, 0);

      if (editingId) {
        await fetch(`${baseUrl}/users/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            items: apiItems,
            totalPrice
          }),
        });
        setEditingId(null);
      } else {
        await fetch(`${baseUrl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            items: apiItems,
            totalPrice
          }),
        });
      }

      // Reset form
      setName('');
      setItems([{
        item: Object.keys(ITEMS)[0],
        quantity: '1000',
        price: ITEMS[Object.keys(ITEMS)[0]]
      }]);
      fetchUsers();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await fetch(`${baseUrl}/users/${id}/${status}`, { method: 'PATCH' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    if (!user || !user.items) return;

    setName(user.name);
    setItems(user.items.map(it => ({
      item: it.item || Object.keys(ITEMS)[0],
      quantity: it.quantity ? it.quantity.replace('g', '') : '1000',
      price: it.price || 0
    })));
    setEditingId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await fetch(`${baseUrl}/users/${id}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const addItemRow = () => {
    setItems([...items, {
      item: Object.keys(ITEMS)[0],
      quantity: '1000',
      price: ITEMS[Object.keys(ITEMS)[0]]
    }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, it) => {
      const price = (ITEMS[it.item] * (parseInt(it.quantity) || 0) / 1000);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  };

  const getItemQuantityTotalsInKg = () => {
    const totals = {};

    users.forEach(user => {
      if (!user.items) return;

      user.items.forEach(it => {
        const itemName = it.item;
        const quantityStr = it.quantity || '0g';
        const grams = parseInt(quantityStr.replace('g', '')) || 0;

        if (!totals[itemName]) {
          totals[itemName] = 0;
        }

        totals[itemName] += grams;
      });
    });

    // Convert grams to kg and round to 2 decimal places
    Object.keys(totals).forEach(key => {
      totals[key] = (totals[key] / 1000).toFixed(2); // e.g., 1.25 kg
    });

    return totals;
  };


  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-indigo-700 mb-4 md:mb-6 lg:mb-8">
          🍨 Shri Hari Sweets 🍨
        </h1>

        {/* Form - Responsive Layout */}
        <div className="bg-white shadow rounded p-3 md:p-4 lg:p-6 mb-4 md:mb-6">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full text-sm md:text-base"
            />
          </div>

          {(Array.isArray(items) ? items : []).map((it, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3 items-end">
              <div className="sm:col-span-1">
                <select
                  value={it.item}
                  onChange={(e) => updateItem(index, 'item', e.target.value)}
                  className="border p-2 rounded w-full text-sm md:text-base"
                >
                  {Object.keys(ITEMS).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 flex flex-col sm:flex-row gap-2">
                <select
                  value={['250', '500', '1000'].includes(it.quantity) ? `${it.quantity}` : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateItem(index, 'quantity', e.target.value);
                    }
                  }}
                  className="border p-2 rounded w-full text-sm md:text-base"
                >
                  <option value="">Custom</option>
                  <option value="250">250g</option>
                  <option value="500">500g</option>
                  <option value="1000">1kg</option>
                </select>

                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  placeholder="Grams"
                  className="border p-2 rounded w-full text-sm md:text-base"
                />
              </div>

              <div className="sm:col-span-1">
                <input
                  value={`₹ ${(it.price || 0).toFixed(2)}`}
                  readOnly
                  className="border p-2 rounded w-full bg-gray-100 text-sm md:text-base"
                />
              </div>

              <div className="sm:col-span-1">
                {index === 0 ? (
                  <button
                    onClick={addItemRow}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex items-center gap-1 w-full justify-center text-xs md:text-sm"
                  >
                    <FiPlus size={14} /> Add Item
                  </button>
                ) : (
                  <button
                    onClick={() => removeItemRow(index)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 flex items-center gap-1 w-full justify-center text-xs md:text-sm"
                  >
                    <FiMinus size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="font-bold text-sm md:text-base">Total: ₹ {getTotalPrice().toFixed(2)}</div>
            <button
              onClick={handleAddOrUpdate}
              className="bg-indigo-600 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-indigo-700 text-sm md:text-base w-full sm:w-auto"
              disabled={loading}
            >
              {editingId ? 'Update Order' : 'Add Order'}
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 md:mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded flex-1 text-sm md:text-base"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded text-sm md:text-base"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            value={filterQuantity}
            onChange={(e) => setFilterQuantity(e.target.value)}
            className="border p-2 rounded text-sm md:text-base"
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
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm md:text-base"
          >
            Download Excel
          </button>
        </div>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center my-4 md:my-6 lg:my-8">
            <div className="h-6 w-6 md:h-8 md:w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {/* ✅ Grand Total Footer Row */}
        {users.length > 0 && (
          <tfoot>
            <tr className="font-bold bg-gray-100">
              <td className="px-2 py-1 md:px-4 md:py-2 text-right" colSpan={2}>
                Grand Total
              </td>
              <td className="px-2 py-1 md:px-4 md:py-2">
                ₹ {users.reduce((acc, u) => acc + (u.totalPrice || 0), 0).toFixed(2)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        )}

        {/* 🍬 Grand Quantity per Item in KG */}
        {users.length > 0 && (
          <div className="bg-white shadow p-3 mb-4 mt-4 rounded border text-sm md:text-base">
            <h2 className="font-semibold mb-2 text-indigo-700">📦 Grand Quantity Summary (in kg)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(getItemQuantityTotalsInKg()).map(([itemName, totalKg]) => (
                <div key={itemName} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                  <span>{itemName}</span>
                  <span className="font-bold">{totalKg} kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white border shadow rounded text-sm md:text-base">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="text-left px-2 py-1 md:px-4 md:py-2">Name</th>
                  <th className="text-left px-2 py-1 md:px-4 md:py-2">Items</th>
                  <th className="text-left px-2 py-1 md:px-4 md:py-2">Total</th>
                  <th className="text-left px-2 py-1 md:px-4 md:py-2">Status</th>
                  <th className="text-left px-2 py-1 md:px-4 md:py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="border-b">
                      <td className="px-2 py-1 md:px-4 md:py-2">{u.name}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2">
                        <div className="flex flex-col gap-1">
                          {u.items && u.items.map((it, idx) => (
                            <div key={idx} className="flex gap-5 justify-between text-xs md:text-sm">
                              <span className="truncate max-w-[80px] md:max-w-none">{it.item || 'N/A'}</span>
                              <span>{it.quantity || 'N/A'}</span>
                              <span>₹ {(it.price || 0).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2">₹ {(u.totalPrice || 0).toFixed(2)}</td>
                      <td className="px-2 py-1 md:px-4 md:py-2">
                        <span className={`px-1 py-0.5 md:px-2 md:py-1 rounded text-xs ${u.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {u.status || 'unpaid'}
                        </span>
                      </td>
                      <td className="px-2 py-1 md:px-4 md:py-2">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => updateStatus(u._id, 'paid')}
                            className="px-1 py-0.5 md:px-2 md:py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            disabled={loading}
                          >
                            Paid
                          </button>
                          <button
                            onClick={() => updateStatus(u._id, 'unpaid')}
                            className="px-1 py-0.5 md:px-2 md:py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                            disabled={loading}
                          >
                            Unpaid
                          </button>
                          <button
                            onClick={() => handleEdit(u)}
                            className="px-1 py-0.5 md:px-2 md:py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
                            disabled={loading}
                          >
                            <FiEdit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="px-1 py-0.5 md:px-2 md:py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs flex items-center gap-1"
                            disabled={loading}
                          >
                            <FiTrash2 size={12} /> Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center py-3 text-gray-500 text-sm md:text-base" colSpan="5">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* ✅ Grand Total Footer Row */}
              {users.length > 0 && (
                <tfoot>
                  <tr className="font-bold bg-gray-100">
                    <td className="px-2 py-1 md:px-4 md:py-2 text-right" colSpan={2}>
                      Grand Total
                    </td>
                    <td className="px-2 py-1 md:px-4 md:py-2">
                      ₹ {users.reduce((acc, u) => acc + (u.totalPrice || 0), 0).toFixed(2)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              )}
            </table>

          </div>
        )}
      </div>
    </div>


  );
}