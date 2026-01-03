/* =========================
   PRODUCT DATA
========================= */

const products = [
  {
    id: "thobe-classic",
    name: "Classic Thobe",
    category: "thobe",
    price: 25,
    oldPrice: 39.99,
    inStock: true,
    images: ["thobe1.jpeg", "thobe1-2.jpeg"]
  },
  {
    id: "abayah-elegant",
    name: "Elegant Abayah",
    category: "abayah",
    price: 35,
    oldPrice: null,
    inStock: true,
    images: ["abayah1.webp", "abayah1-2.webp"]
  }
];

/* =========================
   RENDER PRODUCTS
========================= */

const grid = document.getElementById("productGrid");

function renderProducts(filter = "all") {
  grid.innerHTML = "";

  products.forEach(product => {
    if (filter !== "all" && product.category !== filter) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        ${product.oldPrice ? `<span class="old-price">£${product.oldPrice}</span>` : ""}
        <span class="price">£${product.price}</span>
      </div>
    `;

    card.onclick = () => openModal(product);
    grid.appendChild(card);
  });
}

renderProducts();

/* =========================
   FILTER BUTTONS
========================= */

function filterItems(type) {
  document.querySelectorAll(".filters button").forEach(btn =>
    btn.classList.remove("active")
  );
  event.target.classList.add("active");
  renderProducts(type);
}

/* =========================
   MODAL
========================= */

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");

let currentImages = [];
let currentIndex = 0;

function openModal(product) {
  modal.style.display = "flex";
  modalTitle.innerText = product.name;
  currentImages = product.images;
  currentIndex = 0;
  modalImg.src = currentImages[currentIndex];
}

function closeModal() {
  modal.style.display = "none";
}
