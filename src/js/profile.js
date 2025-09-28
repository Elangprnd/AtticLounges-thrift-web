// ===== PROFILE PAGE FUNCTIONALITY ===== //

// ===== CART FUNCTIONS ===== //
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
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

// ===== RENDER PROFILE ===== //
async function renderProfile() {
  let user = {
    name: "Demo User",
    email: "demo.user@example.com",
    phone: "0812-3456-7890",
    address: "123 Main St, Anytown, CA 90210",
    memberSince: "2023-01-15"
  };

  try {
    // Try to fetch user data from User Service
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch('http://localhost:4001/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        user = { ...user, ...userData };
        console.log('Fetched user data from backend:', user);
      } else {
        console.warn('Failed to fetch user data from backend');
      }
    }
  } catch (error) {
    console.warn('User service not available, using demo data:', error);
  }

  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email;
  document.getElementById('profile-phone').textContent = user.phone;
  document.getElementById('profile-address').textContent = user.address;
  document.getElementById('member-since').textContent = new Date(user.memberSince).toLocaleDateString();

  // Get total orders
  let orders = [];
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4003/api/orders', {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (response.ok) {
      orders = await response.json();
    } else {
      orders = JSON.parse(localStorage.getItem('orders')) || [];
    }
  } catch (error) {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  }
  
  document.getElementById('total-orders').textContent = orders.length;
}

// ===== INITIALIZE PROFILE PAGE ===== //
document.addEventListener("DOMContentLoaded", () => {
  renderProfile();
  updateCartCount();
});
