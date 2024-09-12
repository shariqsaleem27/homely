// cart.js

// Mock data for cart items
const cartItems = [
    {
      id: 1,
      name: "Grey's Veg",
      image: "https://images.unsplash.com/photo-1559717763-bb1ab6b1dbac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      price: 12.99,
      quantity: 1
    },
    {
      id: 2,
      name: "Healthy Pasta",
      image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      price: 10.99,
      quantity: 1
    }
  ];
  
  // Function to render cart items
  function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Clear current items
    let total = 0;
  
    cartItems.forEach(item => {
      total += item.price * item.quantity;
      
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h6>${item.name}</h6>
          <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
  
      cartContainer.appendChild(cartItem);
    });
  
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
  }
  
  // Function to remove item from cart
  function removeFromCart(itemId) {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      renderCartItems();
    }
  }
  
  // Function to handle placing the order
  document.getElementById('place-order-btn').addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      alert('Order placed successfully!');
      // You can redirect to a confirmation page or clear the cart after this
      cartItems.length = 0;
      renderCartItems(); // Clear the cart UI
    }
  });
  
  // Render cart items on page load
  renderCartItems();
  