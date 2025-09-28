// ===== E-COMMERCE MAIN APPLICATION ===== //

// ===== LOGIN & AUTHENTICATION ===== //
function loginModal() {
  const openBtn = document.getElementById("button-login");
  const closeBtn = document.getElementById("closeModal");
  const modal = document.getElementById("loginModal");
  const googleLoginBtn = document.getElementById("google-login");
  const userTab = document.getElementById("user-login-tab");
  const adminTab = document.getElementById("admin-login-tab");
  const userContent = document.getElementById("user-login-content");
  const adminContent = document.getElementById("admin-login-content");
  const adminForm = document.getElementById("admin-login-form");

  if (!openBtn || !closeBtn || !modal) return; 

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    // Reset to user tab
    switchToUserTab();
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Tab switching
  userTab?.addEventListener("click", switchToUserTab);
  adminTab?.addEventListener("click", switchToAdminTab);

  function switchToUserTab() {
    userTab.classList.add("bg-white", "text-gray-900", "shadow-sm");
    userTab.classList.remove("text-gray-500");
    adminTab.classList.remove("bg-white", "text-gray-900", "shadow-sm");
    adminTab.classList.add("text-gray-500");
    userContent.classList.remove("hidden");
    adminContent.classList.add("hidden");
  }

  function switchToAdminTab() {
    adminTab.classList.add("bg-white", "text-gray-900", "shadow-sm");
    adminTab.classList.remove("text-gray-500");
    userTab.classList.remove("bg-white", "text-gray-900", "shadow-sm");
    userTab.classList.add("text-gray-500");
    adminContent.classList.remove("hidden");
    userContent.classList.add("hidden");
  }

  // User login form
  const userLoginForm = document.getElementById("user-login-form");
  if (userLoginForm) {
    userLoginForm.addEventListener("submit", handleUserLogin);
  }

  // Switch to signup
  const switchToSignupBtn = document.getElementById("switch-to-signup");
  if (switchToSignupBtn) {
    switchToSignupBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      document.getElementById("signupModal").classList.remove("hidden");
    });
  }

  // Admin login form
  adminForm?.addEventListener("submit", handleAdminLogin);
}

// SIGN UP MODAL
function signupModal() {
  const openBtn = document.getElementById("button-sign-up");
  const closeBtn = document.getElementById("closeSignupModal");
  const modal = document.getElementById("signupModal");
  const signupForm = document.getElementById("signup-form");
  const switchToLoginBtn = document.getElementById("switch-to-login");

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }

  // Switch to login modal
  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      document.getElementById("loginModal").classList.remove("hidden");
    });
  }
}

// Handle user login
async function handleUserLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  
  try {
    const response = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Close modal and update UI
    document.getElementById('loginModal').classList.add('hidden');
    toggleHeader(true);
    showMessage('Login berhasil! Selamat datang!', 'success');
    
    // Clear form
    document.getElementById('user-login-form').reset();
    
  } catch (error) {
    console.error('User login error:', error);
    showMessage(error.message || 'Gagal login. Coba lagi.', 'error');
  }
}

// Handle user registration
async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  
  try {
    const response = await fetch('http://localhost:4001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Store user data and login automatically
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Close modal and update UI
    document.getElementById('signupModal').classList.add('hidden');
    toggleHeader(true);
    showMessage('Registrasi berhasil! Selamat datang!', 'success');
    
    // Clear form
    document.getElementById('signup-form').reset();
    
  } catch (error) {
    console.error('Registration error:', error);
    showMessage(error.message || 'Gagal mendaftar. Coba lagi.', 'error');
  }
}

// ===== HEADER MANAGEMENT ===== //
function toggleHeader(isLoggedIn) {
  const guestHeader = document.querySelector("header.guest");
  const userHeader = document.querySelector("header.user");
  
  // Handle both guest and user headers
  const manageProductsBtn = document.getElementById("manage-products-btn");
  const manageProductsBtnUser = document.getElementById("manage-products-btn-user");
  const loginBtn = document.getElementById("button-login");
  const signupBtn = document.getElementById("button-sign-up");

  console.log('Toggling header, isLoggedIn:', isLoggedIn);
  console.log('Guest header:', guestHeader);
  console.log('User header:', userHeader);

  if (isLoggedIn) {
    // Show user header, hide guest header
    if (userHeader) {
      userHeader.classList.remove("hidden");
    }
    if (guestHeader) {
      guestHeader.classList.add("hidden");
    }
    
    // Show manage products button if admin
    if (isAdmin()) {
      if (manageProductsBtnUser) {
        manageProductsBtnUser.classList.remove("hidden");
      }
    }
  } else {
    // Show guest header, hide user header
    if (guestHeader) {
      guestHeader.classList.remove("hidden");
    }
    if (userHeader) {
      userHeader.classList.add("hidden");
    }
    
    // Hide manage products button
    if (manageProductsBtn) {
      manageProductsBtn.classList.add("hidden");
    }
    if (manageProductsBtnUser) {
      manageProductsBtnUser.classList.add("hidden");
    }
  }
}

