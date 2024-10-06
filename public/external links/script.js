function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active'); 
}

function toggleQA() {
    const qnaContent = document.getElementById("qna-content");
    if (qnaContent.style.display === "none") {
      qnaContent.style.display = "block";
    } else {
      qnaContent.style.display = "none";
    }
  }
  