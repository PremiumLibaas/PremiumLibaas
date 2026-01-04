/* =========================
   PRODUCT DATA
========================= */

const products = [
  {
    id: "THB-0001",                // PERMANENT ID
    category: "thobe",
    subcategory: "men",
    title: "Classic Thobe",
    subtitle: "Premium Fabric",
    image: "thobe1.jpeg",
    extraImages: ["thobe1-2.jpeg"],
    oldPrice: "£39.99",
    price: "£25.00",
    links: {
      instagram: "https://instagram.com/premium_libaas",
      tiktok: "https://www.tiktok.com/@premium_libaas",
      facebook: "https://www.facebook.com/profile.php?id=61585372481020"
    }
  },
  {
    id: "ABY-0001",
    category: "abayah",
    subcategory: "luxury",
    title: "Elegant Abayah",
    subtitle: "Flowing Silhouette",
    image: "abayah1.webp",
    extraImages: ["abayah1-2.webp"],
    oldPrice: "",
    price: "£35.00",
    links: {
      instagram: "https://instagram.com/premium_libaas",
      tiktok: "https://www.tiktok.com/@premium_libaas",
      facebook: "https://www.facebook.com/profile.php?id=61585372481020"
    }
  }
];

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

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle}</span>
        ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ""}
        <span class="price">${product.price}</span>
        <span style="font-size:0.7em;opacity:0.5;margin-top:6px;">
          ID: ${product.id}
        </span>
      </div>
    `;

    if (product.oldPrice) card.classList.add("on-sale");

    grid.appendChild(card);
  });
}

renderProducts(products);

/* =========================
   FILTERS (CATEGORY ONLY FOR NOW)
========================= */

function filterItems(type) {
  document.querySelectorAll(".filters button").forEach(btn =>
    btn.classList.remove("active")
  );

  event.target.classList.add("active");

  if (type === "all") {
    renderProducts(products);
  } else {
    renderProducts(products.filter(p => p.category === type));
  }
}

/* =========================
   CLICK HANDLING
========================= */

grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (!card) return;

  const product = products.find(p => p.id === card.dataset.id);
  if (product) openModal(product);
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

  document.querySelector(".instagram").href = product.links.instagram;
  document.querySelector(".tiktok").href = product.links.tiktok;
  document.querySelector(".facebook").href = product.links.facebook;

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
