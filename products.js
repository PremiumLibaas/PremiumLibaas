/* =========================
   SUPABASE SETUP
========================= */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  "https://gemntdgboyxotbuwpiss.supabase.co",
  "sb_publishable_PCnYzjM7FYGxrcEJb-sihg_B7xInX6Y"
);

/* =========================
   GLOBAL BUY LINKS
========================= */
const BUY_LINKS = {
  instagram: "https://instagram.com/premium_libaas",
  tiktok: "https://www.tiktok.com/@premium_libaas",
  facebook: "https://www.facebook.com/profile.php?id=61585372481020"
};

/* =========================
   STATE
========================= */
let products = [];
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
const filterBar = document.getElementById("filterBar");
const subFilterBar = document.getElementById("subFilterBar");
const contactBtn = document.getElementById("contactBtn");
const contactDropdown = document.getElementById("contactDropdown");

/* =========================
   LOAD PRODUCTS FROM SUPABASE
========================= */
async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error("Error loading products:", error);
    return;
  }

  products = data;
  buildFilters(products);
  renderProducts(products);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});


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

    if (!product.in_stock || product.stock_count <= 0) {
      card.classList.add("out-of-stock");
    }

    if (product.old_price) {
      card.classList.add("on-sale");
    }

    card.innerHTML = `
      <img src="${product.main_image}" alt="${product.title}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle || ""}</span>
        ${product.old_price ? `<span class="old-price">£${product.old_price}</span>` : ""}
        <span class="price">£${product.price}</span>
        ${(!product.in_stock || product.stock_count <= 0) ? `<span class="stock-badge">Out of Stock</span>` : ""}
        <span class="product-id">ID: ${product.id}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* =========================
   FILTERS
========================= */
function buildFilters(products) {
  if (!filterBar) return;
  filterBar.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";
  allBtn.onclick = () => filterItems("all", allBtn);
  filterBar.appendChild(allBtn);

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.innerText = category.charAt(0).toUpperCase() + category.slice(1);
    btn.onclick = () => filterItems(category, btn);
    filterBar.appendChild(btn);
  });
}

function filterItems(category, button) {
  activeCategory = category;
  activeSubcategory = "all";

  document.querySelectorAll("#filterBar button").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  let filtered = products;
  if (category !== "all") filtered = products.filter(p => p.category === category);

  buildSubFilters(filtered);
  renderProducts(filtered);
}

function buildSubFilters(filteredProducts) {
  if (!subFilterBar) return;
  const subcategories = [...new Set(filteredProducts.map(p => p.subcategory).filter(Boolean))];

  if (subcategories.length === 0) {
    subFilterBar.style.display = "none";
    subFilterBar.innerHTML = "";
    return;
  }

  subFilterBar.style.display = "block";
  subFilterBar.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";
  allBtn.onclick = () => filterSubItems("all", allBtn);
  subFilterBar.appendChild(allBtn);

  subcategories.forEach(sub => {
    const btn = document.createElement("button");
    btn.innerText = sub.charAt(0).toUpperCase() + sub.slice(1);
    btn.onclick = () => filterSubItems(sub, btn);
    subFilterBar.appendChild(btn);
  });
}

function filterSubItems(subcategory, button) {
  activeSubcategory = subcategory;

  document.querySelectorAll("#subFilterBar button").forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");

  let result = products;
  if (activeCategory !== "all") result = products.filter(p => p.category === activeCategory);
  if (subcategory !== "all") result = result.filter(p => p.subcategory === subcategory);

  renderProducts(result);
}

/* =========================
   MODAL LOGIC
========================= */
let currentImages = [];
let currentIndex = 0;

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => p.id == card.dataset.id); // double equals works
// OR
const product = products.find(p => p.id === Number(card.dataset.id));

  if (!product || !product.in_stock || product.stock_count <= 0) return;

  openModal(product);
});

function openModal(product) {
  currentImages = [product.main_image, ...(product.extra_images || [])];
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

function closeModal() { modal.style.display = "none"; }

prevArrow.onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

nextArrow.onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

/* =========================
   CONTACT DROPDOWN
========================= */
contactBtn?.addEventListener("click", e => {
  e.stopPropagation();
  contactDropdown.style.display = contactDropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", e => {
  if (contactBtn && !contactBtn.contains(e.target) && !contactDropdown.contains(e.target)) {
    contactDropdown.style.display = "none";
  }
});




