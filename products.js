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

const grid = document.getElementById("productGrid");

/* RENDER PRODUCTS */
function renderProducts(list) {
  grid.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = `card ${p.category}`;
    card.dataset.id = p.id;

    card.innerHTML = `
      <img src="${p.image}">
      <div class="info">
        <h3>${p.title}</h3>
        <span>${p.subtitle}</span>
        ${p.oldPrice ? `<span class="old-price">${p.oldPrice}</span>` : ""}
        <span class="price">${p.price}</span>
      </div>
      <div class="extra-images" style="display:none;">
        ${p.extraImages.map(img => `<span>${img}</span>`).join("")}
      </div>
    `;

    card.onclick = () => openModal(p);
    grid.appendChild(card);
  });

  applySaleBadges();
}

renderProducts(products);

/* FILTERS */
function filterItems(type) {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") {
    renderProducts(products);
  } else {
    renderProducts(products.filter(p => p.category === type));
  }
}

/* SALE BADGE */
function applySaleBadges() {
  document.querySelectorAll(".card").forEach(card => {
    const oldP = card.querySelector(".old-price");
    if (oldP) card.classList.add("on-sale");
  });
}

/* MODAL */
let currentImages = [];
let currentIndex = 0;

function openModal(product) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");

  currentImages = [product.image, ...product.extraImages];
  currentIndex = 0;

  modalImg.src = currentImages[0];
  modalTitle.innerText = product.title;

  document.querySelector(".instagram").href = product.links.instagram;
  document.querySelector(".tiktok").href = product.links.tiktok;
  document.querySelector(".facebook").href = product.links.facebook;

  document.getElementById("prevArrow").style.display =
    currentImages.length > 1 ? "block" : "none";
  document.getElementById("nextArrow").style.display =
    currentImages.length > 1 ? "block" : "none";

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("prevArrow").onclick = e => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

document.getElementById("nextArrow").onclick = e => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentImages.length;
  modalImg.src = currentImages[currentIndex];
};

/* CONTACT DROPDOWN */
const contactBtn = document.getElementById("contactBtn");
const contactDropdown = document.getElementById("contactDropdown");

contactBtn?.addEventListener("click", () => {
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
