document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
  
    // Register Logic
    if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent the form from submitting the traditional way
  
        const firstName = document.getElementById("first_name").value;
        const lastName = document.getElementById("last_name").value;
        const phoneNumber = document.getElementById("phone_number").value;
        const email = document.getElementById("email").value; // Ensure this is the same ID as in signup
        const password = document.getElementById("password").value;
  
        try {
          const response = await fetch(
            "http://localhost:5000/api/users/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
              }),
            }
          );
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Registration failed. Please try again."
            );
          }
  
          const data = await response.json();
          console.log("Registration successful:", data.message);
          window.location.href = "./login.html"; // Redirect to login or another page
        } catch (error) {
          console.error("Error during registration:", error);
          alert(`An error occurred: ${error.message}`);
        }
      });
    }
  });
  

frontend/user/auth/signup.js