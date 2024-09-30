// Initialize Tabs and fetch orders on page load
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tabs");
    M.Tabs.init(tabs);
   
    const restaurantId = localStorage.getItem("restaurantId");
   
    if (restaurantId) {
      fetchOrders(restaurantId);
    } else {
      console.error("Restaurant ID not found in localStorage.");
    }
  });
   
  // Function to fetch orders from the backend for the given restaurant
  async function fetchOrders(restaurantId) {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${restaurantId}`);
      const data = await response.json();
   
      if (data.success) {
        const { pendingOrders, acceptedOrders, completedOrders } = data.data;
        renderOrders(pendingOrders, acceptedOrders, completedOrders);
      } else {
        console.error("Error fetching orders:", data.message);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }
   
  // Function to render orders by status
  function renderOrders(pendingOrders, acceptedOrders, completedOrders) {
    const pendingOrdersGrid = document.getElementById("pending-orders-grid");
    const acceptedOrdersGrid = document.getElementById("accepted-orders-grid");
    const completedOrdersGrid = document.getElementById("completed-orders-grid");
   
    // Clear existing orders
    pendingOrdersGrid.innerHTML = "";
    acceptedOrdersGrid.innerHTML = "";
    completedOrdersGrid.innerHTML = "";
   
    // Render pending orders
    pendingOrders.forEach((order) => createOrderCard(order, pendingOrdersGrid));
   
    // Render accepted orders
    acceptedOrders.forEach((order) => createOrderCard(order, acceptedOrdersGrid));
   
    // Render completed orders
    completedOrders.forEach((order) =>
      createOrderCard(order, completedOrdersGrid)
    );
  }
   
  // Helper function to create order card and append it to the respective grid
  function createOrderCard(order, gridElement) {
    const orderCard = document.createElement("div");
    orderCard.classList.add("col", "s12", "m6", "l4");
    orderCard.innerHTML = `
          <div class="card order-card">
            <div class="card-image">
              <img src="${order.items[0].image}" alt="${order.items[0].dishName}">
            </div>
            <div class="card-content">
              <span class="card-title">${order.items[0].dishName}</span>
              <p>Customer: ${order.customerName}</p>
              <p>$${order.totalAmount.toFixed(2)}</p>
            </div>
            <div class="card-action">
              ${order.items.some(item => item.status === "Pending") 
                ? `<a href="#" onclick="updateOrderStatus('${order._id}', 'Accepted')"><i class="material-icons left">check_circle</i>Accept</a>` 
                : ""}
              ${order.items.some(item => item.status === "Accepted") 
                ? `<a href="#" onclick="updateOrderStatus('${order._id}', 'Completed')"><i class="material-icons left">done</i>Complete</a>` 
                : ""}
            </div>
          </div>
        `;
    gridElement.appendChild(orderCard);
  }
   
  // Function to update order status (Accept/Complete)
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
   
      if (response.ok) {
        // Refetch and re-render orders after status update
        const restaurantId = localStorage.getItem("restaurantId"); // Use restaurantId from localStorage
        if (restaurantId) {
          fetchOrders(restaurantId);
        } else {
          console.error("Restaurant ID not found in localStorage.");
        }
      } else {
        console.error("Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  }