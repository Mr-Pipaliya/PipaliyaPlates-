function updateCartDisplay() {
  const cartItemsList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItemsList) return; // Cart container is not on this page

  cartItemsList.innerHTML = '';
  let total = 0;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    const li = document.createElement('li');
    li.textContent = "Your cart is empty.";
    cartItemsList.appendChild(li);
  } else {
    cart.forEach(item => {
      const li = document.createElement('li');
      // Create a nice layout for the list item
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.padding = '8px 0';
      li.style.borderBottom = '1px dashed #ccc';
      li.innerHTML = `
        <span>${item.name}</span>
        <span>Rs. ${item.price} x ${item.quantity}</span>
      `;
      cartItemsList.appendChild(li);
      total += item.price * item.quantity;
    });
  }

  if (cartTotal) {
    cartTotal.textContent = `Total: Rs. ${total}`;
  }
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

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
  updateCartDisplay();
}

document.addEventListener("DOMContentLoaded", function () {
  // Update the cart display when page loads
  updateCartDisplay();

  // Attach listener to checkout form if it exists on the current page
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "thankyou.html";
    });
  }
});

// Category page navigation
const categoryPages = [
  'gujarati.html',
  'punjabi.html',
  'chinese.html',
  'italian.html',
  'korean.html',
  'southindian.html',
  'mexican.html',
  'french.html'
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
