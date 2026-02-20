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
const modalTitle = document.getElementById("modalTitle");
const prevArrow = document.getElementById("prevArrow");
const nextArrow = document.getElementById("nextArrow");
const filterBar = document.getElementById("filterBar");
const subFilterBar = document.getElementById("subFilterBar");
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
    if (Number(product.stock_count) === 0) {
      card.classList.add("out-of-stock");
    }

    /* SALE BADGE */
    if (product.old_price && product.old_price > product.price) {
      card.classList.add("on-sale");
    }

    /* PRICE DISPLAY */
    let priceHTML = product.price != null
  ? `<span class="price">£${product.price}</span>`
  : "";


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
  subFilterBar.style.display = "none";
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
  buildSubFilters(cat);
  setActive(btn);
};

    filterBar.appendChild(btn);
  });
}

function buildSubFilters(category) {
  subFilterBar.innerHTML = "";

  const subs = [...new Set(
    products
      .filter(p => p.category === category && p.subcategory)
      .map(p => p.subcategory)
  )];

  if (subs.length === 0) {
    subFilterBar.style.display = "none";
    return;
  }

  subFilterBar.style.display = "block";

  const allBtn = document.createElement("button");
allBtn.innerText = "All";
allBtn.className = "active";

allBtn.onclick = () => {
  document.querySelectorAll("#subFilterBar button")
    .forEach(b => b.classList.remove("active"));

  allBtn.classList.add("active");

  renderProducts(products.filter(p => p.category === category));
};


  subFilterBar.appendChild(allBtn);

  subs.forEach(sub => {
    const btn = document.createElement("button");
    btn.innerText = sub;

    btn.onclick = () => {
  document.querySelectorAll("#subFilterBar button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  renderProducts(
    products.filter(p =>
      p.category === category && p.subcategory === sub
    )
  );
};


    subFilterBar.appendChild(btn);
  });
}


/* =========================
   MODAL
========================= */

let currentImages = [];
let currentIndex = 0;

grid.addEventListener("click", async e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => p.id === card.dataset.id);
  if (!product) return;

  currentImages = [product.main_image, ...(product.extra_images || [])];
  currentIndex = 0;

  loadImages(currentImages);
  modalTitle.innerText = product.title;
  /* LOAD SIZES */
const sizesBox = document.getElementById("sizesContainer");
sizesBox.innerHTML = "";

const { data: sizes } = await supabase
  .from("product_sizes")
  .select("*")
  .eq("product_id", product.id);

if (sizes && sizes.length > 0) {
  sizesBox.innerHTML = `
    <div class="sizes-section">
      <h4>Select Size</h4>
      <div class="sizes-container">
        ${sizes.map(size => `
          <div class="size-pill ${!size.in_stock ? "out" : ""}">
            ${size.size_name}
          </div>
        `).join("")}
      </div>
    </div>
  `;

   /* SIZE SELECTOR LOGIC */
let selectedSize = null;

/* MULTI SIZE SELECTOR */
let selectedSizes = new Set();

sizesBox.querySelectorAll(".size-pill:not(.out)").forEach(pill => {
  pill.addEventListener("click", () => {

    // toggle selection
    if (pill.classList.contains("selected")) {
      pill.classList.remove("selected");
      selectedSizes.delete(pill.innerText);
    } else {
      pill.classList.add("selected");
      selectedSizes.add(pill.innerText);
    }

  });
});

}

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

prevArrow.onclick = (e) => {
  e.stopPropagation(); // prevents modal click interference
  const total = slider.children.length;
  if (total <= 1) return;

  currentIndex = (currentIndex - 1 + total) % total;
  updateSlide();
};

nextArrow.onclick = (e) => {
  e.stopPropagation();
  const total = slider.children.length;
  if (total <= 1) return;

  currentIndex = (currentIndex + 1) % total;
  updateSlide();
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


let startX = 0;

const slider = document.getElementById("modalSlider");

function loadImages(images) {
  slider.innerHTML = "";

  images.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    slider.appendChild(img);
  });

  currentIndex = 0;
  updateSlide();
}

function updateSlide() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;

  // FIX ARROWS VISIBILITY
  if (currentImages.length <= 1) {
    prevArrow.style.display = "none";
    nextArrow.style.display = "none";
    return;
  }

  prevArrow.style.display = currentIndex === 0 ? "none" : "block";
  nextArrow.style.display = currentIndex === currentImages.length - 1 ? "none" : "block";
}

/* TOUCH SWIPE */
slider.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
  let diff = startX - e.changedTouches[0].clientX;

  if (diff > 50 && currentIndex < slider.children.length - 1) {
    currentIndex++;
  }

  if (diff < -50 && currentIndex > 0) {
    currentIndex--;
  }

  updateSlide();
});

/* =========================
   SIZE GUIDE POPUP
========================= */

const sizeGuideBtn = document.getElementById("sizeGuideBtn");
const sizeGuideModal = document.getElementById("sizeGuideModal");
const closeSizeGuide = document.getElementById("closeSizeGuide");



// ✅ Put your size-guide image URLs here
// Use the raw github links or Supabase storage public links
const SIZE_GUIDE_IMAGE =
  "https://github.com/PremiumLibaas/PremiumLibaas/blob/main/size_chart_combined.png?raw=true";

let guideIndex = 0;
let guideStartX = 0;

const sizeGuideImg = document.getElementById("sizeGuideImg");
const sizeGuideScroll = document.getElementById("sizeGuideScroll");

function openSizeGuide() {
  sizeGuideImg.src = SIZE_GUIDE_IMAGE;

  // ✅ always start at top
  sizeGuideScroll.scrollTop = 0;

  sizeGuideModal.style.display = "flex";
}















