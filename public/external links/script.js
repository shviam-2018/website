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
// Obfuscate API key (not secure, but deters basic bots)
document.getElementById('access_key').value = ['7b45b2b1-4836-4576-84cc-d186ae71a498'].join('');
// Prevent submission if honeypot is filled
document.getElementById("contactForm").addEventListener("submit", function(event) {
  if (document.querySelector('input[name="website"]').value !== "") {
    event.preventDefault();
    return false;
  }
  setTimeout(function() {
      document.getElementById("contactForm").reset();
  }, 100);
});

// Auto-clear the form when leaving the page
window.addEventListener("beforeunload", function(event) {
    document.getElementById("contactForm").reset();
});
  