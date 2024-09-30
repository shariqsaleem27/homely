// Function to get userId from local storage
const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

// Function to render cart items
function renderCartItems(cartItems) {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = ""; // Clear current items
  let total = 0;

  cartItems.forEach((item) => {
    total += item.totalPrice; // Use totalPrice for the total calculation

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    // Set the inner HTML for the cart item
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.dishName}">
      <div>
        <h6>${item.dishName}</h6>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
      </div>
      <button class="remove-btn">Remove</button>
    `;

    // Append the cart item to the container
    cartContainer.appendChild(cartItem);

    // Find the "Remove" button and add an event listener to it
    const removeButton = cartItem.querySelector(".remove-btn");
    removeButton.addEventListener("click", () => {
      removeFromCart(item.dishName); // Call the removeFromCart function when clicked
    });
  });

  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
}


// Function to fetch cart items from the server
async function fetchCartItems() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/users/cart/${userId}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    renderCartItems(data.items);
    return data.items; // Return items for use in order placement
  } catch (error) {
    console.error("Error fetching cart items:", error);
    alert("Failed to load cart items. Please try again later.");
  }
}

async function removeFromCart(dishName) {
  console.log("Removing item:", dishName); // Add this line
  try {
    await fetch(`http://localhost:5000/api/users/cart/${userId}/${dishName}`, {
      method: "DELETE",
    });
    fetchCartItems();
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

// Function to handle placing the order
document
  .getElementById("place-order-btn")
  .addEventListener("click", async () => {
    const deliveryAddress = prompt("Please enter your delivery address:"); // Get delivery address from the user
    const cartItems = await fetchCartItems(); // Fetch current cart items

console.log("cart",cartItems)

    if (!deliveryAddress || cartItems.length === 0) {
      alert("Delivery address is required and the cart cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          items: cartItems, // Include items from the cart
          deliveryAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      alert("Order placed successfully!");
      fetchCartItems(); // Refresh the cart
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  });

// Fetch cart items on page load
fetchCartItems();