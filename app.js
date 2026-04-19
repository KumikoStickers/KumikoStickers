let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   RENDER PRODUCTS BY CATEGORY
============================= */

function renderProducts() {
  if (typeof products === "undefined") {
    console.error("products is not loaded. Make sure data.js is included before app.js");
    return;
  }

  products.forEach(p => {
    const container = document.getElementById(p.category);
    if (!container) return;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="price">£${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

/* =============================
   CART SYSTEM
============================= */

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;

  cart.push(item);
  updateCart();
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems || !totalEl || !countEl) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - £${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = total;
  countEl.textContent = cart.length;
}

/* =============================
   UI TOGGLES
============================= */

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function checkout() {
  alert("Connect Stripe / Firebase here");
}

/* =============================
   INIT
============================= */

renderProducts();
updateCart();
