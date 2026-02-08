let cart = [];

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

function updateCartDisplay() {

  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartItemsList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - Rs. ${item.price}`;
    cartItemsList.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `Total: Rs. ${total}`;
  checkoutBtn.disabled = cart.length === 0;
}
document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
        <span>${item.name}</span>
        <span>Rs. ${item.price} x ${item.quantity}</span>
      `;
    cartContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  totalDisplay.textContent = `Rs. ${total}`;
});
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "thankyou.html"; // Optional: redirect to a Thank You page
});
// Redirect to thank you page after 1 second
setTimeout(() => {
  window.location.href = "thankyou.html";
}, 3000);
// Redirect to home page after 1 second
setTimeout(() => {
  window.location.href = "index.html";
}, 3000);

const categoryPages = [
  'gujarati.html',
  'punjabi.html',
  'chinese.html',
  'italian.html',
  'korean.html',
  'southindian.html'
];

function getCurrentPageIndex() {
  const currentPage = window.location.pathname.split('/').pop();
  return categoryPages.indexOf(currentPage);
}
 
function goBack() {
  let currentIndex = getCurrentPageIndex();
  if (currentIndex > 0) {
    window.location.href = categoryPages[currentIndex - 1];
  } else {
    alert('This is the first category.');
  }
}

function goForward() {
  let currentIndex = getCurrentPageIndex();
  if (currentIndex < categoryPages.length - 1) {
    window.location.href = categoryPages[currentIndex + 1];
  } else {
    alert('This is the last category.');
  }
}

