const products = [
  { id: 1, name: "Skull Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 2, name: "Ghost Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },
  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },
  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================
   SAFE INIT (IMPORTANT)
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
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>£${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

/* =============================
   CART
============================= */

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;

  cart.push(item);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
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

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");

    li.innerHTML = `
      ${item.name} - £${item.price}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItems.appendChild(li);
  });

  totalEl.textContent = total;
  countEl.textContent = cart.length;
}

/* =============================
   UI
============================= */

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function checkout() {
  alert("Checkout not connected yet");
}
