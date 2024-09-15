// order-management.js
 
// Mock data for orders
const orders = [
    {
        id: 1,
        status: 'pending',
        name: "Grey's Veg",
        price: 12.99,
        customer: 'John Doe',
        image: "https://images.unsplash.com/photo-1559717763-bb1ab6b1dbac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        status: 'accepted',
        name: "Healthy Pasta",
        price: 10.99,
        customer: 'Jane Smith',
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        status: 'completed',
        name: "Avocado Bowl",
        price: 8.99,
        customer: 'Alex Johnson',
        image: "https://images.unsplash.com/photo-1564936289921-1caaa7f3d661?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];
 
// Initialize Tabs
document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);
    renderOrders();
});
 
// Function to render orders
function renderOrders() {
    const pendingOrdersGrid = document.getElementById('pending-orders-grid');
    const acceptedOrdersGrid = document.getElementById('accepted-orders-grid');
    const completedOrdersGrid = document.getElementById('completed-orders-grid');
 
    pendingOrdersGrid.innerHTML = '';
    acceptedOrdersGrid.innerHTML = '';
    completedOrdersGrid.innerHTML = '';
 
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('col', 's12', 'm6', 'l4');
        orderCard.innerHTML = `
            <div class="card order-card">
                <div class="card-image">
                    <img src="${order.image}" alt="${order.name}">
                </div>
                <div class="card-content">
                    <span class="card-title">${order.name}</span>
                    <p>Customer: ${order.customer}</p>
                    <p>$${order.price.toFixed(2)}</p>
                </div>
                <div class="card-action">
                    ${order.status === 'pending' ? `<a href="#" onclick="acceptOrder(${order.id})"><i class="material-icons left">check_circle</i>Accept</a>` : ''}
                    ${order.status === 'accepted' ? `<a href="#" onclick="completeOrder(${order.id})"><i class="material-icons left">done</i>Complete</a>` : ''}
                </div>
            </div>
        `;
 
        if (order.status === 'pending') {
            pendingOrdersGrid.appendChild(orderCard);
        } else if (order.status === 'accepted') {
            acceptedOrdersGrid.appendChild(orderCard);
        } else if (order.status === 'completed') {
            completedOrdersGrid.appendChild(orderCard);
        }
    });
}
 
// Function to accept an order
function acceptOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'accepted';
        renderOrders();
    }
}
 
// Function to complete an order
function completeOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        renderOrders();
    }
}
 
