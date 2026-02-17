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

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error(error);
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

    card.innerHTML = `
      <img src="${product.main_image}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle}</span>
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

  const btn = document.createElement("button");
  btn.innerText = "All";
  btn.className = "active";
  btn.onclick = () => renderProducts(products);

  filterBar.appendChild(btn);
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

  currentImages = [product.main_image, ...(product.extra_images || [])];
  currentIndex = 0;

  modalImg.src = currentImages[currentIndex];
  modalTitle.innerText = product.title;

  modal.style.display = "flex";
});

prevArrow.onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

nextArrow.onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};
