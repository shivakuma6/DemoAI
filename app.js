// Valid user credentials
const VALID_USERS = [
    { username: 'test_user', password: 'password123' },
];

// Cart state
let cart = [];

// DOM elements
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const viewCartBtn = document.getElementById('view-cart-btn');
const cartCountSpan = document.getElementById('cart-count');
const backBtn = document.getElementById('back-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const restartBtn = document.getElementById('restart-btn');
const cartItemsList = document.getElementById('cart-items');
const cartTotalPara = document.getElementById('cart-total');

// Section visibility helper
function showSection(id) {
    ['login-section', 'products-section', 'cart-section', 'success-section']
        .forEach(s => {
            const element = document.getElementById(s);
            if (s === id) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
}

// Login logic
loginBtn.addEventListener('click', function() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    loginError.style.display = 'none';
    
    // Intentional bug: admin bypasses password check
    if (username === 'admin') {
        showSection('products-section');
        cart = [];
        updateCartCount();
    } else {
        // Check against valid users
        const validUser = VALID_USERS.find(u => u.username === username && u.password === password);
        if (validUser) {
            showSection('products-section');
            cart = [];
            updateCartCount();
        } else {
            loginError.style.display = 'block';
        }
    }
});

// Add to cart for .add-to-cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseInt(productCard.querySelector('p').textContent.replace('$', ''));
        
        cart.push({ name: productName, price: productPrice });
        updateCartCount();
    });
});

// Add to cart for .add-to-cart-typo
document.querySelectorAll('.add-to-cart-typo').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseInt(productCard.querySelector('p').textContent.replace('$', ''));
        
        cart.push({ name: productName, price: productPrice });
        updateCartCount();
    });
});

// Update cart count
function updateCartCount() {
    cartCountSpan.textContent = cart.length;
}

// View cart
viewCartBtn.addEventListener('click', function() {
    renderCart();
    showSection('cart-section');
});

// Render cart items and total
function renderCart() {
    cartItemsList.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartItemsList.appendChild(li);
        total += item.price;
    });
    
    cartTotalPara.textContent = `Total: $${total}`;
}

// Back to products
backBtn.addEventListener('click', function() {
    showSection('products-section');
});

// Checkout
checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        showSection('success-section');
    }
});

// Restart (Shop Again)
restartBtn.addEventListener('click', function() {
    cart = [];
    updateCartCount();
    usernameInput.value = '';
    passwordInput.value = '';
    loginError.style.display = 'none';
    showSection('login-section');
});
