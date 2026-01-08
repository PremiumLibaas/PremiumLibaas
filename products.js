/* =========================
   GLOBAL BUY LINKS
========================= */

const BUY_LINKS = {
  instagram: "https://instagram.com/premium_libaas",
  tiktok: "https://www.tiktok.com/@premium_libaas",
  facebook: "https://www.facebook.com/profile.php?id=61585372481020"
};


/* =========================
   FILTER STATE
========================= */

let activeCategory = "all";
let activeSubcategory = "all";


/* =========================
   DOM ELEMENTS
========================= */

const grid = document.getElementById("productGrid");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const prevArrow = document.getElementById("prevArrow");
const nextArrow = document.getElementById("nextArrow");

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(list) {
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = `card ${product.category}`;
    card.dataset.id = product.id;

    if (!product.inStock) {
      card.classList.add("out-of-stock");
    }

    if (product.oldPrice) {
      card.classList.add("on-sale");
    }

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle}</span>

        ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ""}
        <span class="price">${product.price}</span>

        ${
          !product.inStock
            ? `<span class="stock-badge">Out of Stock</span>`
            : `<span class="stock-badge in-stock">In Stock</span>`
        }
      </div>
    `;

    grid.appendChild(card);
  });
}




/* =========================
   AUTO-GENERATE FILTERS
========================= */

const filterBar = document.getElementById("filterBar");

function buildFilters(products) {
  if (!filterBar) return;

  filterBar.innerHTML = "";

  // Always add "All"
  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";
  allBtn.onclick = () => filterItems("all", allBtn);
  filterBar.appendChild(allBtn);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    btn.onclick = () => filterItems(category, btn);
    filterBar.appendChild(btn);
  });
}


buildFilters(products);
renderProducts(products);

function buildSubFilters(filteredProducts) {
  const subBar = document.getElementById("subFilterBar");
  if (!subBar) return;

  const subcategories = [
    ...new Set(
      filteredProducts
        .map(p => p.subcategory)
        .filter(Boolean)
    )
  ];

  if (subcategories.length === 0) {
    hideSubFilters();
    return;
  }

  subBar.style.display = "block";
  subBar.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";
  allBtn.onclick = () => filterSubItems("all", allBtn);
  subBar.appendChild(allBtn);

  subcategories.forEach(sub => {
    const btn = document.createElement("button");
    btn.innerText = sub.charAt(0).toUpperCase() + sub.slice(1);
    btn.onclick = () => filterSubItems(sub, btn);
    subBar.appendChild(btn);
  });
}

function filterSubItems(subcategory, button) {
  activeSubcategory = subcategory;

  document.querySelectorAll("#subFilterBar button").forEach(btn =>
    btn.classList.remove("active")
  );

  if (button) button.classList.add("active");

  let result = products.filter(p => p.category === activeCategory);

  if (subcategory !== "all") {
    result = result.filter(p => p.subcategory === subcategory);
  }

  renderProducts(result);
}

function hideSubFilters() {
  const subBar = document.getElementById("subFilterBar");
  if (!subBar) return;
  subBar.style.display = "none";
  subBar.innerHTML = "";
}



/* =========================
   FILTERS (CATEGORY ONLY FOR NOW)
========================= */

function filterItems(category, button) {
  activeCategory = category;
  activeSubcategory = "all";

  document.querySelectorAll("#filterBar button").forEach(btn =>
    btn.classList.remove("active")
  );

  if (button) button.classList.add("active");

  if (category === "all") {
    renderProducts(products);
    hideSubFilters();
    return;
  }

  const filtered = products.filter(p => p.category === category);
  renderProducts(filtered);
  buildSubFilters(filtered);
}



/* =========================
   CLICK HANDLING
========================= */

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => p.id === card.dataset.id);
  if (!product) return;

  // 🚫 Stop out-of-stock products opening the modal
  if (!product.inStock) return;

  openModal(product);
});


/* =========================
   MODAL LOGIC
========================= */

let currentImages = [];
let currentIndex = 0;

function openModal(product) {
  currentImages = [product.image, ...product.extraImages];
  currentIndex = 0;

  modalImg.src = currentImages[currentIndex];
  modalTitle.innerText = product.title;

  document.querySelector(".instagram").href = BUY_LINKS.instagram;
document.querySelector(".tiktok").href = BUY_LINKS.tiktok;
document.querySelector(".facebook").href = BUY_LINKS.facebook;

  prevArrow.style.display = currentImages.length > 1 ? "block" : "none";
  nextArrow.style.display = currentImages.length > 1 ? "block" : "none";

  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

prevArrow.onclick = e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

nextArrow.onclick = e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

/* =========================
   CONTACT DROPDOWN
========================= */

const contactBtn = document.getElementById("contactBtn");
const contactDropdown = document.getElementById("contactDropdown");

contactBtn?.addEventListener("click", e => {
  e.stopPropagation();
  contactDropdown.style.display =
    contactDropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", e => {
  if (
    contactBtn &&
    !contactBtn.contains(e.target) &&
    !contactDropdown.contains(e.target)
  ) {
    contactDropdown.style.display = "none";
  }
});
