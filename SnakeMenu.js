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
