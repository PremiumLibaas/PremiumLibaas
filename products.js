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

    /* OUT OF STOCK */
    if (!product.stock_count || product.stock_count <= 0) {
      card.classList.add("out-of-stock");
    }

    /* SALE BADGE */
    if (product.old_price && product.old_price > product.price) {
      card.classList.add("on-sale");
    }

    /* PRICE DISPLAY */
    let priceHTML = `<span class="price">£${product.price}</span>`;

    if (product.old_price && product.old_price > product.price) {
      priceHTML = `
        <span class="old-price">£${product.old_price}</span>
        <span class="price">£${product.price}</span>
      `;
    }

    card.innerHTML = `
      <img src="${product.main_image}" alt="${product.title}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle || ""}</span>
        ${priceHTML}
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

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  function setActive(btn) {
    document.querySelectorAll("#filterBar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  /* ALL BUTTON */
  const allBtn = document.createElement("button");
  allBtn.className = "active";
  allBtn.innerText = "All";

  allBtn.onclick = () => {
    activeCategory = "all";
    renderProducts(products);
    setActive(allBtn);
  };

  filterBar.appendChild(allBtn);

  /* CATEGORY BUTTONS */
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;

    btn.onclick = () => {
      activeCategory = cat;
      const filtered = products.filter(p => p.category === cat);
      renderProducts(filtered);
      setActive(btn);
    };

    filterBar.appendChild(btn);
  });
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

window.closeModal = function () {
  modal.style.display = "none";
};

/* CLOSE WHEN CLICKING OUTSIDE */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

/* =========================
   CONTACT DROPDOWN
========================= */

const contactBtn = document.getElementById("contactBtn");
const contactDropdown = document.getElementById("contactDropdown");

contactBtn.addEventListener("click", () => {
  contactDropdown.style.display =
    contactDropdown.style.display === "block" ? "none" : "block";
});

/* CLOSE DROPDOWN WHEN CLICK OUTSIDE */
document.addEventListener("click", (e) => {
  if (!contactBtn.contains(e.target) && !contactDropdown.contains(e.target)) {
    contactDropdown.style.display = "none";
  }
});



