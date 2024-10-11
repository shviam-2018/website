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

  
  