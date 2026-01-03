document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     SAFE DOM REFERENCES
  ======================= */
  const grid = document.getElementById("productGrid");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const prevArrow = document.getElementById("prevArrow");
  const nextArrow = document.getElementById("nextArrow");

  const contactBtn = document.getElementById("contactBtn");
  const contactDropdown = document.getElementById("contactDropdown");

  if (!grid || !modal || !modalImg) {
    console.error("Critical DOM elements missing.");
    return;
  }

  /* =======================
     PRODUCT DATA
  ======================= */
  const products = [
    {
      id: "thobe1",
      category: "thobe",
      title: "Classic Thobe",
      subtitle: "Premium Fabric",
      image: "thobe1.jpeg",
      extraImages: [],
      oldPrice: "£39.99",
      price: "£25.00",
      links: {
        instagram: "https://instagram.com/premium_libaas",
        tiktok: "https://www.tiktok.com/@premium_libaas",
        facebook: "https://www.facebook.com/profile.php?id=61585372481020"
      }
    },
    {
      id: "abayah1",
      category: "abayah",
      title: "Elegant Abayah",
      subtitle: "Flowing Silhouette",
      image: "abayah1.webp",
      extraImages: [],
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
  function renderProducts(list) {
    grid.innerHTML = "";

    list.forEach(product => {
      const card = document.createElement("div");
      card.className = `card ${product.category}`;

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

      if (product.oldPrice) card.classList.add("on-sale");
    });
  }

  renderProducts(products);

  /* =======================
     FILTERS (GLOBAL)
  ======================= */
  window.filterItems = function (type) {
    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    if (type === "all") renderProducts(products);
    else renderProducts(products.filter(p => p.category === type));
  };

  /* =======================
     MODAL LOGIC
  ======================= */
  let images = [];
  let index = 0;

  function openModal(product) {
    images = [product.image, ...(product.extraImages || [])];
    index = 0;

    modalImg.src = images[index];
    modalTitle.innerText = product.title;

    document.querySelector(".instagram").href = product.links.instagram;
    document.querySelector(".tiktok").href = product.links.tiktok;
    document.querySelector(".facebook").href = product.links.facebook;

    modal.style.display = "flex";
    prevArrow.style.display = images.length > 1 ? "block" : "none";
    nextArrow.style.display = images.length > 1 ? "block" : "none";
  }

  window.closeModal = function () {
    modal.style.display = "none";
  };

  prevArrow?.addEventListener("click", e => {
    e.stopPropagation();
    index = (index - 1 + images.length) % images.length;
    modalImg.src = images[index];
  });

  nextArrow?.addEventListener("click", e => {
    e.stopPropagation();
    index = (index + 1) % images.length;
    modalImg.src = images[index];
  });

  /* =======================
     CONTACT DROPDOWN
  ======================= */
  contactBtn?.addEventListener("click", e => {
    e.stopPropagation();
    contactDropdown.style.display =
      contactDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", e => {
    if (!contactDropdown.contains(e.target)) {
      contactDropdown.style.display = "none";
    }
  });

});
