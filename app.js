const gengar = document.getElementById("gengar");
const buttons = document.querySelectorAll(".nav-wrapper button");
const popup = document.getElementById("popup");
const aboutContainer = document.getElementById("about-container");
const projectsContainer = document.getElementById("projects-container");
const contactContainer = document.getElementById("contact-container");
const skillsContainer = document.getElementById("skills-container");
const popupText = document.getElementById("popup-text");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const closeBtn = document.getElementById("close-popup");

const contents = {
  about: `<h2>About me</h2>
    <p>Hey there! My name is Vilde Svenkesen.<br>
    I’m a course participant at "Kodehode", aspiring fullstack developer and esports coach.<br><br>
    I have a strong interest in tech, programming, gaming and art. I'm a Pokémon enthusiast and actively engaged in a Pokémon GO-community.<br><br>
    Being on the autism spectrum gives me a unique perspective and strong attention to detail.</p>`,
  
  skills: `<h2>Skills and Tools</h2>
    <ul>
      <li><i class="devicon-csharp-plain"></i> C#, .NET <img src="img/types/psychic.png" alt="Psychic Type" class="type-icon"></li>
      <li><i class="devicon-javascript-plain"></i> JavaScript, React, Node.js <img src="img/types/electric.png" alt="Electric Type" class="type-icon"></li>
      <li><i class="devicon-html5-plain"></i> HTML <img src="img/types/rock.png" alt="Rock Type" class="type-icon"></li>
      <li><i class="devicon-css3-plain"></i> CSS <img src="img/types/fairy.png" alt="Fairy Type" class="type-icon"></li>
      <li><i class="devicon-microsoftsqlserver-plain"></i> SQL <img src="img/types/steel.png" alt="Steel Type" class="type-icon"></li>
      <li><i class="devicon-git-plain"></i> Git, GitHub <img src="img/types/fighting.png" alt="Fighting Type" class="type-icon"></li>
      <li><i class="devicon-azure-plain"></i> Azure <img src="img/types/flying.png" alt="Flying Type" class="type-icon"></li>
      <li><i class="devicon-figma-plain"></i> Figma <img src="img/types/normal.png" alt="Normal Type" class="type-icon"></li>
    </ul>
    <p style="margin-top:0.8rem;font-size:0.85rem;opacity:0.65;">Tech is represented as Pokémon Types in Projects.</p>`,

  contact: `<h2>Contact</h2>
    <p>I'm open to opportunities and collaborations.<br>Feel free to reach out!</p>
    <ul>
      <li><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="mailto:vilde_svenkesen@hotmail.no">vilde_svenkesen@hotmail.no</a></li>
      <li><i class="fab fa-github"></i> <strong>GitHub:</strong> <a href="https://github.com/vildesv" target="_blank">github.com/vildesv</a></li>
      <li><i class="fab fa-linkedin"></i> <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/vilde-svenkesen-289166b2/" target="_blank">Vilde Svenkesen</a></li>
    </ul>`
};

let repos = [];
let currentProject = 0;

function getPokemonType(language) {
  switch(language) {
    case "JavaScript": return "electric";
    case "CSS": return "fairy";
    case "HTML": return "rock";
    case "C#": return "psychic";
    case "SQL": return "steel";
    default: return "ghost";
  }
}

function moveGengarToButton(button) {
  const rect = button.getBoundingClientRect();
  const parentRect = button.parentElement.getBoundingClientRect();

  if (window.matchMedia("(max-width: 768px)").matches) {
    const offsetX = rect.right - parentRect.left + 10;
    const offsetY = rect.top - parentRect.top + rect.height / 2 - gengar.offsetHeight / 2;
    gengar.style.left = `${offsetX}px`;
    gengar.style.top = `${offsetY}px`;
  } else {
    const offsetX = rect.left - parentRect.left + rect.width / 2 - gengar.offsetWidth / 2;
    const offsetY = rect.top - parentRect.top - gengar.offsetHeight + 10;
    gengar.style.left = `${offsetX}px`;
    gengar.style.top = `${offsetY}px`;
  }
}

async function fetchRepos() {
  try {
    const response = await fetch("https://api.github.com/users/vildesv/repos");
    repos = await response.json();

    const currentYear = new Date().getFullYear();
    const earliestYear = currentYear - 1;

    repos = repos.filter(repo =>
      new Date(repo.created_at).getFullYear() >= earliestYear &&
      ["JavaScript","CSS","C#"].includes(repo.language) &&
      repo.name.toLowerCase() !== "portfolio-vildesvenkesen"
    );

    repos.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    repos = repos.slice(0,20);
    currentProject = 0;

    if(repos.length > 0) {
      displayProject(currentProject);
      projectsContainer.classList.add("visible");
    } else {
      popupText.innerHTML = "<p>No Pokédex entries found.</p>";
      projectsContainer.classList.remove("visible");
    }
  } catch(error) {
    popupText.innerHTML = "<p>Failed to load Pokédex data.</p>";
    projectsContainer.classList.remove("visible");
  }
}

function displayProject(index) {
  const repo = repos[index];
  const imagePath = `img/projects/${repo.name}.png`;
  const year = new Date(repo.created_at).getFullYear();
  const type = getPokemonType(repo.language);
  const entryNumber = String(index+1).padStart(3,'0');

  popupText.innerHTML = `
    <h2>#${entryNumber} — ${repo.name}</h2>
    <p class="project-meta">
      <img src="img/types/${type}.png" alt="${type} type" class="type-icon">
      Generation: <strong>${year}</strong>
    </p>
    <img src="${imagePath}" alt="${repo.name}" class="project-img">
    <p class="project-description">
      <strong>Pokédex Entry:</strong><br>
      ${repo.description ? repo.description : "No Pokédex data available."}
    </p>
    <p><a href="${repo.html_url}" target="_blank">View Trainer Logs → GitHub</a></p>
  `;
}

// Event listeners
buttons.forEach((btn,index) => {
  btn.addEventListener("click", async () => {
    aboutContainer.classList.remove("visible");
    projectsContainer.classList.remove("visible");
    contactContainer.classList.remove("visible");
    skillsContainer.classList.remove("visible");

    const type = btn.dataset.popup;
    if(type==="about"){aboutContainer.classList.add("visible"); aboutContainer.innerHTML=contents.about;}
    else if(type==="skills"){skillsContainer.classList.add("visible"); skillsContainer.innerHTML=contents.skills;}
    else if(type==="projects"){projectsContainer.classList.add("visible"); await fetchRepos();}
    else if(type==="contact"){contactContainer.classList.add("visible"); contactContainer.innerHTML=contents.contact;}

    popup.classList.remove("hidden");
    moveGengarToButton(btn);
  });

  if(index===0){
    window.addEventListener("load",()=>moveGengarToButton(btn));
  }
});

nextBtn.addEventListener("click",()=>{
  if(repos.length>0){currentProject=(currentProject+1)%repos.length; displayProject(currentProject);}
});

prevBtn.addEventListener("click",()=>{
  if(repos.length>0){currentProject=(currentProject-1+repos.length)%repos.length; displayProject(currentProject);}
});

closeBtn.addEventListener("click",()=>popup.classList.add("hidden"));