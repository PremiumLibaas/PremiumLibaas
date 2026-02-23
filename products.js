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
  instagram: "https://ig.me/m/premium_libaas",
  tiktok: "https://www.tiktok.com/@premium_libaas",
  facebook: "https://m.me/61585372481020",
  whatsapp: "https://wa.me/447442540408"
};

function formatGBP(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `£${n.toFixed(2)}`;
}

/* =========================
   REQUEST SIZE: FULL SIZE LIST
========================= */

/* ✅ Replace this list with YOUR exact sizes (50M, 54XL etc) */
const ALL_REQUEST_SIZES = [
  "50M","50L","50XL","52M","52L","52XL","54M","54L","54XL","54XXL","56M","56L","56XL","56XXL","58L","58XL","60XXL","62XXXL","64XXL","64XXXXL"
];

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
const requestSizeBtn = document.getElementById("requestSizeBtn");
const requestSizesBox = document.getElementById("requestSizesBox");
const requestSizesContainer = document.getElementById("requestSizesContainer");
const requestClearBtn = document.getElementById("requestClearBtn");
const requestDoneBtn = document.getElementById("requestDoneBtn");
const requestSelectedText = document.getElementById("requestSelectedText");
const sizeQtySection = document.getElementById("sizeQtySection");
const sizeQtyList = document.getElementById("sizeQtyList");
const slider = document.getElementById("modalSlider");
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

    // convert to numbers once
const priceNum = Number(product.price);
const oldNum = Number(product.old_price);

/* SALE BADGE */
if (Number.isFinite(oldNum) && Number.isFinite(priceNum) && oldNum > priceNum) {
  card.classList.add("on-sale");
}

/* PRICE DISPLAY */
let priceHTML = Number.isFinite(priceNum)
  ? `<span class="price">${formatGBP(priceNum)}</span>`
  : "";

