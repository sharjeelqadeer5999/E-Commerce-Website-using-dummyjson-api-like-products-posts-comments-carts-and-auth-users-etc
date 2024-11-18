// API URLs
const USER_API_URL = 'https://dummyjson.com/users';
const PRODUCT_API_URL = 'https://dummyjson.com/products';
const POST_API_URL = 'https://dummyjson.com/posts';
const COMMENT_API_URL = 'https://dummyjson.com/comments';

// Login function
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate API call for user authentication
    const response = await fetch(USER_API_URL);
    const users = await response.json();

    const user = users.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Simulate token generation
        const token = btoa(`${username}:${password}`); // Base64 encode for demo
        localStorage.setItem('token', token);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('error').innerText = 'Invalid username or password';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Check authentication
function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
    }
}

// Fetch products
async function fetchProducts() {
    const response = await fetch(PRODUCT_API_URL);
    return await response.json();
}

// Fetch posts
async function fetchPosts() {
    const response = await fetch(POST_API_URL);
    return await response.json();
}

// Fetch comments
async function fetchComments() {
    const response = await fetch(COMMENT_API_URL);
    return await response.json();
}

// Load dashboard function
async function loadDashboard() {
    checkAuth();

    const productList = document.getElementById('product-list');
    const postList = document.getElementById('post-list');
    const commentList = document.getElementById('comment-list');
    const cartList = document.getElementById('cart-list');

    // Load Products
    const products = await fetchProducts();
    products.products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-4 mb-3';
        productDiv.innerHTML = `
            <div class="card">
            <img src="${product.images}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><strong>Price: $${product.price}</strong></p>
                    <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });

    // Load Posts
    const posts = await fetchPosts();
    posts.posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'col-md-4 mb-3';
        postDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.body}</p>
                </div>
            </div>
        `;
        postList.appendChild(postDiv);
    });

    // Load Comments
    const comments = await fetchComments();
    comments.comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'col-md-4 mb-3';
        commentDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text"><strong>${comment.name}</strong>: ${comment.body}</p>
                </div>
            </div>
        `;
        commentList.appendChild(commentDiv);
    });

    // Load Cart
    loadCart();
}

// Add to Cart function
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Load Cart function
function loadCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear previous cart content

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        cart.forEach(productId => {
            const productDiv = document.createElement('div');
            productDiv.className = 'col-md-4 mb-3';
            productDiv.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <p class="card-text">Product ID: ${productId}</p>
                    </div>
                </div>
            `;
            cartList.appendChild(productDiv);
        });
    } else {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
    }
}

// Call loadDashboard on dashboard page
if (document.title === "Dashboard") {
    loadDashboard();
}



