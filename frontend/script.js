console.log("script loaded");

const fadeElements = document.querySelectorAll(".fade-in");

const appear = () => {
  fadeElements.forEach((el) => {
    const pos = el.getBoundingClientRect().top;
    if (pos < window.innerHeight - 100) {
      el.style.animationPlayState = "running";
    }
  });
};

window.addEventListener("scroll", appear);
appear();

// Contact form
const form = document.getElementById("contactForm");
const statusTxt = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("button clicked");

  statusTxt.textContent = "Sending...";

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  try {
    const response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    statusTxt.textContent = result.message;

    if(response.ok){
    statusTxt.style.color = "lightgreen";
    form.reset();
    }   
else{
    statusTxt.style.color = "red";
}
  } catch (err) {
    console.log("FRONTEND ERROR:", err);
    statusTxt.textContent = "❌ Frontend error — cannot reach backend";
  }
});
