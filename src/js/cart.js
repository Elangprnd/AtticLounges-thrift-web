// ===== CART FUNCTIONALITY ===== //

// ===== CART FUNCTIONS ===== //
function getCart() {
  const userId = getCurrentUserId();
  const cartKey = userId ? `cart_${userId}` : 'cart_guest';
  return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
  const userId = getCurrentUserId();
  const cartKey = userId ? `cart_${userId}` : 'cart_guest';
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
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

// ===== RENDER CART ===== //
function renderCart() {
  const container = document.querySelector(".cart-container");
  if (!container) return;

  container.innerHTML = "";
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <img src="https://cdn-icons-png.flaticon.com/128/1170/1170627.png" alt="Empty Cart" class="w-16 h-16 mx-auto mb-4 opacity-50">
        <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <a href="../pages/product.html" class="inline-block px-6 py-2 bg-[#DC9C84] text-white rounded-lg hover:bg-[#93392C] transition">
          Start Shopping
        </a>
      </div>
    `;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center gap-4";

    div.innerHTML = `
      <input type="checkbox" class="w-5 h-5 text-[#DC9C84] rounded" data-index="${index}" />
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg" />
      <div class="flex-1">
        <h3 class="font-semibold text-gray-800 mb-1">${item.name}</h3>
        <p class="text-sm text-gray-500 mb-1">${item.category}</p>
        <div class="flex items-center gap-4 mt-2">
          <div class="flex items-center gap-2">
            <button class="qty-btn w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center" data-index="${index}" data-action="decrease">-</button>
            <span class="qty-display w-8 text-center">${item.qty}</span>
            <button class="qty-btn w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center" data-index="${index}" data-action="increase">+</button>
          </div>
          <p class="text-lg font-bold text-gray-900">Rp ${itemTotal.toLocaleString("id-ID")}</p>
        </div>
      </div>
      <button class="delete-btn p-2 text-red-500 hover:bg-red-50 rounded-lg transition" data-index="${index}">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;

    container.appendChild(div);
  });

  // Add total section
  const totalDiv = document.createElement("div");
  totalDiv.className = "bg-white rounded-lg shadow-sm p-6 mt-4";
  totalDiv.innerHTML = `
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Order Summary</h3>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between text-gray-600">
        <span>Subtotal (${cart.length} items)</span>
        <span>Rp ${total.toLocaleString("id-ID")}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span>Rp 10,000</span>
      </div>
      <hr class="my-2">
      <div class="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>Rp ${(total + 10000).toLocaleString("id-ID")}</span>
      </div>
    </div>
  `;
  container.appendChild(totalDiv);

  // Add event listeners
  addCartEventListeners();
}

// ===== ADD CART EVENT LISTENERS ===== //
function addCartEventListeners() {
  // Quantity controls
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const action = e.target.dataset.action;
      let cart = getCart();

      if (action === "increase") {
        cart[index].qty += 1;
      } else if (action === "decrease" && cart[index].qty > 1) {
        cart[index].qty -= 1;
      }

      saveCart(cart);
      renderCart();
    });
  });

  // Delete individual items
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      let cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

// ===== INITIALIZE CART PAGE ===== //
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  // Delete selected items
  document.getElementById("delete-selected")?.addEventListener("click", () => {
    let cart = getCart();
    const selected = document.querySelectorAll(".cart-item input:checked");
    const indexes = Array.from(selected).map(cb => parseInt(cb.dataset.index));
    
    if (indexes.length === 0) {
      alert("Please select items to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete ${indexes.length} selected item(s)?`)) {
      cart = cart.filter((_, i) => !indexes.includes(i));
      saveCart(cart);
      renderCart();
    }
  });

  // Checkout button
  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Save cart for checkout
    localStorage.setItem("checkoutItems", JSON.stringify(cart));
    window.location.href = "../pages/payment.html";
  });
});