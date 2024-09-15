// dish-management.js
 
// Mock data for dishes
const dishes = [
    {
        id: 1,
        name: "Grey's Veg",
        price: 12.99,
        description: "A delicious vegetarian meal with fresh ingredients.",
        image: "https://images.unsplash.com/photo-1559717763-bb1ab6b1dbac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Healthy Pasta",
        price: 10.99,
        description: "A healthy and delicious pasta dish with seasonal vegetables.",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];
 
// Initialize Modal
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    renderDishes();
});
 
// Function to render dishes
function renderDishes() {
    const dishGrid = document.getElementById('dish-grid');
    dishGrid.innerHTML = ''; // Clear previous content
 
    dishes.forEach(dish => {
        const dishCard = document.createElement('div');
        dishCard.classList.add('col', 's12', 'm6', 'l4');
        dishCard.innerHTML = `
            <div class="card dish-card">
                <div class="card-image">
                    <img src="${dish.image}" alt="${dish.name}">
                </div>
                <div class="card-content">
                    <span class="card-title">${dish.name}</span>
                    <p>$${dish.price.toFixed(2)}</p>
                    <p>${dish.description}</p>
                </div>
                <div class="card-action">
                    <a href="#" onclick="editDish(${dish.id})"><i class="material-icons left">edit</i>Edit</a>
                    <a href="#" onclick="deleteDish(${dish.id})"><i class="material-icons left">delete</i>Delete</a>
                </div>
            </div>
        `;
        dishGrid.appendChild(dishCard);
    });
}
 
// Function to add or edit a dish
document.getElementById('dish-form').addEventListener('submit', function(e) {
    e.preventDefault();
 
    const dishName = document.getElementById('dish-name').value;
    const dishPrice = parseFloat(document.getElementById('dish-price').value);
    const dishDescription = document.getElementById('dish-description').value;
    const dishImage = document.getElementById('dish-image').value;
 
    const newDish = {
        id: dishes.length + 1,
        name: dishName,
        price: dishPrice,
        description: dishDescription,
        image: dishImage
    };
 
    dishes.push(newDish);
    renderDishes(); // Re-render the dish grid
    M.Modal.getInstance(document.getElementById('add-dish-modal')).close(); // Close the modal
});
 
// Function to edit a dish (dummy for now)
function editDish(id) {
    const dish = dishes.find(d => d.id === id);
    if (dish) {
        // Populate the form with the dish data (can be enhanced later)
        document.getElementById('dish-name').value = dish.name;
        document.getElementById('dish-price').value = dish.price;
        document.getElementById('dish-description').value = dish.description;
        document.getElementById('dish-image').value = dish.image;
        M.updateTextFields(); // Update labels for pre-filled inputs
    }
}
 
// Function to delete a dish
function deleteDish(id) {
    const index = dishes.findIndex(d => d.id === id);
    if (index !== -1) {
        dishes.splice(index, 1); // Remove dish from the array
        renderDishes(); // Re-render the dish grid
    }
}
 