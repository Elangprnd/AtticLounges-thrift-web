// ===== ORDERS PAGE FUNCTIONALITY ===== //

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

// ===== RENDER ORDERS ===== //
async function renderOrders() {
  const container = document.getElementById("orders-container");
  const noOrdersMessage = document.getElementById("no-orders");
  if (!container || !noOrdersMessage) return;

  container.innerHTML = "";
  let orders = [];

  try {
    // Try to fetch orders from Order Service
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4003/api/orders', {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (response.ok) {
      orders = await response.json();
      console.log('Fetched orders from backend:', orders);
    } else {
      throw new Error('Failed to fetch orders from backend');
    }
  } catch (error) {
    console.warn('Order service not available, using local storage:', error);
    // Fallback to localStorage (per user)
    const userId = getCurrentUserId();
    const ordersKey = userId ? `orders_${userId}` : 'orders_guest';
    orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
  }

  if (orders.length === 0) {
    noOrdersMessage.classList.remove('hidden');
    return;
  }

  noOrdersMessage.classList.add('hidden');

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "bg-white rounded-xl shadow-sm p-6 mb-6";
    orderDiv.innerHTML = `
      <div class="flex justify-between items-center mb-4 border-b pb-3">
        <h3 class="text-xl font-semibold text-gray-800">Order ID: ${order.orderId}</h3>
        <span class="text-sm font-medium ${order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100'} px-3 py-1 rounded-full">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <p class="text-gray-600 mb-2">Order Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
      <p class="text-gray-600 mb-4">Total Amount: Rp ${order.totals.total.toLocaleString("id-ID")}</p>
      
      <h4 class="font-semibold text-gray-800 mb-3">Items:</h4>
      <div class="space-y-3 mb-4">
        ${order.items.map(item => `
          <div class="flex items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">${item.name}</p>
              <p class="text-xs text-gray-500">Qty: ${item.qty} x Rp ${item.price.toLocaleString("id-ID")}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <h4 class="font-semibold text-gray-800 mb-3">Shipping Address:</h4>
      <p class="text-gray-700">${order.shipping.firstName} ${order.shipping.lastName}</p>
      <p class="text-gray-700">${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.postalCode}</p>
      <p class="text-gray-700">Phone: ${order.shipping.phone}</p>
      <p class="text-gray-700">Email: ${order.shipping.email}</p>

      <h4 class="font-semibold text-gray-800 mt-4 mb-3">Payment Method:</h4>
      <p class="text-gray-700">${order.payment.replace(/-/g, ' ').toUpperCase()}</p>
    `;
    container.appendChild(orderDiv);
  });
}

// ===== INITIALIZE ORDERS PAGE ===== //
document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
  updateCartCount();
});
