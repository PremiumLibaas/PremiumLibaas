const products = [
  {
    name: "Classic Black Thobe",
    category: "thobe",
    images: ["thobe1.jpeg"]
  },
  {
    name: "Elegant Abayah",
    category: "abayah",
    images: ["abayah1.webp"]
  }
];

const grid = document.getElementById("productGrid");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");

function renderProducts(filter = "all") {
  grid.innerHTML = "";

  products.forEach(product => {
    if (filter !== "all" && product.category !== filter) return;

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openModal(product);

    card.innerHTML = `
      <img src="${product.images[0]}">
      <div class="info">
        <h3>${product.name}</h3>
      </div>
    `;

    grid.appendChild(card);
  });
}

function filterItems(type) {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  renderProducts(type);
}

function openModal(product) {
  modal.style.display = "flex";
  modalImg.src = product.images[0];
  modalTitle.textContent = product.name;
}

function closeModal() {
  modal.style.display = "none";
}

renderProducts();
