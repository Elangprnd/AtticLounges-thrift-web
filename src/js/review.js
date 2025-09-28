// Carousel Logic
  const slides = document.getElementById("review-slides");
  let currentIndex = 0;
  const totalSlides = slides.children.length;

  document.getElementById("next-btn").addEventListener("click", () => {
    if (currentIndex < totalSlides - 1) currentIndex++;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  // Review Form Logic
  let rating = 0;
  const stars = document.getElementById("rating-stars");
  stars.addEventListener("click", (e) => {
    if (e.target.textContent === "★") {
      rating = [...stars.children].indexOf(e.target) + 1;
      stars.innerHTML = "★★★★★".split("").map((s, i) =>
        `<span class="${i < rating ? "text-orange-400" : "text-gray-300"}">★</span>`
      ).join("");
    }
  });

  document.getElementById("review-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = document.getElementById("review-text").value;
    if (!rating || !text.trim()) {
      alert("Tolong isi rating dan ulasan!");
      return;
    }

    // Buat card baru (dummy simulasi, nanti bisa fetch ke backend)
    const newCard = document.createElement("div");
    newCard.className = "min-w-full md:min-w-1/3 px-4";
    newCard.innerHTML = `
      <div class="bg-white p-6 rounded-2xl shadow-md">
        <div class="flex items-center mb-4">
          <img class="w-12 h-12 rounded-full mr-4 ring-2 ring-gray-200"
               src="https://i.pinimg.com/736x/ff/fb/32/fffb321d6eb56bb785e8a8e731a5846f.jpg"
               alt="User">
          <div>
            <p class="font-semibold text-gray-900">User Baru</p>
            <p class="text-sm text-gray-500">Verified Buyer</p>
          </div>
        </div>
        <p class="text-gray-700 italic mb-3">“${text}”</p>
        <div class="flex text-orange-400">
          ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
        </div>
      </div>
    `;
    slides.appendChild(newCard);
    document.getElementById("review-form").reset();
    rating = 0;
    stars.innerHTML = "★★★★★";
  });