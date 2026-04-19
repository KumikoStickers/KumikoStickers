const products = [
  { id: 1, name: "T-Shirt", price: 20, image: "https://via.placeholder.com/200" },
  { id: 2, name: "Hoodie", price: 40, image: "https://via.placeholder.com/200" },
  { id: 3, name: "Cap", price: 15, image: "https://via.placeholder.com/200" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("products");
const cartEl = document.getElementById("cart");

function renderProducts() {
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${p.image}" />
      <h3>${p.name}</h3>
      <p>£${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productContainer.appendChild(div);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCart();
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartItems = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");

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

function toggleCart() {
  cartEl.classList.toggle("open");
}

function checkout() {
  alert("Connect Stripe / Firebase here");
}

renderProducts();
updateCart();
