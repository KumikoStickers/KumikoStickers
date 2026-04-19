const products = [
  { id: 1, name: "Skull Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 2, name: "Ghost Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },

  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },

  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },

  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   INIT (SAFE LOAD)
============================= */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCart();
});

/* =============================
   PRODUCTS
============================= */

function renderProducts() {
  products.forEach(p => {
    const container = document.getElementById(p.category);
    if (!container) return;

    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3 data-category="${p.category}">${p.name}</h3>
      <p>£${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

/* =============================
   CART (WITH QUANTITY)
============================= */

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart.push({ ...product, qty: 1 });
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

function clearCart() {
  cart = [];
  updateCart();
}

/* =============================
   CART UI
============================= */

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems || !totalEl || !countEl) return;

  localStorage.setItem("cart", JSON.stringify(cart));

  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your basket is empty</li>";
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;

    total += itemTotal;
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.name} x${item.qty} — £${itemTotal}</span>

      <div>
        <button onclick="removeFromCart(${item.id})">−</button>
        <button onclick="addToCart(${item.id})">+</button>
      </div>
    `;

    cartItems.appendChild(li);
  });

  totalEl.textContent = total;
  countEl.textContent = count;
}

/* =============================
   UI CONTROLS
============================= */

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function checkout() {
  alert("Checkout not connected yet");
}
