// Function to hash the password using the SubtleCrypto API
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashedData = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashedData));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword; // Returns a hex string representation of the hash
}

// Function to send login request to the form check server without handling response
async function loginUser(username, password) {
    const hashedPassword = await hashPassword(password); // Hash password

    // Prepare form data to be sent
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', hashedPassword);

    try {
        // Send form data via HTTP to the form check URL (no response handling)
        await fetch('https://kihlman.eu/formcheck.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Send as form data
            },
            body: formData.toString() // Convert form data to query string format
        });

        console.log("Login attempt sent to the server."); // For debugging or confirmation
        document.getElementById('login-error').textContent = `Login attempt sent for user: ${username}`;

    } catch (error) {
        console.error('Error sending login data:', error);
        document.getElementById('login-error').textContent = `Error communicating with server: ${error.message}`;
    }
}

// Function to validate user credentials
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check against the hardcoded user
    if (username === "hacker" && password === "123") {
        console.log("Hardcoded user logged in successfully.");
        document.getElementById('login-error').textContent = ""; // Clear error message
        // Load the game after successful login
        showPage('game');
    } else {
        // Send login data to the server for other users
        loginUser(username, password);
    }
}

// Event listener for the login button
document.getElementById('login-btn').addEventListener('click', validateLogin);

// Function to show the selected page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    
    // Loop through all pages and hide them
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
}

