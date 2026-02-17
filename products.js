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
const closeBtn = document.querySelector(".close");

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  products = data;
  buildFilters();
  renderProducts(products);
}

loadProducts();

/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts(list) {
  grid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = product.id;

    if (!product.in_stock || product.stock_count <= 0) {
      card.classList.add("out-of-stock");
    }

    card.innerHTML = `
      <img src="${product.main_image}" alt="${product.title}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle || ""}</span>
        <span class="price">£${product.price}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   FILTERS
========================= */

function buildFilters() {
  filterBar.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";
  allBtn.onclick = () => renderProducts(products);

  filterBar.appendChild(allBtn);
}

/* =========================
   MODAL
========================= */

let currentImages = [];
let currentIndex = 0;

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => p.id === card.dataset.id);
  if (!product) return;

  currentImages = [product.main_image, ...(product.extra_images || [])];
  currentIndex = 0;

  modalImg.src = currentImages[currentIndex];
  modalTitle.innerText = product.title;

  // Set social links safely
  document.querySelector(".instagram").setAttribute("href", BUY_LINKS.instagram);
  document.querySelector(".tiktok").setAttribute("href", BUY_LINKS.tiktok);
  document.querySelector(".facebook").setAttribute("href", BUY_LINKS.facebook);

  // Show/hide arrows depending on image count
  prevArrow.style.display = currentImages.length > 1 ? "block" : "none";
  nextArrow.style.display = currentImages.length > 1 ? "block" : "none";

  modal.style.display = "flex";
});

/* =========================
   ARROW NAVIGATION
========================= */

prevArrow.onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

nextArrow.onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

/* =========================
   CLOSE MODAL
========================= */

function closeModal() {
  modal.style.display = "none";
}

if (closeBtn) closeBtn.onclick = closeModal;

// Close when clicking outside image
window.onclick = e => {
  if (e.target === modal) closeModal();
};
