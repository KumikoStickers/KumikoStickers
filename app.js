const products = [
  { id: 1, name: "Skull Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 2, name: "Ghost Sticker", price: 2, image: "https://via.placeholder.com/200", category: "stickers" },

  { id: 3, name: "Bat Earrings", price: 8, image: "https://via.placeholder.com/200", category: "earrings" },

  { id: 4, name: "Heart Keychain", price: 5, image: "https://via.placeholder.com/200", category: "keychains" },

  { id: 5, name: "Spooky Pin", price: 3, image: "https://via.placeholder.com/200", category: "pins" },

  // 30 Sticker placeholders at £1.50
  { id: 6, name: "Sticker 1", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 7, name: "Sticker 2", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 8, name: "Sticker 3", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 9, name: "Sticker 4", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 10, name: "Sticker 5", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 11, name: "Sticker 6", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 12, name: "Sticker 7", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 13, name: "Sticker 8", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 14, name: "Sticker 9", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 15, name: "Sticker 10", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 16, name: "Sticker 11", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 17, name: "Sticker 12", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 18, name: "Sticker 13", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 19, name: "Sticker 14", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 20, name: "Sticker 15", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 21, name: "Sticker 16", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 22, name: "Sticker 17", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 23, name: "Sticker 18", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 24, name: "Sticker 19", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 25, name: "Sticker 20", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 26, name: "Sticker 21", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 27, name: "Sticker 22", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 28, name: "Sticker 23", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 29, name: "Sticker 24", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 30, name: "Sticker 25", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 31, name: "Sticker 26", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 32, name: "Sticker 27", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 33, name: "Sticker 28", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 34, name: "Sticker 29", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" },
  { id: 35, name: "Sticker 30", price: 1.5, image: "https://via.placeholder.com/200", category: "stickers" }
];

let cart = [];

const SHIPPING_FLAT_RATE = 2.50;
const FREE_SHIPPING_THRESHOLD = 20;

/* =============================
   DEAL: 4 STICKERS FOR £4
============================= */

function calculateStickerDiscount() {

  let stickerQty = 0;

  cart.forEach(item => {
    if (item.category === "stickers") {
      stickerQty += item.qty;
    }
  });

  const deals = Math.floor(stickerQty / 4);

  const normalPrice = 4 * 1.5; // £6 normally
  const dealPrice = 4;         // £4 deal

  const discountPerDeal = normalPrice - dealPrice; // £2 discount

  return deals * discountPerDeal;

}

function calculateShipping(subtotal) {
  if (subtotal === 0) return 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FLAT_RATE;
}

document.addEventListener("DOMContentLoaded", () => {

  const saved = JSON.parse(localStorage.getItem("cart")) || [];
  cart = saved;

  renderProducts();
  updateCart();
  renderPayPalButton();

});

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

function updateCart() {

  const cartItems = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems) return;

  localStorage.setItem("cart", JSON.stringify(cart));

  cartItems.innerHTML = "";

  let subtotal = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your basket is empty</li>";
  }

  cart.forEach(item => {

    const itemTotal = item.price * item.qty;

    subtotal += itemTotal;
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.name} x${item.qty} — £${itemTotal.toFixed(2)}</span>
      <div>
        <button onclick="removeFromCart(${item.id})">−</button>
        <button onclick="addToCart(${item.id})">+</button>
      </div>
    `;

    cartItems.appendChild(li);

  });

  const discount = calculateStickerDiscount();

  subtotal = subtotal - discount;

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = shipping.toFixed(2);
  if (totalEl) totalEl.textContent = total.toFixed(2);
  if (countEl) countEl.textContent = count;

}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function renderPayPalButton() {

  if (typeof paypal === "undefined") {
    setTimeout(renderPayPalButton, 500);
    return;
  }

  paypal.Buttons({

    createOrder: function (data, actions) {

      let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

      const discount = calculateStickerDiscount();

      subtotal = subtotal - discount;

      const shipping = calculateShipping(subtotal);
      const total = subtotal + shipping;

      if (total <= 0) {
        alert("Your basket is empty!");
        return;
      }

      return actions.order.create({

        purchase_units: [{

          amount: {

            currency_code: "GBP",

            value: total.toFixed(2),

            breakdown: {

              item_total: {
                currency_code: "GBP",
                value: subtotal.toFixed(2)
              },

              shipping: {
                currency_code: "GBP",
                value: shipping.toFixed(2)
              }

            }

          }

        }],

        application_context: {
          shipping_preference: "GET_FROM_FILE"
        }

      });

    },

    onApprove: function (data, actions) {

      return actions.order.capture().then(function (details) {

        alert("Payment successful! Thank you " + details.payer.name.given_name + " ✨");

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();

      });

    }

  }).render("#paypal-button-container");

}
