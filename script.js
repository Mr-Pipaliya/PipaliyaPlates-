// Cart functions used by menu & category pages

function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

// Category page navigation
const categoryPages = [
  'gujarati.html', 'punjabi.html', 'chinese.html', 'italian.html',
  'korean.html',   'southindian.html', 'mexican.html', 'french.html'
];

function goBack() {
  const i = categoryPages.indexOf(window.location.pathname.split('/').pop());
  i > 0 ? window.location.href = categoryPages[i - 1] : alert('This is the first category.');
}

function goForward() {
  const i = categoryPages.indexOf(window.location.pathname.split('/').pop());
  i < categoryPages.length - 1 ? window.location.href = categoryPages[i + 1] : alert('This is the last category.');
}