// Check if current user is admin
function isAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'owner' || localStorage.getItem('isAdmin') === 'true';
}

// This function is no longer needed for multi-user system
// Users should register/login through proper forms
async function loginSuccess() {
  console.warn('loginSuccess() is deprecated. Use proper registration/login forms instead.');
}

// Function to check if current user is owner
function isOwner() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'owner';
}

// Function to redirect to admin panel if user is owner
function checkOwnerAccess() {
  if (isOwner()) {
    window.location.href = 'pages/admin.html';
  }
}

// Handle admin login
async function handleAdminLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  
  try {
    const response = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Check if user is admin/owner
    if (data.user.role !== 'owner') {
      throw new Error('Akses ditolak. Hanya admin yang bisa masuk.');
    }
    
    // Store user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', 'true');
    
    // Close modal and update UI
    document.getElementById('loginModal').classList.add('hidden');
    toggleHeader(true);
    showMessage('Login admin berhasil!', 'success');
    
    // Clear form
    document.getElementById('admin-login-form').reset();
    
  } catch (error) {
    console.error('Admin login error:', error);
    showMessage(error.message || 'Gagal login admin.', 'error');
  }
}

// Show message function
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

function logout() {
  const userId = getCurrentUserId();
  
  // Clear user session data only (keep cart and wishlist)
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // DON'T clear user cart and wishlist - keep them for when user logs back in
  // Cart and wishlist will be preserved: cart_${userId} and wishlist_${userId}
  
  // Clear guest data only
  localStorage.removeItem("cart_guest");
  localStorage.removeItem("wishlist_guest");
  
  toggleHeader(false);
  if (location.pathname.includes('/pages/')) {
    window.location.href = "../index.html";
  } else {
    window.location.href = "index.html";
  }
}

// Function to clear login state (prevent auto-login)
function clearLoginState() {
  // Only clear if we're on the main index.html page and user is not properly authenticated
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    // Only clear if user is not properly authenticated
    if (!isLoggedIn || !token || !user) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log('Invalid session cleared to prevent auto-login');
    } else {
      console.log('Valid session preserved');
    }
  }
}

// ===== CART MANAGEMENT ===== //
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

// ===== WISHLIST MANAGEMENT ===== //
function getWishlist() {
  const userId = getCurrentUserId();
  const wishlistKey = userId ? `wishlist_${userId}` : 'wishlist_guest';
  return JSON.parse(localStorage.getItem(wishlistKey)) || [];
}

function saveWishlist(wishlist) {
  const userId = getCurrentUserId();
  const wishlistKey = userId ? `wishlist_${userId}` : 'wishlist_guest';
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
}

// ===== SEARCH FUNCTIONALITY ===== //
function initializeSearch() {
  const searchInputs = document.querySelectorAll('input[type="search"]');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 2) {
        console.log('Searching for:', query);
      }
    });
  });

  const searchForms = document.querySelectorAll('form');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      if (input && input.value.trim()) {
        window.location.href = `pages/product.html?search=${encodeURIComponent(input.value)}`;
      }
    });
  });
}

// ===== CATEGORY NAVIGATION ===== //
function navigateToCategory(category) {
  localStorage.setItem('selectedCategory', category);
  window.location.href = `pages/product.html?category=${encodeURIComponent(category)}`;
}

