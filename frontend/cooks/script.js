// dashboard.js

// Mock Data for Earnings Chart
const ctx = document.getElementById('earningsChart').getContext('2d');
const earningsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Earnings',
            data: [1200, 1500, 1300, 1800, 1600, 2000],
            borderColor: '#ff6f00',
            backgroundColor: 'rgba(255, 111, 0, 0.1)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
