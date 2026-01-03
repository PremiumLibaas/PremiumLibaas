/* =======================
   PRODUCT DATA
======================= */
const products = [
  {
    id: "thobe-classic-black",
    category: "thobe",
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
    id: "abayah-elegant-flow",
    category: "abayah",
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

/* =======================
   RENDER PRODUCTS
======================= */
const grid = document.getElementById("productGrid");

function renderProducts(list) {
  grid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = `card ${product.category}`;
    card.dataset.id = product.id;

    card.innerHTML = `
      <img src="${product.image}">
      <div class="info">
        <h3>${product.title}</h3>
        <span>${product.subtitle}</span>
        ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ""}
        <span class="price">${product.price}</span>
      </div>
    `;

    card.addEventListener("click", () => openModal(product));
    grid.appendChild(card);
  });

  applySaleBadges();
}

renderProducts(products);

/* =======================
   FILTERS
======================= */
function filterItems(type) {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") renderProducts(products);
  else renderProducts(products.filter(p => p.category === type));
}

/* =======================
   SALE BADGE
======================= */
function applySaleBadges() {
  document.querySelectorAll(".card").forEach(card => {
    if (card.querySelector(".old-price")) {
      card.classList.add("on-sale");
    }
  });
}

/* =======================
   MODAL
======================= */
let currentImages = [];
let currentIndex = 0;

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const prevArrow = document.getElementById("prevArrow");
const nextArrow = document.getElementById("nextArrow");

function openModal(product) {
  currentImages = [product.image, ...product.extraImages];
  currentIndex = 0;

  modalImg.src = currentImages[0];
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

prevArrow.addEventListener("click", e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

nextArrow.addEventListener("click", e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
});

/* =======================
   CONTACT DROPDOWN (FIXED)
======================= */
const contactBtn = document.getElementById("contactBtn");
const contactDropdown = document.getElementById("contactDropdown");

contactBtn.addEventListener("click", e => {
  e.stopPropagation();
  contactDropdown.style.display =
    contactDropdown.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", e => {
  if (!contactDropdown.contains(e.target)) {
    contactDropdown.style.display = "none";
  }
});
