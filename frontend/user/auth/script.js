document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form"); // This is the login form (ensure you give it an ID if needed)
  
    // Login Logic
    if (loginForm) {
      loginForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent the form from submitting the traditional way
  
        const email = document.getElementById("email").value; // Ensure these IDs are for the login form
        const password = document.getElementById("password").value;
  
        try {
          const response = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Login failed. Please try again."
            );
          }
  
          const data = await response.json();
          console.log(data.data)
          console.log("Login successful:", data.message);
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.data._id); // Store the user ID
          window.location.href = "/frontend/user"; // Redirect to another page
        } catch (error) {
          console.error("Error during login:", error);
          alert(`An error occurred: ${error.message}`);
        }
      });
    }
  });
  
  
 