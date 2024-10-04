<h1>Homely Application</h1>

<p>Homely is a food ordering platform connecting users with local home cooks and restaurants. The platform allows customers to browse dishes, add items to their cart, and place orders. Cooks can manage their dishes and view customer orders in their dashboard.</p>

<hr />

<h2>Table of Contents</h2>
<ul>
  <li><a href="#installation-instructions">Installation Instructions</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#tech-stack">Tech Stack</a></li>
  <li><a href="#api-endpoints">API Endpoints</a></li>
  <li><a href="#notes">Notes</a></li>
  <li><a href="#license">License</a></li>
</ul>

<hr />

<h2 id="installation-instructions">Installation Instructions</h2>

<h3>1. Clone the Repository</h3>

<pre>
<code>
git clone https://github.com/your-repository/homely.git
cd homely
</code>
</pre>

<h3>2. Install Dependencies</h3>

<p>Install the required dependencies for both frontend and backend:</p>

<pre>
<code>
npm install
</code>
</pre>

<h3>3. Backend Setup</h3>

<p>Navigate to the backend folder and start the server:</p>

<pre>
<code>
cd backend
npm run start
</code>
</pre>

<p>This will start the backend server at <strong>http://localhost:5000</strong>.</p>

<h3>4. Frontend Setup</h3>

<p>For the frontend, open either the <strong>User Side</strong> or <strong>Cook Side</strong> in your browser using <strong>Live Server</strong>:</p>

<ul>
  <li><strong>User Side</strong>: Open <code>/frontend/user/</code> folder.</li>
  <li><strong>Cook Side</strong>: Open <code>/frontend/cook/</code> folder.</li>
</ul>

<p>You can use Live Server in VSCode or any similar tool.</p>

<hr />

<h2 id="usage">Usage</h2>

<ol>
  <li><strong>User Side</strong>: Customers can browse dishes, add them to their cart, and place orders.</li>
  <li><strong>Cook Side</strong>: Cooks can manage dishes, view and update customer orders.</li>
</ol>

<hr />

<h2 id="tech-stack">Tech Stack</h2>

<ul>
  <li><strong>Frontend:</strong> HTML, CSS, JavaScript, Materialize CSS</li>
  <li><strong>Backend:</strong> Node.js, Express.js, MongoDB (Mongoose)</li>
  <li><strong>Database:</strong> MongoDB (Local or Cloud)</li>
  <li><strong>Deployment:</strong> Local using Live Server and Node.js</li>
</ul>

<hr />

<h2 id="api-endpoints">API Endpoints</h2>

<ul>
  <li><strong>User Login</strong>: <code>POST /api/users/login</code></li>
  <li><strong>User Registration</strong>: <code>POST /api/users/register</code></li>
  <li><strong>Get Cart Items</strong>: <code>GET /api/users/cart/:userId</code></li>
  <li><strong>Add to Cart</strong>: <code>POST /api/users/cart</code></li>
  <li><strong>Remove from Cart</strong>: <code>DELETE /api/users/cart/:userId/:dishName</code></li>
  <li><strong>Place Order</strong>: <code>POST /api/users/order</code></li>
</ul>

<hr />

<h2 id="notes">Notes</h2>

<ul>
  <li>Ensure MongoDB is running locally or connected via a cloud database.</li>
  <li>The frontend should be run using <strong>Live Server</strong>.</li>
</ul>

<hr />

<h2 id="license">License</h2>

<p>This project is licensed under the MIT License.</p>

