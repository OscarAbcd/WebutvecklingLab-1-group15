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

// Function to handle login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'hacker' && password === '123') {
        // Hardcoded user is valid
        showPage('game'); // Redirect to game page
    } else {
        // Handle other users: Simulate sending to form check server
        loginUser(username, password);
    }
});

// Function to send login request to the form check server
async function loginUser(username, password) {
    const hashedPassword = await hashPassword(password); // Hash password

    // Prepare form data to be sent
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', hashedPassword);

    try {
        // Send form data via HTTP to the form check URL
        const response = await fetch('https://kihlman.eu/formcheck.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Send as form data
            },
            body: formData.toString() // Convert form data to query string format
        });

        const resultText = await response.text(); // Get the response as plain text

        // Display the result (which should echo what you sent)
        console.log(resultText); // For debugging
        document.getElementById('login-error').textContent = `Response from server: ${resultText}`;

    } catch (error) {
        console.error('Error sending login data:', error);
        document.getElementById('login-error').textContent = 'Error communicating with server.';
    }
}

// Example function to hash the password (SHA-256 for simplicity)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

