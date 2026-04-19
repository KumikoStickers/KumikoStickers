
const products = [
  { id: 1, name: "Skull Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 2, name: "Ghost Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },

  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },

  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },

  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" }
];

/* =============================
   CART (qty-based)
============================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   RENDER PRODUCTS
============================= */

function renderProducts() {
  products.forEach(p => {
    const container = document.getElementById(p.category);
    if (!container) return;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="price">£${p.price}</p>

      <button data-action="add" data-id="${p.id}">
        Add to Cart
      </button>
    `;

    container.appendChild(div);
  });
}

/* =============================
   CART LOGIC
============================= */

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  updateCart();
}

function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty -= 1;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

/* =============================
   CART UI
============================= */

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems || !totalEl || !countEl) return;

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    const itemTotal = product.price * item.qty;
    total += itemTotal;
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${product.name} x${item.qty} - £${itemTotal}</span>

      <div class="cart-controls">
        <button data-action="remove" data-id="${item.id}">−</button>
        <button data-action="add" data-id="${item.id}">+</button>
      </div>
    `;

    cartItems.appendChild(li);
  });

  totalEl.textContent = total;
  countEl.textContent = count;
}

/* =============================
   EVENT DELEGATION (FIX)
============================= */

document.addEventListener("click", (e) => {
  const btn = e.target;

  if (!btn.dataset.action) return;

  const id = parseInt(btn.dataset.id);

  if (btn.dataset.action === "add") {
    addToCart(id);
  }

  if (btn.dataset.action === "remove") {
    removeFromCart(id);
  }
});

/* =============================
   UI
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
