
const FUNPAY_LINKS = {
  "7": "https://funpay.com/lots/offer?id=80090759",
  "14": "https://funpay.com/lots/offer?id=80090731",
  "30": "https://funpay.com/lots/offer?id=80090733"
};

document.querySelectorAll("[data-plan]").forEach((button) => {
  const plan = button.getAttribute("data-plan");
  const link = FUNPAY_LINKS[plan];

  if (link) {
    button.setAttribute("href", link);
    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener noreferrer");
  }
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}
