const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

function handleHeaderScroll() {
    header.classList.toggle("scrolled", window.scrollY > 16);
}

function toggleMenu() {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMenu() {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
}

function setActiveLink() {
    const offset = header.offsetHeight + 20;
    const scrollPos = window.scrollY + offset;

    let activeId = "";

    sections.forEach((section) => {
        if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
        ) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const id = link.getAttribute("href")?.replace("#", "");
        link.classList.toggle("active", id === activeId);
    });
}

menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
    handleHeaderScroll();
    setActiveLink();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
});

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));

    document.body.classList.add("lights-on");
});

handleHeaderScroll();
setActiveLink();
