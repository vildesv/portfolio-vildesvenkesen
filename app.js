const gengar = document.getElementById("gengar");
const buttons = document.querySelectorAll(".nav-wrapper button");
const popup = document.getElementById("popup");
const aboutContainer = document.getElementById("about-container");
const projectsContainer = document.getElementById("projects-container");
const contactContainer = document.getElementById("contact-container");
const popupText = document.getElementById("popup-text");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const closeBtn = document.getElementById("close-popup");

const contents = {
  about: `
    <h2>About me</h2>
    <p>Hey there! My name is Vilde, and I’m currently a student and aspiring fullstack developer. I have a strong interest in tech, programming, gaming, and art, and as you might have noticed, I'm also a huge Pokémon enthusiast. Being on the autism spectrum gives me a unique perspective and strong attention to detail, which helps me approach challenges thoughtfully and innovatively, while valuing clear communication and structure.</p>
    <br>
    <h3>Skills and Tools</h3>
    <ul>
      <li><i class="devicon-csharp-plain"></i> C#, .NET</li>
      <li><i class="devicon-javascript-plain"></i> JavaScript, React, Vite, Node.js</li>
      <li><i class="devicon-microsoftsqlserver-plain"></i> SQL, Microsoft SQL Server, SQL Server Management Studio</li>
      <li><i class="devicon-git-plain"></i> Git, GitHub</li>
      <li><i class="devicon-azure-plain"></i> Azure</li>
      <li><i class="devicon-figma-plain"></i> Figma</li>
    </ul>
  `,
  contact: `
    <h2>Contact</h2>
    <p>I'm open to opportunities and collaborations. Feel free to reach out!</p>
    <br>
    <ul>
      <li><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:vilde_svenkesen@hotmail.no">vilde_svenkesen@hotmail.no</a></li>
      <li><i class="fab fa-github"></i> <strong>GitHub:</strong> <a href="https://github.com/vildesv" target="_blank">github.com/vildesv</a></li>
      <li><i class="fab fa-linkedin"></i> <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/vilde-svenkesen-289166b2/" target="_blank">Vilde Svenkesen</a></li>
    </ul>
  `,
};

let repos = [];
let currentProject = 0;

function moveGengarToButton(button) {
  const rect = button.getBoundingClientRect();
  const parentRect = button.parentElement.getBoundingClientRect();
  const offsetX =
    rect.left - parentRect.left + rect.width / 2 - gengar.offsetWidth / 2;
  const offsetY = rect.top - parentRect.top - gengar.offsetHeight + 10;
  gengar.style.left = `${offsetX}px`;
  gengar.style.top = `${offsetY}px`;
}

// Hent prosjekter og begrens til nyeste fra inneværende år
async function fetchRepos() {
  try {
    const response = await fetch("https://api.github.com/users/vildesv/repos");
    repos = await response.json();

    // Filtrer prosjekter fra inneværende år
    const currentYear = new Date().getFullYear();
    repos = repos.filter(repo => new Date(repo.created_at).getFullYear() === currentYear && repo.language === "JavaScript" || repo.language === "CSS");

    // Sorter nyeste først
    repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Begrens antall prosjekter
    const maxProjects = 20;
    repos = repos.slice(0, maxProjects);

    currentProject = 0;
    if (repos.length > 0) {
      displayProject(currentProject);
      projectsContainer.classList.add("visible");
    } else {
      popupText.innerHTML = "<p>Ingen prosjekter fra i år.</p>";
      projectsContainer.classList.remove("visible");
    }
  } catch (error) {
    popupText.innerHTML = "<p>Kunne ikke hente prosjekter fra GitHub.</p>";
    projectsContainer.classList.remove("visible");
  }
}

function displayProject(index) {
  const repo = repos[index];

  // Bilde-path basert på repo-navnet (må samsvare med filnavn i img/projects/)
  const imagePath = `img/projects/${repo.name}.png`;

  popupText.innerHTML = `
    <h2>${repo.name}</h2>
    <img src="${imagePath}" alt="${repo.name}" class="project-img">
    <p>${repo.description ? repo.description : "Ingen beskrivelse tilgjengelig."}</p>
    <br>
    <p><a href="${repo.html_url}" target="_blank">Se på GitHub</a></p>
  `;
}

buttons.forEach((btn, index) => {
  btn.addEventListener("click", async () => {
    const type = btn.dataset.popup;

    // Skjul alt innhold først
    aboutContainer.classList.remove("visible");
    projectsContainer.classList.remove("visible");
    contactContainer.classList.remove("visible");

    // Vis relevant innhold
    if (type === "about") {
      aboutContainer.classList.add("visible");
      aboutContainer.innerHTML = contents.about;
    } else if (type === "projects") {
      projectsContainer.classList.add("visible");
      await fetchRepos();
    } else if (type === "contact") {
      contactContainer.classList.add("visible");
      contactContainer.innerHTML = contents.contact;
    }

    popup.classList.remove("hidden");
    moveGengarToButton(btn);
  });

  if (index === 0) {
    window.addEventListener("load", () => moveGengarToButton(btn));
  }
});

nextBtn.addEventListener("click", () => {
  if (repos.length > 0) {
    currentProject = (currentProject + 1) % repos.length;
    displayProject(currentProject);
  }
});

prevBtn.addEventListener("click", () => {
  if (repos.length > 0) {
    currentProject = (currentProject - 1 + repos.length) % repos.length;
    displayProject(currentProject);
  }
});

closeBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});
