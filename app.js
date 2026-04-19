const products = [
  { id: 1, name: "Skull Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 2, name: "Ghost Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },

  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },

  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },

  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" }
];

/* =============================
   CART
============================= */

let cart = [];

/* =============================
   SHIPPING SETTINGS
============================= */

const SHIPPING_FLAT_RATE = 2.50;
const FREE_SHIPPING_THRESHOLD = 20;

function calculateShipping(subtotal) {

  if (subtotal === 0) return 0;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return SHIPPING_FLAT_RATE;

}

/* =============================
   INIT
============================= */

document.addEventListener("DOMContentLoaded", () => {

  const saved = JSON.parse(localStorage.getItem("cart")) || [];

  const cleaned = [];

  saved.forEach(item => {

    const id = item.id ?? item;

    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cleaned.find(c => c.id === id);

    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      cleaned.push({
        ...product,
        id,
        qty: item.qty || 1
      });
    }

  });

  cart = cleaned;

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
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>£${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;

    container.appendChild(div);

  });

}

/* =============================
   CART LOGIC
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

  totalEl.textContent = total.toFixed(2);
  countEl.textContent = count;

}

/* =============================
   UI
============================= */

function toggleCart() {

  document
    .getElementById("cart")
    .classList.toggle("open");

}

/* =============================
   PAYPAL
============================= */

function renderPayPalButton() {

  // Wait until PayPal loads
  if (typeof paypal === "undefined") {
    setTimeout(renderPayPalButton, 500);
    return;
  }

  paypal.Buttons({

    createOrder: function (data, actions) {

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      if (total <= 0) {
        alert("Your basket is empty!");
        return;
      }

      return actions.order.create({
  purchase_units: [{
    amount: {
      value: total.toFixed(2),
      currency_code: "GBP"
    }
  }],
  application_context: {
    shipping_preference: "GET_FROM_FILE"
  }
});

    },

    onApprove: function (data, actions) {

  return actions.order.capture().then(function (details) {

    console.log(details.purchase_units[0].shipping);

    alert(
      "Payment successful! Thank you " +
      details.payer.name.given_name +
      " ✨"
    );

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();

  });

},

  }).render("#paypal-button-container");

}

/* =============================
   FIREBASE ORDER SAVE (OPTIONAL)
============================= */

function checkout() {

  if (cart.length === 0) {
    alert("Your basket is empty");
    return;
  }

  if (!window.firebaseDB) {
    alert("Firebase not connected");
    return;
  }

  const order = {

    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty
    })),

    total: cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    ),

    itemCount: cart.reduce(
      (sum, item) => sum + item.qty,
      0
    ),

    createdAt: new Date().toISOString()

  };

  window.firebaseAddDoc(
    window.firebaseCollection(
      window.firebaseDB,
      "orders"
    ),
    order
  )

    .then(() => {

      alert("Order saved to Firebase ✨");

    })

    .catch(err => {

      console.error(err);

      alert("Failed to save order");

    });

}
