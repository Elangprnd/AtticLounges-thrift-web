// ===== CHECKOUT FUNCTIONALITY ===== //

let checkoutItems = [];

// ===== CART FUNCTIONS ===== //
function getCart() {
  const userId = getCurrentUserId();
  const cartKey = userId ? `cart_${userId}` : 'cart_guest';
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// Get current user ID from token
function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id || null;
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const cartCounts = document.querySelectorAll('#cart-count, #cart-count-user');
  cartCounts.forEach(countEl => {
    if (totalItems > 0) {
      countEl.textContent = totalItems;
      countEl.classList.remove('hidden');
    } else {
      countEl.classList.add('hidden');
    }
  });
}

// ===== LOAD CHECKOUT ITEMS ===== //
function loadCheckoutItems() {
  const container = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  // Get items from localStorage (either from cart or checkoutItems)
  checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || getCart();
  
  if (!container) return;

  container.innerHTML = "";

  if (checkoutItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-gray-500 text-lg mb-4">No items in your order</p>
        <a href="../pages/product.html" class="inline-block px-6 py-2 bg-[#DC9C84] text-white rounded-lg hover:bg-[#93392C] transition">
          Continue Shopping
        </a>
      </div>
    `;
    subtotalEl.textContent = "Rp 0";
    taxEl.textContent = "Rp 0";
    totalEl.textContent = "Rp 0";
    return;
  }

  let subtotal = 0;

  checkoutItems.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    container.innerHTML += `
      <div class="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" />
        <div class="flex-1">
          <h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
          <p class="text-sm text-gray-500 mb-1">${item.category}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-sm text-gray-500">Qty: ${item.qty}</span>
            <span class="font-semibold text-gray-800">Rp ${itemTotal.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    `;
  });

  const shipping = 10000;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + shipping + tax;

  subtotalEl.textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
  taxEl.textContent = `Rp ${tax.toLocaleString("id-ID")}`;
  totalEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

// ===== FORM VALIDATION ===== //
function validateForm() {
  const requiredFields = [
    'first-name', 'last-name', 'email', 'phone', 
    'address', 'city', 'state', 'postal-code'
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.classList.add('border-red-500');
      field.focus();
      return false;
    } else {
      field.classList.remove('border-red-500');
    }
  }

  // Email validation
  const email = document.getElementById('email').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById('email').classList.add('border-red-500');
    alert('Please enter a valid email address');
    return false;
  }

  // Phone validation
  const phone = document.getElementById('phone').value;
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('phone').classList.add('border-red-500');
    alert('Please enter a valid phone number');
    return false;
  }

  return true;
}

// ===== PLACE ORDER ===== //
async function placeOrder() {
  if (checkoutItems.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  if (!validateForm()) {
    alert('Please fill in all required fields correctly');
    return;
  }

  // Get form data
  const userId = getCurrentUserId();
  const orderData = {
    userId: userId, // Add userId for multi-user system
    items: checkoutItems,
    shipping: {
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      postalCode: document.getElementById('postal-code').value
    },
    payment: document.querySelector('input[name="payment"]:checked').value,
    orderDate: new Date().toISOString(),
    orderId: 'ORD-' + Date.now(),
    status: 'pending'
  };

  // Calculate totals
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = 10000;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;

  orderData.totals = {
    subtotal,
    shipping,
    tax,
    total
  };

  try {
    // Try to send order to Order Service
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4003/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const savedOrder = await response.json();
      console.log('Order saved to backend:', savedOrder);
    } else {
      console.warn('Failed to save order to backend, saving locally');
    }
  } catch (error) {
    console.warn('Order service not available, saving locally:', error);
  }

  // Always save to localStorage as backup (per user)
  const ordersKey = userId ? `orders_${userId}` : 'orders_guest';
  const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
  orders.push(orderData);
  localStorage.setItem(ordersKey, JSON.stringify(orders));

  // Clear cart using multi-user system
  const cartKey = userId ? `cart_${userId}` : 'cart_guest';
  localStorage.removeItem(cartKey);
  localStorage.removeItem('checkoutItems');

  // Show success message
  alert(`Order placed successfully!\nOrder ID: ${orderData.orderId}\nTotal: Rp ${total.toLocaleString('id-ID')}\n\nYou will receive a confirmation email shortly.`);

  // Redirect to orders page or home
  window.location.href = 'orders.html';
}

// ===== INITIALIZE CHECKOUT PAGE ===== //
document.addEventListener("DOMContentLoaded", () => {
  loadCheckoutItems();
  updateCartCount();

  // Place order button
  document.getElementById("place-order-btn")?.addEventListener("click", placeOrder);

  // Form validation on input
  const formInputs = document.querySelectorAll('#shipping-form input, #shipping-form textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('border-red-500');
      }
    });
  });
});