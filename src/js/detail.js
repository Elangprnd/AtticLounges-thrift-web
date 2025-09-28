// ===== PRODUCT DETAIL PAGE FUNCTIONALITY ===== //

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

// ===== WISHLIST FUNCTIONS ===== //
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

// ===== DUMMY REVIEWS ===== //
const productReviews = [
  {
    id: 1,
    productId: 1,
    author: "Sarah J.",
    rating: 5,
    comment: "Absolutely love this book! It's exactly as described and in great condition. Fast shipping.",
    date: "2024-07-10",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    productId: 1,
    author: "Michael B.",
    rating: 4,
    comment: "Good book, a bit more worn than expected but still a solid purchase. Fast shipping.",
    date: "2024-07-05",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    productId: 2,
    author: "Emily R.",
    rating: 5,
    comment: "Stunning book! Looks brand new. Very happy with my purchase.",
    date: "2024-07-12",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

// ===== RENDER PRODUCT DETAILS ===== //
async function renderProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  let product = null;
  try {
    const resp = await fetch(`http://localhost:4002/api/products/${productId}`);
    if (resp.ok) product = await resp.json();
  } catch (e) {
    console.error('Failed to fetch product detail', e);
  }

  if (!product) {
    document.getElementById('product-details').innerHTML = '<p class="text-center text-red-500 text-xl">Product not found!</p>';
    return;
  }

  // Update breadcrumb
  const breadcrumbProduct = document.getElementById('breadcrumb-product');
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.name;
  }

  // Populate product details
  const elements = {
    'product-image': { src: product.image, alt: product.name },
    'product-category': { textContent: product.category },
    'product-condition': { textContent: 'Good' },
    'product-name': { textContent: product.name },
    'product-brand': { textContent: 'Attic Lounges' },
    'product-price': { textContent: `Rp ${product.price.toLocaleString("id-ID")}` },
    'product-description': { textContent: `High-quality ${product.category.toLowerCase()} in excellent condition. Perfect for your collection.` },
    'spec-brand': { textContent: 'Attic Lounges' },
    'spec-size': { textContent: 'One Size' },
    'spec-condition': { textContent: 'Good' },
    'spec-category': { textContent: product.category }
  };

  Object.entries(elements).forEach(([id, props]) => {
    const element = document.getElementById(id);
    if (element) {
      Object.entries(props).forEach(([prop, value]) => {
        element[prop] = value;
      });
    }
  });

  // Update wishlist button state
  const wishlistBtn = document.getElementById('wishlist-btn');
  if (wishlistBtn) {
    let wishlist = getWishlist();
    if (wishlist.includes(product.id)) {
      wishlistBtn.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="red" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                              </svg>`;
    } else {
      wishlistBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                              </svg>`;
    }
  }

  // Add to Cart button event listener
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      let cart = getCart();
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...product, qty: 1 });
      }
      saveCart(cart);
      alert(`${product.name} added to cart!`);
    });
  }

  // Buy Now button event listener
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      // Directly go to checkout with this single item
      localStorage.setItem("checkoutItems", JSON.stringify([{ ...product, qty: 1 }]));
      window.location.href = "../pages/payment.html";
    });
  }

  // Wishlist button event listener
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      let wishlist = getWishlist();
      if (wishlist.includes(product.id)) {
        wishlist = wishlist.filter(id => id !== product.id);
      } else {
        wishlist.push(product.id);
      }
      saveWishlist(wishlist);
      renderProductDetails(); // Re-render to update wishlist icon
    });
  }

  // Render reviews for this product
  renderReviews(productId);
}

// ===== RENDER REVIEWS ===== //
function renderReviews(productId) {
  const reviewsContainer = document.getElementById('reviews-container');
  if (!reviewsContainer) return;

  reviewsContainer.innerHTML = '';
  const reviewsForProduct = productReviews.filter(review => review.productId === productId);

  if (reviewsForProduct.length === 0) {
    reviewsContainer.innerHTML = '<p class="text-gray-500">No reviews yet for this product.</p>';
    return;
  }

  reviewsForProduct.forEach(review => {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'bg-gray-50 p-4 rounded-lg shadow-sm';
    reviewDiv.innerHTML = `
      <div class="flex items-center mb-2">
        <img src="${review.avatar}" alt="${review.author}" class="w-10 h-10 rounded-full mr-3">
        <div>
          <p class="font-semibold text-gray-800">${review.author}</p>
          <div class="flex text-yellow-400 text-sm">
            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
          </div>
        </div>
      </div>
      <p class="text-gray-700 mt-2">${review.comment}</p>
      <p class="text-xs text-gray-500 mt-2">Reviewed on: ${new Date(review.date).toLocaleDateString()}</p>
    `;
    reviewsContainer.appendChild(reviewDiv);
  });
}

// ===== INITIALIZE DETAIL PAGE ===== //
document.addEventListener("DOMContentLoaded", () => {
  renderProductDetails();
  updateCartCount();
});
