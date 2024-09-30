// Initialize Modal and Fetch Dishes on Page Load
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Page loaded");
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);
   
    const restaurantId = localStorage.getItem("restaurantId");
    if (restaurantId) {
      await fetchAndRenderDishes(restaurantId); // Fetch and render dishes
    } else {
      alert("Restaurant ID not found in local storage!");
    }
  });
   
  // Function to fetch and render dishes
  async function fetchAndRenderDishes(restaurantId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurants/${restaurantId}/items`
      );
      const data = await response.json();
   
      if (response.ok) {
        renderDishes(data.items); // Pass the fetched items to render
      } else {
        alert(data.message || "Failed to fetch dishes");
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      alert("Failed to fetch dishes due to a server error");
    }
  }
   
  // Function to render dishes
  function renderDishes(dishes) {
    const dishGrid = document.getElementById("dish-grid");
    dishGrid.innerHTML = ""; // Clear previous content
   
    dishes.forEach((dish) => {
      const dishCard = document.createElement("div");
      dishCard.classList.add("col", "s12", "m6", "l4");
      dishCard.innerHTML = `
          <div class="card dish-card">
            <div class="card-image">
              <img src="${dish.imageUrl}" alt="${dish.dishName}">
            </div>
            <div class="card-content">
              <span class="card-title">${dish.dishName}</span>
              <p>$${dish.price.toFixed(2)}</p>
              <p>${dish.description}</p>
            </div>
            <div class="card-action">
              <a href="#" onclick="editDish('${
                dish._id
              }')"><i class="material-icons left">edit</i>Edit</a>
              <a href="#" onclick="deleteDish('${
                dish._id
              }')"><i class="material-icons left">delete</i>Delete</a>
            </div>
          </div>
        `;
      dishGrid.appendChild(dishCard);
    });
  }
   
  // Function to add or edit a dish
  document
    .getElementById("dish-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
   
      console.log("Form submitted");
   
      const restaurantId = localStorage.getItem("restaurantId");
      if (!restaurantId) {
        alert("Restaurant ID not found in local storage!");
        return;
      }
   
      const dishId = document.getElementById("dish-id").value; // Handle dishId for editing
      const dishName = document.getElementById("dish-name").value;
      const dishPrice = parseFloat(document.getElementById("dish-price").value);
      const dishDescription = document.getElementById("dish-description").value;
      const dishImage = document.getElementById("dish-image").value;
   
      console.log("Dish Data:", {
        dishId,
        dishName,
        dishPrice,
        dishDescription,
        dishImage,
      });
   
      const dishData = {
        dishName,
        price: dishPrice,
        description: dishDescription,
        imageUrl: dishImage,
      };
   
      try {
        let response;
        if (dishId) {
          // If dishId exists, it's an update
          response = await fetch(
            `http://localhost:5000/api/restaurants/${restaurantId}/items/${dishId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dishData),
            }
          );
        } else {
          // No dishId, so it's a new dish
          response = await fetch(
            `http://localhost:5000/api/restaurants/${restaurantId}/items`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dishData),
            }
          );
        }
   
        const data = await response.json();
   
        if (response.ok) {
          alert("Dish saved successfully!");
          await fetchAndRenderDishes(restaurantId); // Re-fetch and render the updated dishes
          M.Modal.getInstance(document.getElementById("add-dish-modal")).close(); // Close the modal
        } else {
          alert(data.message || "Failed to save dish");
        }
      } catch (error) {
        console.error("Error saving dish:", error);
        alert("Failed to save dish due to a server error");
      }
    });
   
  // Function to set up the form for editing a dish
  function editDish(id) {
    fetch(
      `http://localhost:5000/api/restaurants/${localStorage.getItem(
        "restaurantId"
      )}/items/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.item) {
          document.getElementById("dish-id").value = data.item._id;
          document.getElementById("dish-name").value = data.item.dishName;
          document.getElementById("dish-price").value = data.item.price;
          document.getElementById("dish-description").value =
            data.item.description;
          document.getElementById("dish-image").value = data.item.imageUrl;
   
          M.Modal.getInstance(document.getElementById("add-dish-modal")).open(); // Open modal for editing
        } else {
          alert("Dish not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching dish for editing:", error);
        alert("Failed to fetch dish details");
      });
  }
   
  // Function to delete a dish
  function deleteDish(id) {
    const confirmDelete = confirm("Are you sure you want to delete this dish?");
    if (confirmDelete) {
      fetch(
        `http://localhost:5000/api/restaurants/${localStorage.getItem(
          "restaurantId"
        )}/items/${id}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          if (response.ok) {
            alert("Dish deleted successfully!");
            await fetchAndRenderDishes(localStorage.getItem("restaurantId")); // Re-fetch and render the updated dishes
          } else {
            alert(data.message || "Failed to delete dish");
          }
        })
        .catch((error) => {
          console.error("Error deleting dish:", error);
          alert("Failed to delete dish due to a server error");
        });
    }
  }