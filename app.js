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
      <button onclick="addToCart(${p.id})">
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
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

  if (!cartItems || !totalEl || !countEl) return;

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  cartItems.innerHTML = "";

  let subtotal = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      "<li>Your basket is empty</li>";
  }

  cart.forEach(item => {

    const itemTotal =
      item.price * item.qty;

    subtotal += itemTotal;
    count += item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        ${item.name} x${item.qty}
        — £${itemTotal.toFixed(2)}
      </span>

      <div>
        <button onclick="removeFromCart(${item.id})">
          −
        </button>

        <button onclick="addToCart(${item.id})">
          +
        </button>
      </div>
    `;

    cartItems.appendChild(li);

  });

  const shipping =
    calculateShipping(subtotal);

  const total =
    subtotal + shipping;

  if (subtotalEl)
    subtotalEl.textContent =
      subtotal.toFixed(2);

  if (shippingEl)
    shippingEl.textContent =
      shipping.toFixed(2);

  totalEl.textContent =
    total.toFixed(2);

  countEl.textContent =
    count;

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

  if (typeof paypal === "undefined") {
    setTimeout(
      renderPayPalButton,
      500
    );
    return;
  }

  paypal.Buttons({

    createOrder: function (
      data,
      actions
    ) {

      const subtotal =
        cart.reduce(
          (sum, item) =>
            sum + item.price * item.qty,
          0
        );

      const shipping =
        calculateShipping(subtotal);

      const total =
        subtotal + shipping;

      if (total <= 0) {
        alert(
          "Your basket is empty!"
        );
        return;
      }

      return actions.order.create({

        purchase_units: [{

          amount: {

            currency_code: "GBP",

            value:
              total.toFixed(2),

            breakdown: {

              item_total: {
                currency_code: "GBP",
                value:
                  subtotal.toFixed(2)
              },

              shipping: {
                currency_code: "GBP",
                value:
                  shipping.toFixed(2)
              }

            }

          }

        }],

        application_context: {
          shipping_preference:
            "GET_FROM_FILE"
        }

      });

    },

    onApprove: function (
      data,
      actions
    ) {

      return actions
        .order
        .capture()
        .then(function (
          details
        ) {

          const shippingInfo =
            details
              .purchase_units[0]
              .shipping;

          const subtotal =
            cart.reduce(
              (sum, item) =>
                sum +
                item.price *
                item.qty,
              0
            );

          const shipping =
            calculateShipping(
              subtotal
            );

          const total =
            subtotal + shipping;

          const order = {

            customerName:
              details
                .payer
                .name
                .given_name +
              " " +
              details
                .payer
                .name
                .surname,

            email:
              details
                .payer
                .email_address,

            address: {

              line1:
                shippingInfo
                  .address
                  .address_line_1,

              line2:
                shippingInfo
                  .address
                  .address_line_2 || "",

              city:
                shippingInfo
                  .address
                  .admin_area_2,

              county:
                shippingInfo
                  .address
                  .admin_area_1,

              postcode:
                shippingInfo
                  .address
                  .postal_code,

              country:
                shippingInfo
                  .address
                  .country_code

            },

            items:
              cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty
              })),

            subtotal:
              subtotal,

            shipping:
              shipping,

            total:
              total,

            createdAt:
              new Date()
                .toISOString()

          };

          console.log(
            "ORDER:",
            order
          );

          if (window.firebaseDB) {

            window.firebaseAddDoc(
              window.firebaseCollection(
                window.firebaseDB,
                "orders"
              ),
              order
            )

            .then(() => {
              console.log(
                "Order saved to Firebase"
              );
            })

            .catch(err => {
              console.error(err);
            });

          }

          alert(
            "Payment successful! Thank you " +
            details.payer.name
              .given_name +
            " ✨"
          );

          cart = [];

          localStorage.setItem(
            "cart",
            JSON.stringify(cart)
          );

          updateCart();

        });

    }

  })
  .render(
    "#paypal-button-container"
  );

}