if (Number.isFinite(oldNum) && Number.isFinite(priceNum) && oldNum > priceNum) {
  priceHTML = `
    <span class="old-price">${formatGBP(oldNum)}</span>
    <span class="price">${formatGBP(priceNum)}</span>
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
let currentProduct = null;
let selectedSizes = new Map(); // sizeName -> qty
let requestedSizes = new Set();   // requested sizes

// requestedSizes already exists in your code
/* =========================
   REQUEST SIZE LOGIC
========================= */


function renderRequestSizes() {
  requestSizesContainer.innerHTML = "";

  ALL_REQUEST_SIZES.forEach(sz => {
    const pill = document.createElement("div");
    pill.className = "size-pill"; // uses your existing pill style
    pill.textContent = sz;

    if (requestedSizes.has(sz)) pill.classList.add("selected");

    pill.addEventListener("click", () => {
      if (pill.classList.contains("selected")) {
        pill.classList.remove("selected");
        requestedSizes.delete(sz);
      } else {
        pill.classList.add("selected");
        requestedSizes.add(sz);
      }

      updateRequestedText();
    });

    requestSizesContainer.appendChild(pill);
  });

  updateRequestedText();
}

function updateRequestedText(mode = "selecting") {
  if (!requestSelectedText) return;
  const arr = [...requestedSizes];

  if (arr.length === 0) {
    requestSelectedText.textContent = "";
    return;
  }

  if (mode === "done") {
    requestSelectedText.textContent = "✓ Size request added — please enter your details below and choose a platform to send your request";
  } else {
    requestSelectedText.textContent = `Selected: ${arr.join(", ")}`;
  }
}

function setSizeQty(sizeName, qty) {
  const q = Math.max(1, Number(qty || 1));
  selectedSizes.set(sizeName, q);
  renderSizeQtyUI();
}

function removeSize(sizeName) {
  selectedSizes.delete(sizeName);
  renderSizeQtyUI();
}

function renderSizeQtyUI() {
  if (!sizeQtySection || !sizeQtyList) return;

  const entries = [...selectedSizes.entries()]; // [ [size, qty], ... ]
  if (entries.length === 0) {
    sizeQtySection.style.display = "none";
    sizeQtyList.innerHTML = "";
    return;
  }

  sizeQtySection.style.display = "block";
  sizeQtyList.innerHTML = entries.map(([size, qty]) => `
    <div class="sizeqty-row" data-size="${size}">
      <div class="sizeqty-size">${size}</div>
      <div class="sizeqty-controls">
        <button class="sizeqty-btn minus" type="button">−</button>
        <div class="sizeqty-value">${qty}</div>
        <button class="sizeqty-btn plus" type="button">+</button>
      </div>
    </div>
  `).join("");

  // attach button handlers
  sizeQtyList.querySelectorAll(".sizeqty-row").forEach(row => {
    const size = row.dataset.size;
    const minus = row.querySelector(".minus");
    const plus = row.querySelector(".plus");

    minus.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cur = selectedSizes.get(size) || 1;
      setSizeQty(size, Math.max(1, cur - 1));
    });

    plus.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cur = selectedSizes.get(size) || 1;
      setSizeQty(size, cur + 1);
    });
  });
}

grid.addEventListener("click", async e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => String(p.id) === card.dataset.id);
  if (!product) return;

  currentProduct = product;
  selectedSizes = new Map();
  requestedSizes = new Set();
  renderSizeQtyUI();
  
  

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



/* MULTI SIZE SELECTOR */

sizesBox.querySelectorAll(".size-pill:not(.out)").forEach(pill => {
  pill.addEventListener("click", () => {
    const sizeName = pill.innerText.trim();

    // toggle select
    if (pill.classList.contains("selected")) {
      pill.classList.remove("selected");
      removeSize(sizeName);
    } else {
      pill.classList.add("selected");
      setSizeQty(sizeName, 1); // default qty 1 for that size
    }
  });
});

}

  // Set social links safely
  document.querySelector(".instagram").setAttribute("href", BUY_LINKS.instagram);
  document.querySelector(".tiktok").setAttribute("href", BUY_LINKS.tiktok);
  document.querySelector(".facebook").setAttribute("href", BUY_LINKS.facebook);
  document.querySelector(".whatsapp").setAttribute("href", BUY_LINKS.whatsapp);

  // Show/hide arrows depending on image count
  prevArrow.style.display = currentImages.length > 1 ? "block" : "none";
  nextArrow.style.display = currentImages.length > 1 ? "block" : "none";
    // ✅ reset request-size UI every time modal opens
  requestedSizes = new Set();
  requestSizesBox.style.display = "none";
  requestSelectedText.textContent = "";
  renderRequestSizes();
  const pasteHint = document.getElementById("pasteHint");
  if (pasteHint) pasteHint.style.display = "none";
  const requestHint = document.getElementById("requestSendHint");
  if (requestHint) requestHint.style.display = "none";
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
});

/* =========================
   ARROW NAVIGATION
========================= */

prevArrow.onclick = (e) => {
  if (!slider || slider.children.length === 0) return;

  e.stopPropagation();
  const total = slider.children.length;
  if (total <= 1) return;

  currentIndex = (currentIndex - 1 + total) % total;
  updateSlide();
};

nextArrow.onclick = (e) => {
  if (!slider || slider.children.length === 0) return;

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
  document.body.classList.remove("modal-open");
};

/* CLOSE WHEN CLICKING OUTSIDE */
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
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

sizeGuideBtn.addEventListener("click", openSizeGuide);

closeSizeGuide.addEventListener("click", () => {
  sizeGuideModal.style.display = "none";
});

sizeGuideModal.addEventListener("click", (e) => {
  if (e.target === sizeGuideModal) sizeGuideModal.style.display = "none";
});

/* =========================
   REQUEST SIZE BUTTON EVENTS
========================= */

requestSizeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const isOpen = requestSizesBox.style.display === "block";
  requestSizesBox.style.display = isOpen ? "none" : "block";

  if (!isOpen) {
  renderRequestSizes();
  updateRequestedText("selecting");
  }
});

requestClearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  requestedSizes.clear();
  renderRequestSizes();

  const hint = document.getElementById("requestSendHint");
  if (hint) hint.style.display = "none";
});

requestDoneBtn.addEventListener("click", (e) => {
  e.preventDefault();
  requestSizesBox.style.display = "none";
  updateRequestedText("done");
  const hint = document.getElementById("requestSendHint");
  if (!hint) return;

  if (requestedSizes.size > 0) {
    hint.style.display = "block";
  } else {
    hint.style.display = "none";
  }
});
function getBuyerInfo() {
  const name = document.getElementById("buyerName")?.value?.trim() || "";
  const phone = document.getElementById("buyerPhone")?.value?.trim() || "";
  const email = document.getElementById("buyerEmail")?.value?.trim() || "";
  const address = document.getElementById("buyerAddress")?.value?.trim() || "";
  return { name, phone, email, address };
}

function buildOrderMessage(platformName = "") {
  const { name, phone, email, address } = getBuyerInfo();

  const selectedEntries = [...selectedSizes.entries()]; // size -> qty
  const selectedLine = selectedEntries.length
  ? selectedEntries.map(([s, q]) => `${s} x${q}`).join(", ")
  : "None selected";
  const requested = [...requestedSizes];

  const productName = currentProduct?.title || "";
  const productId = currentProduct?.id ?? "";
  const subtitle = currentProduct?.subtitle || "";

  return [
    "Assalamu alaikum,",
    "",
    `I'd like to place an order via ${platformName || "your store"}.`,
    "",
    `Product: ${productName}${subtitle ? ` (${subtitle})` : ""}`,
    `Product ID: ${productId}`,
    `Selected size(s): ${selectedLine}`,
    `Requested size(s): ${requested.length ? requested.join(", ") : "None"}`,
    "",
    "Customer details:",
    `Name: ${name || "—"}`,
    `Phone: ${phone || "—"}`,
    `Email: ${email || "—"}`,
    `Address: ${address || "—"}`,
    "",
    "JazakAllah khair."
  ].join("\n");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  }
}

function showCopyToast() {
  const toast = document.getElementById("copyToast");
  if (!toast) return;
  toast.style.display = "block";

  const hint = document.getElementById("pasteHint");
  if (hint) hint.style.display = "block";   //
   
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}


function openWithCopiedMessage(platformName, url) {
  return async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentProduct) return;

    const msg = buildOrderMessage(platformName);
    await copyText(msg);
    showCopyToast();

    window.open(url, "_blank");
  };
}

// Instagram / TikTok / Facebook: copy then open
document.querySelector(".instagram")?.addEventListener(
  "click",
  openWithCopiedMessage("Instagram", BUY_LINKS.instagram)
);

document.querySelector(".tiktok")?.addEventListener(
  "click",
  openWithCopiedMessage("TikTok", BUY_LINKS.tiktok)
);

document.querySelector(".facebook")?.addEventListener(
  "click",
  openWithCopiedMessage("Facebook", BUY_LINKS.facebook)
);

// WhatsApp: open with prefilled message + also copies
document.querySelector(".whatsapp")?.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!currentProduct) return;

  const msg = buildOrderMessage("WhatsApp");
  await copyText(msg);
  showCopyToast();

  const waUrl = `${BUY_LINKS.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
});































