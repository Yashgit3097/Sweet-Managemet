// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const XLSX = require('xlsx');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect('mongodb+srv://yashgithub907:Yash3097@sweetmanagementsystem.jyypgh5.mongodb.net/?retryWrites=true&w=majority&appName=SweetManagementSystem', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(console.log("DB connected"));

// // Item prices per 1 kg
// const ITEMS = {
//   'Kaju Katri': 730,
//   'Kaju Maisur': 620,
//   'Kaju Kasata': 810,
// };

// // Mongoose User schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   item: String,
//   quantity: String, // store like "250g"
//   price: Number,
//   status: {
//     type: String,
//     enum: ['paid', 'unpaid'],
//     default: 'unpaid',
//   },
// });

// const User = mongoose.model('User', userSchema);

// // Calculate price helper
// function calculatePrice(itemName, grams) {
//   const perKgPrice = ITEMS[itemName];
//   if (!perKgPrice) return 0;
//   return (perKgPrice * grams) / 1000;
// }

// // ✅✅✅ Add user — now supports custom grams too
// app.post('/users', async (req, res) => {
//   const { name, item, quantity } = req.body;

//   if (!name || !item || !quantity) {
//     return res.status(400).json({ error: 'Name, item, and quantity required.' });
//   }

//   // ✅ Extract number from input: allow "250g" or "250"
//   const grams = parseInt(quantity.toString().replace(/[^\d]/g, ''));
//   if (!grams || grams <= 0) {
//     return res.status(400).json({ error: 'Invalid quantity in grams.' });
//   }

//   const price = calculatePrice(item, grams);

//   const user = new User({
//     name,
//     item,
//     quantity: `${grams}g`,
//     price,
//   });

//   await user.save();
//   res.json(user);
// });

// // Get users with search & filter
// // ✅ Get users with search, status, AND custom quantity logic
// app.get('/users', async (req, res) => {
//   const { name, status, quantity } = req.query;

//   let query = {};

//   if (name) {
//     query.name = { $regex: name, $options: 'i' };
//   }

//   if (status) {
//     query.status = status;
//   }

//   if (quantity) {
//     if (quantity === 'custom') {
//       // ✅ Find users NOT matching exactly 250g, 500g, or 1000g
//       query.quantity = { $nin: ['250g', '500g', '1000g'] };
//     } else {
//       query.quantity = quantity;
//     }
//   }

//   const users = await User.find(query).sort({ _id: -1 });
//   res.json(users);
// });


// // Mark paid
// app.patch('/users/:id/paid', async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
//   if (!user) return res.status(404).json({ error: 'User not found.' });
//   res.json(user);
// });

// // Mark unpaid
// app.patch('/users/:id/unpaid', async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, { status: 'unpaid' }, { new: true });
//   if (!user) return res.status(404).json({ error: 'User not found.' });
//   res.json(user);
// });

// // ✅✅✅ Edit user — now supports custom grams too
// app.patch('/users/:id', async (req, res) => {
//   const { name, item, quantity } = req.body;

//   if (!name || !item || !quantity) {
//     return res.status(400).json({ error: 'Name, item, and quantity required.' });
//   }

//   const grams = parseInt(quantity.toString().replace(/[^\d]/g, ''));
//   if (!grams || grams <= 0) {
//     return res.status(400).json({ error: 'Invalid quantity in grams.' });
//   }

//   const price = calculatePrice(item, grams);

//   const updated = await User.findByIdAndUpdate(
//     req.params.id,
//     {
//       name,
//       item,
//       quantity: `${grams}g`,
//       price,
//     },
//     { new: true }
//   );

//   if (!updated) {
//     return res.status(404).json({ error: 'User not found.' });
//   }

//   res.json(updated);
// });

// // ✅ Delete user (unchanged)
// app.delete('/users/:id', async (req, res) => {
//   const deleted = await User.findByIdAndDelete(req.params.id);
//   if (!deleted) {
//     return res.status(404).json({ error: 'User not found.' });
//   }
//   res.json({ message: 'User deleted successfully.' });
// });

