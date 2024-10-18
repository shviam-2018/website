function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active'); 
}

function toggleQA(contentId) {
  const content = document.getElementById(contentId);
  
  // Toggle visibility
  if (content.style.display === "none" || content.style.display === "") {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}

// contact page
// Auto-clear the form on submit
document.getElementById("contactForm").addEventListener("submit", function(event) {
  setTimeout(function() {
      document.getElementById("contactForm").reset();
  }, 100); // Slight delay to allow form submission to process
});

// Auto-clear the form when leaving the page
window.addEventListener("beforeunload", function(event) {
  document.getElementById("contactForm").reset();
}); 
  
  