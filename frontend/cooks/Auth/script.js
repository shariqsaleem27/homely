document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("#signup-form");
    const loginForm = document.querySelector("#login-form");
   
    // Signup Form Submission Logic
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent the default form submission
   
        // Collecting form data for signup
        const signupData = {
          firstName: document.getElementById("first_name").value,
          lastName: document.getElementById("last_name").value,
          phoneNumber: document.getElementById("phone").value,
          restaurantName: document.getElementById("restaurant_name").value,
          location: document.getElementById("location").value,
          password: document.getElementById("password").value, // Password field
        };
   
        try {
          // Sending signup data to the backend via POST
          const response = await fetch(
            "http://localhost:5000/api/restaurants/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(signupData),
            }
          );
   
          const result = await response.json();
   
          if (response.ok) {
            alert("Registration successful!");
            console.log("Server response:", result);
   
            // Store restaurantId in local storage
            const restaurantId = result.data._id;
            localStorage.setItem("restaurantId", restaurantId);
   
            // Redirecting to the cook dashboard
            window.location.href = "/frontend/cooks/auth/index.html";
          } else {
            alert("Error: " + result.message);
          }
        } catch (error) {
          alert("Failed to submit the form: " + error.message);
          console.error("Error:", error);
        }
      });
    }
   
    // Login Form Submission Logic
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Prevent the default form submission
   
        // Collecting form data for login
        const loginData = {
          phoneNumber: document.getElementById("phone").value,
          password: document.getElementById("password").value, // Password field
        };
   
        try {
          // Sending login data to the backend via POST
          const response = await fetch(
            "http://localhost:5000/api/restaurants/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginData),
            }
          );
   
          const result = await response.json();
   
          if (response.ok) {
            // alert("Login successful!");
            console.log("Server response:", result);
   
            // Store the JWT token in local storage
            const token = result.token;
            localStorage.setItem("token", token);
   
            // Redirecting to the cook dashboard
            window.location.href = "/frontend/cooks/";
          } else {
            alert("Error: " + result.message);
          }
        } catch (error) {
          alert("Failed to login: " + error.message);
          console.error("Error:", error);
        }
      });
    }
  });