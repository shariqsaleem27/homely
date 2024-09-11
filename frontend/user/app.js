
// Function to Render Cards
function renderFoodCards() {
    const foodGrid = document.getElementById('food-grid');
    foodItems.forEach(item => {
      // Create card element
      const foodCard = document.createElement('div');
      foodCard.classList.add('food-item');
      
      // Card HTML structure
      foodCard.innerHTML = `
        <span class="discount">${item.discount}</span>
        <img src="${item.image}" alt="Food Image">
        <h5>${item.title}</h5>
        <p><span class="days-remaining">${item.daysRemaining}</span></p>
        <button class="add-to-cart">Add to Cart</button>
      `;
      
      // Append card to grid
      foodGrid.appendChild(foodCard);
    });
  }
  
  // Call function to render food cards
  renderFoodCards();
  