// ===== PRODUCT RENDERING ===== //
async function renderProducts(productList) {
  const container = document.getElementById("product-list");
  if (!container) return;

  try {
    // If no list provided, fetch from API
    if (!productList) {
      const resp = await fetch('http://localhost:4002/api/products');
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      productList = await resp.json();
      console.log('Fetched products:', productList);
    }
  } catch (e) {
    console.error('Failed to fetch products', e);
    container.innerHTML = `
      <div class="text-center py-8">
        <p class="text-red-500 mb-4">Failed to load products. Make sure Product Service is running on port 4002.</p>
        <p class="text-sm text-gray-500">Error: ${e.message}</p>
        <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-[#DC9C84] text-white rounded-lg hover:bg-[#93392C] transition">
          Retry
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  const wishlist = getWishlist();

  productList.forEach((product) => {
    const isWishlisted = wishlist.includes(product._id);

    const card = document.createElement("div");
    card.className = "group bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-2 relative";

    card.innerHTML = `
      <!-- Wishlist Button -->
      <button 
        class="wishlist-btn absolute right-4 top-4 z-20 rounded-full bg-white p-1.5 transition-colors shadow-md"
        data-id="${product._id}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="${isWishlisted ? "red" : "none"}" 
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
          class="size-5 ${isWishlisted ? "text-red-500" : "text-gray-900"}">
          <path stroke-linecap="round" stroke-linejoin="round" 
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 
            0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733
            -4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 
            7.22 9 12 9 12s9-4.78 9-12z"/>
        </svg>
      </button>

      <!-- Product Image -->
      <div class="aspect-square overflow-hidden">
        <img src="${product.image}" alt="${product.name}" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
      </div>

      <!-- Product Info -->
      <div class="p-4 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="bg-gray-100 px-2 py-1 text-xs font-medium rounded-full text-gray-600">
            ${product.category}
          </span>
        </div>
        <h3 class="text-sm font-semibold text-gray-900 line-clamp-2">${product.name}</h3>
        <p class="text-lg font-bold text-gray-900">Rp ${product.price.toLocaleString("id-ID")}</p>
        
        <!-- Action Buttons -->
        <div class="mt-3 flex space-x-2">
          <button class="view-detail flex-1 text-center rounded-md text-xs py-2 font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition" 
                  data-id="${product._id}">
            View Details
          </button>
          <button class="add-to-cart flex-1 text-center rounded-md text-xs py-2 font-medium text-white bg-[#DC9C84] hover:bg-[#93392C] transition" 
                  data-id="${product._id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Add event listeners
  addProductEventListeners();
}

// ===== PRODUCT EVENT LISTENERS ===== //
function addProductEventListeners() {
  // Add to Cart
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      
      try {
        // Fetch product details from API
        const response = await fetch(`http://localhost:4002/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const product = await response.json();
        
        let cart = getCart();
        const existing = cart.find((item) => item._id === productId);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ ...product, qty: 1 });
        }

        saveCart(cart);
        updateCartCount();
        
        // Show success message
        const originalText = e.target.textContent;
        e.target.textContent = "Added!";
        e.target.classList.add("bg-green-500");
        setTimeout(() => {
          e.target.textContent = originalText;
          e.target.classList.remove("bg-green-500");
        }, 1000);
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart');
      }
    });
  });

  // Wishlist toggle
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = btn.dataset.id;
      let wishlist = getWishlist();

      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((id) => id !== productId);
      } else {
        wishlist.push(productId);
      }

      saveWishlist(wishlist);
      // Re-render to update wishlist icons
      renderProducts();
    });
  });

  // View Details
  document.querySelectorAll(".view-detail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.id);
      window.location.href = `pages/detail.html?id=${productId}`;
    });
  });
}

// ===== INITIALIZATION ===== //
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM loaded, initializing...');
  
  try {
    // Initialize modals
    console.log('Initializing modals...');
    loginModal();
    signupModal();
    
    // Check login status and update header
    console.log('Checking login status...');
    checkAndUpdateLoginStatus();
    
    // Initialize cart count
    console.log('Initializing cart count...');
    updateCartCount();
    
    // Initialize search
    console.log('Initializing search...');
    initializeSearch();
    
    // Initialize manage products button
    console.log('Initializing manage products buttons...');
    const manageProductsBtn = document.getElementById("manage-products-btn");
    const manageProductsBtnUser = document.getElementById("manage-products-btn-user");
    
    if (manageProductsBtn) {
      manageProductsBtn.addEventListener("click", () => {
        console.log('Manage products clicked (guest)');
        window.location.href = "pages/admin.html";
      });
    }
    
    if (manageProductsBtnUser) {
      manageProductsBtnUser.addEventListener("click", () => {
        console.log('Manage products clicked (user)');
        window.location.href = "pages/admin.html";
      });
    }
    
    // Initialize logout button
    console.log('Initializing logout button...');
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
    
    // Initialize dropdown menu
    console.log('Initializing dropdown menu...');
    initializeDropdown();
    
    // Render products on homepage
    if (document.getElementById("product-list")) {
      console.log('Rendering products...');
      renderProducts(); // Fetch products from API instead of undefined variable
    }
    
    console.log('Initialization complete!');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

// Function to initialize dropdown menu
function initializeDropdown() {
  const myAccountBtn = document.getElementById('my-account-btn');
  const accountDropdown = document.getElementById('account-dropdown');
  
  if (myAccountBtn && accountDropdown) {
    myAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle dropdown
      accountDropdown.classList.toggle('hidden');
    });
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.group')) {
      if (accountDropdown) {
        accountDropdown.classList.add('hidden');
      }
    }
  });
}

// Function to check and update login status
function checkAndUpdateLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  console.log('Login status check:', { isLoggedIn, hasToken: !!token, hasUser: !!user });
  
  // Check if user is properly authenticated
  if (isLoggedIn && token && user) {
    try {
      // Try to parse user data to validate it
      const userData = JSON.parse(user);
      if (userData.id && userData.email) {
        console.log('User is properly authenticated, showing user header');
        toggleHeader(true);
        return;
      }
    } catch (e) {
      console.log('Invalid user data, clearing session');
    }
  }
  
  // If not properly authenticated, clear session and show guest header
  console.log('User not properly authenticated, showing guest header');
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toggleHeader(false);
}