// Function to Add Item to Cart
async function addToCart(dish) {
  try {
    const userId = localStorage.getItem("userId"); // Get user ID from local storage
    if (!userId) {
      M.toast({ html: "Please log in to add items to your cart." });
      return;
    }
 
    console.log("dish",dish)
 
    const response = await fetch("http://localhost:5000/api/users/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
 
 
      body: JSON.stringify({
        userId,
        restaurantId: dish.restaurantId, // Ensure you pass the restaurant ID
        dishName: dish.dishName,
        price: dish.price,
        quantity: 1, // You can adjust this if needed
      }),
    });
 
    const data = await response.json();
    if (response.ok) {
      console.log("Item added to cart:", data);
      M.toast({ html: "Item added to cart!" }); // Materialize toast notification
    } else {
      console.error("Error adding to cart:", data.message);
      M.toast({ html: `Error: ${data.message}` });
    }
  } catch (error) {
    console.error("Server error:", error);
    M.toast({ html: "An error occurred while adding to cart." });
  }
}
 
// Function to Render Cards
function renderFoodCards(foodItems) {
  const foodGrid = document.getElementById("food-grid");
  foodItems.forEach((item) => {
    const foodCard = document.createElement("div");
    foodCard.classList.add("food-item");
 
    // Card HTML structure
    item.items.forEach((dish) => {
      const dishData = JSON.stringify(dish).replace(/'/g, "&apos;");
      foodCard.innerHTML += `
          <div class="card">
              <span class="discount">${dish.discount || ""}</span>
              <img src="${dish.imageUrl}" alt="${
        dish.dishName
      }" class="card-img-top">
              <div class="card-body">
                  <h5 class="card-title">${dish.dishName}</h5>
                  <p class="card-text">${dish.description}</p>
                  <p>Price: $${dish.price}</p>
                  <button class="add-to-cart btn waves-effect waves-light" data-dish='${dishData}'>Add to Cart</button>
              </div>
          </div>
      `;
    });
 
    foodGrid.appendChild(foodCard);
  });
}
 
// Fetch Items from API
async function fetchFoodItems() {
  try {
    const response = await fetch("http://localhost:5000/api/users/items"); // Adjust the URL as needed
    const data = await response.json();
    renderFoodCards(data);
  } catch (error) {
    console.error("Error fetching food items:", error);
  }
}
 
// Event delegation for "Add to Cart" buttons
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("add-to-cart")) {
    const dish = event.target.getAttribute("data-dish");
    console.log("Data Dish:", dish); // Log the dish data
    try {
      addToCart(JSON.parse(dish));
    } catch (error) {
      console.error("Error parsing dish data:", error);
    }
  }
});
 
// Call function to fetch food items
fetchFoodItems();