const products = [

  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },
  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },
  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" },

  // 30 stickers (£1.50 each)
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 6 + i,
    name: `Sticker ${i + 1}`,
    price: 1.5,
    image: "https://via.placeholder.com/200",
    category: "stickers"
  }))

];

let cart = [];

/* =============================
   SETTINGS
============================= */

const SHIPPING_FLAT_RATE = 2.5;
const FREE_SHIPPING_THRESHOLD = 20;

/* =============================
   HELPERS
============================= */

function calculateStickerDiscount(stickerQty) {
  const deals = Math.floor(stickerQty / 4);
  return deals * 2; // £2 off per 4 stickers
}

function calculateShipping(subtotal) {
  if (subtotal === 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FLAT_RATE;
}

function getTotals() {

  let subtotal = 0;
  let count = 0;
  let stickerQty = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    count += item.qty;

    if (item.category === "stickers") {
      stickerQty += item.qty;
    }
  });

  const discount = calculateStickerDiscount(stickerQty);
  const discountedSubtotal = subtotal - discount;
  const shipping = calculateShipping(discountedSubtotal);
  const total = discountedSubtotal + shipping;

  return { subtotal, discount, shipping, total, count };
}

/* =============================
   INIT
============================= */

document.addEventListener("DOMContentLoaded", () => {

  try {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];

    cart = saved.map(item => {
      const product = products.find(p => p.id === item.id || p.id === item);
      if (!product) return null;

      return {
        ...product,
        id: product.id,
        qty: item.qty || 1
      };
    }).filter(Boolean);

  } catch (e) {
    cart = [];
  }

  renderProducts();
  updateCart();
  renderPayPalButton();
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

  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

function removeFromCart(id) {

  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

/* =============================
   CART UI
============================= */

function updateCart() {

  const cartItems = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  localStorage.setItem("cart", JSON.stringify(cart));

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your basket is empty</li>";
  }

  const { subtotal, discount, shipping, total, count } = getTotals();

  cart.forEach(item => {

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.name} x${item.qty} — £${(item.price * item.qty).toFixed(2)}</span>
      <div>
        <button onclick="removeFromCart(${item.id})">−</button>
        <button onclick="addToCart(${item.id})">+</button>
      </div>
    `;

    cartItems.appendChild(li);
  });

  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (discountEl) discountEl.textContent = discount ? `-£${discount.toFixed(2)}` : "0.00";
  if (shippingEl) shippingEl.textContent = shipping.toFixed(2);
  if (totalEl) totalEl.textContent = total.toFixed(2);
  if (countEl) countEl.textContent = count;
}

/* =============================
   CART TOGGLE
============================= */

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

/* =============================
   PAYPAL
============================= */

function renderPayPalButton() {

  if (typeof paypal === "undefined") {
    setTimeout(renderPayPalButton, 500);
    return;
  }

  paypal.Buttons({

    createOrder: function (_, actions) {

      const { subtotal, discount, shipping, total } = getTotals();

      if (total <= 0) {
        alert("Your basket is empty!");
        return;
      }

      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "GBP",
            value: total.toFixed(2)
          }
        }]
      });
    },

    onApprove: function (_, actions) {

      return actions.order.capture().then(() => {

        alert("Payment successful ✨");

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();

      });

    }

  }).render("#paypal-button-container");
}