// // ✅ Download Excel file with total
// app.get('/download', async (req, res) => {
//   const { name, status, quantity } = req.query;

//   let query = {};

//   if (name) {
//     query.name = { $regex: name, $options: 'i' };
//   }
//   if (status) {
//     query.status = status;
//   }
//   if (quantity) {
//     if (quantity === 'custom') {
//       query.quantity = { $nin: ['250g', '500g', '1000g'] };
//     } else {
//       query.quantity = quantity;
//     }
//   }

//   const users = await User.find(query).sort({ _id: 1 });

//   // Build rows
//   const rows = [
//     ['Sr No', 'Name', 'Item', 'Quantity', 'Price', 'Status'],
//   ];

//   let total = 0;
//   users.forEach((u, index) => {
//     rows.push([
//       index + 1,
//       u.name,
//       u.item,
//       u.quantity,
//       u.price,
//       u.status,
//     ]);
//     total += u.price;
//   });

//   // Add total row
//   rows.push([]);
//   rows.push(['', '', '', 'Total', total, '']);

//   // Create workbook
//   const wb = XLSX.utils.book_new();
//   const ws = XLSX.utils.aoa_to_sheet(rows);

//   // Center align all cells
//   const range = XLSX.utils.decode_range(ws['!ref']);
//   for (let R = range.s.r; R <= range.e.r; ++R) {
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
//       if (!ws[cell_address]) continue;
//       if (!ws[cell_address].s) ws[cell_address].s = {};
//       ws[cell_address].s.alignment = { vertical: "center", horizontal: "center" };
//     }
//   }

//   XLSX.utils.book_append_sheet(wb, ws, 'Orders');

//   const filePath = path.join(__dirname, 'Orders.xlsx');
//   XLSX.writeFile(wb, filePath);

//   res.download(filePath, 'Orders.xlsx', (err) => {
//     if (err) {
//       console.error('Download error:', err);
//     }
//     fs.unlinkSync(filePath); // clean up
//   });
// });


// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });


// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://yashgithub907:Yash3097@sweetmanagementsystem.jyypgh5.mongodb.net/?retryWrites=true&w=majority&appName=SweetManagementSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("DB connected"));

// Item prices per 1 kg
const ITEMS = {
  'Kaju Katri': 730,
  'Kaju Maisur': 620,
  'Kaju Kasata': 810,
};

