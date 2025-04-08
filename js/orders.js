// public/js/orders.js
document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.querySelector('.orders-container');
    const orderForm = document.getElementById('order-form');
    const addOrderButton = document.getElementById('add-order');
    const saveOrderButton = document.getElementById('save-order');
    const cancelOrderButton = document.getElementById('cancel-order');
    const orderIdInput = document.getElementById('order-id');
    const userIdInput = document.getElementById('user-id');
    const movieTitleInput = document.getElementById('movie-title');
    const orderDateInput = document.getElementById('order-date');
    const totalAmountInput = document.getElementById('total-amount');
    const statusInput = document.getElementById('status');

    function fetchOrders() {
        fetch('/get-orders')
            .then(response => response.json())
            .then(orders => {
                let tableHtml = '';
                if (orders && orders.length > 0) {
                    tableHtml = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User ID</th>
                                    <th>Movie Title</th>
                                    <th>Order Date</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.map(order => `
                                    <tr>
                                        <td>${order.id}</td>
                                        <td>${order.userId}</td>
                                        <td>${order.movieTitle}</td>
                                        <td>${formatDate(order.orderDate)}</td>
                                        <td>$${order.totalAmount}</td>
                                        <td>${order.status}</td>
                                        <td>
                                            <button class="edit-order" data-id="${order.id}">Edit</button>
                                            <button class="delete-order" data-id="${order.id}">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                } else {
                    tableHtml = '<p>No orders found.</p>';
                }
                ordersContainer.innerHTML = tableHtml;
                addEditDeleteListeners();
            });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    function addEditDeleteListeners() {
        ordersContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-order')) {
                const orderId = event.target.dataset.id;
                fetch(`/get-order/${orderId}`)
                    .then(response => response.json())
                    .then(order => {
                        orderIdInput.value = order.id;
                        userIdInput.value = order.userId;
                        movieTitleInput.value = order.movieTitle;
                        orderDateInput.value = order.orderDate.split('T')[0];
                        totalAmountInput.value = order.totalAmount;
                        statusInput.value = order.status;
                        orderForm.style.display = 'block';
                    });
            } else if (event.target.classList.contains('delete-order')) {
                const orderId = event.target.dataset.id;
                fetch(`/delete-order/${orderId}`, { method: 'DELETE' })
                    .then(() => fetchOrders());
            }
        });
    }

    addOrderButton.addEventListener('click', () => {
        orderIdInput.value = '';
        userIdInput.value = '';
        movieTitleInput.value = '';
        orderDateInput.value = '';
        totalAmountInput.value = '';
        statusInput.value = 'Pending';
        orderForm.style.display = 'block';
    });

    saveOrderButton.addEventListener('click', () => {
        const orderData = {
            id: orderIdInput.value,
            userId: userIdInput.value,
            movieTitle: movieTitleInput.value,
            orderDate: orderDateInput.value,
            totalAmount: totalAmountInput.value,
            status: statusInput.value
        };
        const method = orderIdInput.value ? 'PUT' : 'POST';
        fetch('/save-order', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        }).then(() => {
            orderForm.style.display = 'none';
            fetchOrders();
        });
    });

    cancelOrderButton.addEventListener('click', () => {
        orderForm.style.display = 'none';
    });

    fetchOrders();
});