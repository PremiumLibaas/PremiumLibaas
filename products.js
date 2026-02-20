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
let selectedSizes = new Set();
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
const sizesContainer = document.getElementById("sizesContainer");

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
  selectedSizes.clear();
  /* LOAD SIZES */
const sizesBox = document.getElementById("sizesContainer");
sizesBox.innerHTML = "";

const { data: sizes, error: sizesError } = await supabase
  .from("product_sizes")
  .select("*")
  .eq("product_id", product.id);

if (sizesError) {
  console.error("Sizes load error:", sizesError);
}

if (sizes && sizes.length > 0) {
  sizesBox.innerHTML = `
    <div class="sizes-section">
      <h4>Select Size</h4>
      <div class="sizes-container">
        ${sizes.map(size => `
          <div class="size-pill ${!size.in_stock ? "out" : ""}" data-size="${size.size_name}">
  ${size.size_name}
</div>
            ${size.size_name}
          </div>
        `).join("")}
      </div>
    </div>
  `;
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

prevArrow.onclick = () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateSlide();
};

nextArrow.onclick = () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
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
   SIZE SELECT LOGIC
========================= */

if (sizesContainer) {
  sizesContainer.addEventListener("click", (e) => {
    const pill = e.target.closest(".size-pill");
    if (!pill) return;

    if (pill.classList.contains("out")) return;

    const size = pill.dataset.size;

    if (selectedSizes.has(size)) {
      selectedSizes.delete(size);
      pill.classList.remove("selected");
    } else {
      selectedSizes.add(size);
      pill.classList.add("selected");
    }
  });
}
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
