// Mongoose User schema
const userSchema = new mongoose.Schema({
  name: String,
  items: [
    {
      item: String,
      quantity: String, // like "250g"
      price: Number,
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
  },
});

const User = mongoose.model('User', userSchema);

// Calculate price helper
function calculatePrice(itemName, grams) {
  const perKgPrice = ITEMS[itemName];
  if (!perKgPrice) return 0;
  return (perKgPrice * grams) / 1000;
}

// ✅ Add user with multiple items
app.post('/users', async (req, res) => {
  const { name, items } = req.body;

  if (!name || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Name and at least one item required.' });
  }

  let totalPrice = 0;
  const formattedItems = [];

  for (const entry of items) {
    const { item, quantity } = entry;
    if (!item || !quantity) continue;
    const grams = parseInt(quantity.toString().replace(/[^\d]/g, ''));
    if (!grams || grams <= 0) continue;
    const price = calculatePrice(item, grams);
    totalPrice += price;
    formattedItems.push({ item, quantity: `${grams}g`, price });
  }

  if (formattedItems.length === 0) {
    return res.status(400).json({ error: 'No valid items provided.' });
  }

  const user = new User({ name, items: formattedItems, totalPrice });
  await user.save();
  res.json(user);
});

// ✅ Get users with search, status, quantity logic
app.get('/users', async (req, res) => {
  const { name, status, quantity, singleOrder } = req.query;
  let query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (status) query.status = status;
  if (quantity) {
    if (quantity === 'custom') {
      query['items.quantity'] = { $nin: ['250g', '500g', '1000g'] };
    } else {
      query['items.quantity'] = quantity;
    }
  }

  // Filter users who have exactly 1 item (single order)
  if (singleOrder === 'true') {
    query['items.1'] = { $exists: false }; // means only 0th index exists (1 item)
  }

  try {
    const users = await User.find(query).sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Mark paid
app.patch('/users/:id/paid', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'paid' }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

// ✅ Mark unpaid
app.patch('/users/:id/unpaid', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { status: 'unpaid' }, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

// ✅ Edit user with multiple items
app.patch('/users/:id', async (req, res) => {
  const { name, items } = req.body;
  if (!name || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Name and at least one item required.' });
  }

  let totalPrice = 0;
  const formattedItems = [];

  for (const entry of items) {
    const { item, quantity } = entry;
    const grams = parseInt(quantity.toString().replace(/[^\d]/g, ''));
    if (!grams || grams <= 0) continue;
    const price = calculatePrice(item, grams);
    totalPrice += price;
    formattedItems.push({ item, quantity: `${grams}g`, price });
  }

  if (formattedItems.length === 0) {
    return res.status(400).json({ error: 'No valid items provided.' });
  }

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { name, items: formattedItems, totalPrice },
    { new: true }
  );

  if (!updated) return res.status(404).json({ error: 'User not found.' });
  res.json(updated);
});

// ✅ Delete user
app.delete('/users/:id', async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'User not found.' });
  res.json({ message: 'User deleted successfully.' });
});

// ✅ Excel Download
app.get('/download', async (req, res) => {
  const { name, status, quantity } = req.query;
  let query = {};

  if (name) query.name = { $regex: name, $options: 'i' };
  if (status) query.status = status;
  if (quantity) {
    if (quantity === 'custom') {
      query['items.quantity'] = { $nin: ['250g', '500g', '1000g'] };
    } else {
      query['items.quantity'] = quantity;
    }
  }

  const users = await User.find(query).sort({ _id: 1 });

  const rows = [['Sr No', 'Name', 'Items', 'Total Price (₹)', 'Status']];
  let sr = 1;
  let grandTotal = 0;
  const quantitySummary = {};

  users.forEach(user => {
    let itemDetails = '';
    let userTotal = 0;

    user.items.forEach(({ item, quantity }) => {
      if (!item || !quantity) return;
      const grams = parseInt(quantity.replace(/[^\d]/g, ''));
      if (!grams || grams <= 0) return;

      const perKgPrice = ITEMS[item] || 0;
      const price = (grams / 1000) * perKgPrice;
      const roundedPrice = price.toFixed(2);

      userTotal += parseFloat(roundedPrice);
      grandTotal += parseFloat(roundedPrice);

      itemDetails += `${item} (${grams}g) - ₹${roundedPrice}\n`;

      if (!quantitySummary[item]) {
        quantitySummary[item] = 0;
      }
      quantitySummary[item] += grams;
    });

    rows.push([
      sr++,
      user.name,
      itemDetails.trim(),
      userTotal.toFixed(2),
      user.status || 'Pending'
    ]);
  });

  rows.push([]);
  rows.push(['', '', 'Grand Total', grandTotal.toFixed(2), '']);

  rows.push([]);
  rows.push(['', '', 'Total Quantity per Product', '', '']);
  Object.entries(quantitySummary).forEach(([item, grams]) => {
    rows.push(['', '', item, `${grams}g`, '']);
  });

  // Create workbook and sheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Format as table: center cells, and apply borders
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!ws[cell_ref]) continue;

      if (!ws[cell_ref].s) ws[cell_ref].s = {};
      ws[cell_ref].s.alignment = {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      };
      ws[cell_ref].s.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }

  // Optional: adjust column widths for better visibility
  ws['!cols'] = [
    { wch: 8 },   // Sr No
    { wch: 20 },  // Name
    { wch: 50 },  // Items
    { wch: 18 },  // Total Price
    { wch: 15 }   // Status
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Orders');

  const filePath = path.join(__dirname, 'Orders.xlsx');
  XLSX.writeFile(wb, filePath, { cellStyles: true });

  res.download(filePath, 'Orders.xlsx', err => {
    if (err) console.error('Download error:', err);
    fs.unlinkSync(filePath); // delete after download
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});