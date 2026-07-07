const defaultProfile = {
  siteTitle: "个人主页",
  name: "你的名字",
  images: [
    "images/me-1.jpg",
    "images/me-2.jpg",
    "images/me-3.jpg",
    "images/me-4.jpg",
    "images/me-5.jpg",
    "images/me-6.jpg",
    "images/me-7.jpg",
    "images/me-8.jpg",
    "images/me-9.jpg",
    "images/me-10.jpg",
    "images/me-11.jpg",
    "images/me-12.jpg"
  ],
  initials: "我",
  tagline: "欢迎来到我的个人空间",
  role: "职业 / 学生 / 创作者",
  location: "所在城市",
  intro: "在这里写下一段简短介绍：你是谁、正在做什么、擅长什么，以及别人为什么想认识你。",
  about: "这里可以写更完整的个人介绍，例如教育背景、工作方向、兴趣爱好、价值观或近期目标。",
  email: "your@email.com",
  phone: "可选",
  social: "#",
  resume: "#",
  contactNote: "欢迎通过下面的方式联系我，交流合作、机会或想法。",
  experience: [
    {
      period: "2024 - 至今",
      title: "当前经历",
      description: "写下你最近的工作、学习或创作经历。"
    },
    {
      period: "2022 - 2024",
      title: "过往经历",
      description: "描述一个重要阶段，以及你负责或完成的事情。"
    }
  ],
  projects: [
    {
      title: "代表项目",
      description: "介绍项目目标、你的贡献，以及最后产生的结果。",
      link: "#"
    },
    {
      title: "个人作品",
      description: "展示你希望别人看到的作品、文章、视频或产品。",
      link: "#"
    },
    {
      title: "更多内容",
      description: "可以放 GitHub、作品集、公众号、博客或其他链接。",
      link: "#"
    }
  ]
};

const storageKey = "personal-site-profile";
const editor = document.querySelector("#editor");
const form = document.querySelector("#profileForm");
const toast = document.querySelector("#toast");
const portrait = document.querySelector("#portraitPreview");
const imageDots = document.querySelector("#imageDots");
const editToggle = document.querySelector("#editToggle");

let profile = loadProfile();
let imageIndex = 0;
let imageTimer = null;

function loadProfile() {
  if (window.siteProfile) {
    return normalizeProfile({ ...defaultProfile, ...window.siteProfile });
  }

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return stored ? normalizeProfile({ ...defaultProfile, ...stored }) : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function normalizeProfile(nextProfile) {
  if (!Array.isArray(nextProfile.images)) {
    nextProfile.images = [];
  }

  if (nextProfile.avatar && !nextProfile.images.length) {
    nextProfile.images = [nextProfile.avatar];
  }

  nextProfile.images = nextProfile.images.map((url) => text(url)).filter(Boolean);
  return nextProfile;
}

function saveProfile(nextProfile) {
  profile = normalizeProfile(nextProfile);
  localStorage.setItem(storageKey, JSON.stringify(profile));
  renderProfile();
  fillForm();
}

function text(value, fallback = "") {
  return String(value || fallback).trim();
}

function initialsFromName(name) {
  const cleanName = text(name, "我");
  const chars = Array.from(cleanName.replace(/\s+/g, ""));
  return chars.slice(0, 2).join("") || "我";
}

function setText(field, value) {
  document.querySelectorAll(`[data-field="${field}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function renderProfile() {
  document.title = `${text(profile.name, "我的")} - ${text(profile.siteTitle, "个人主页")}`;

  setText("siteTitle", text(profile.siteTitle, defaultProfile.siteTitle));
  setText("name", text(profile.name, defaultProfile.name));
  setText("initials", text(profile.initials, initialsFromName(profile.name)));
  setText("tagline", text(profile.tagline, defaultProfile.tagline));
  setText("role", text(profile.role, defaultProfile.role));
  setText("location", text(profile.location, defaultProfile.location));
  setText("intro", text(profile.intro, defaultProfile.intro));
  setText("about", text(profile.about, defaultProfile.about));
  setText("email", text(profile.email, defaultProfile.email));
  setText("phone", text(profile.phone, defaultProfile.phone));
  setText("contactNote", text(profile.contactNote, defaultProfile.contactNote));

  renderPortrait();
  renderContactLinks();
  renderExperience();
  renderProjects();
}

function renderPortrait() {
  window.clearInterval(imageTimer);
  imageTimer = null;
  imageIndex = Math.min(imageIndex, Math.max(profile.images.length - 1, 0));
  setPortraitImage(imageIndex);
  renderImageDots();

  if (profile.images.length > 1) {
    imageTimer = window.setInterval(() => {
      imageIndex = (imageIndex + 1) % profile.images.length;
      setPortraitImage(imageIndex);
      renderImageDots();
    }, 5000);
  }
}

function setPortraitImage(index) {
  portrait.querySelectorAll(".portrait-window").forEach((node) => node.remove());

  if (!profile.images.length) {
    portrait.classList.remove("has-image");
    portrait.style.backgroundImage = "";
    return;
  }

  portrait.classList.add("has-image");
  portrait.style.backgroundImage = "";

  const visibleCards =
    profile.images.length === 1
      ? [{ imageIndex: index, className: "active entering" }]
      : [
          {
            imageIndex: (index - 1 + profile.images.length) % profile.images.length,
            className: "previous"
          },
          { imageIndex: index, className: "active entering" },
          {
            imageIndex: (index + 1) % profile.images.length,
            className: "next"
          }
        ];

  visibleCards.forEach((card) => {
    const imageUrl = profile.images[card.imageIndex];
    const layer = document.createElement("div");
    layer.className = `portrait-window ${card.className}`;
    layer.style.backgroundImage = `url("${imageUrl.replaceAll('"', "%22")}")`;
    layer.setAttribute("aria-hidden", "true");
    portrait.append(layer);
  });
}

function renderImageDots() {
  imageDots.innerHTML = "";
  imageDots.hidden = profile.images.length <= 1;

  profile.images.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === imageIndex ? "active" : "";
    button.setAttribute("aria-label", `切换到第 ${index + 1} 张图片`);
    button.addEventListener("click", () => {
      imageIndex = index;
      renderPortrait();
    });
    imageDots.append(button);
  });
}

function renderContactLinks() {
  const emailLink = document.querySelector("#emailLink");
  emailLink.href = `mailto:${text(profile.email, defaultProfile.email)}`;

  const socialLink = document.querySelector("#socialLink");
  socialLink.href = text(profile.social, "#");
  socialLink.style.display = text(profile.social) && profile.social !== "#" ? "inline-flex" : "none";

  const resumeLink = document.querySelector("#resumeLink");
  resumeLink.href = text(profile.resume, "#");
  resumeLink.style.display = text(profile.resume) && profile.resume !== "#" ? "inline-flex" : "none";
}

function renderExperience() {
  const list = document.querySelector("#experienceList");
  list.innerHTML = "";
  profile.experience.forEach((item) => {
    const article = document.createElement("article");
    article.className = "timeline-item";
    article.innerHTML = `
      <time></time>
      <div>
        <h3></h3>
        <p></p>
      </div>
    `;
    article.querySelector("time").textContent = item.period;
    article.querySelector("h3").textContent = item.title;
    article.querySelector("p").textContent = item.description;
    list.append(article);
  });
}

function renderProjects() {
  const list = document.querySelector("#projectList");
  list.innerHTML = "";
  profile.projects.forEach((item) => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.innerHTML = `
      <div>
        <h3></h3>
        <p></p>
      </div>
      <a target="_blank" rel="noreferrer">查看详情</a>
    `;
    article.querySelector("h3").textContent = item.title;
    article.querySelector("p").textContent = item.description;
    const link = article.querySelector("a");
    link.href = text(item.link, "#");
    if (!text(item.link) || item.link === "#") {
      link.removeAttribute("target");
      link.textContent = "待添加链接";
    }
    list.append(article);
  });
}

function fillForm() {
  const values = {
    ...profile,
    images: profile.images.join("\n"),
    experience: profile.experience
      .map((item) => `${item.period} | ${item.title} | ${item.description}`)
      .join("\n"),
    projects: profile.projects
      .map((item) => `${item.title} | ${item.description} | ${item.link}`)
      .join("\n")
  };

  [...form.elements].forEach((element) => {
    if (element.name && Object.prototype.hasOwnProperty.call(values, element.name)) {
      element.value = values[element.name] || "";
    }
  });
}

function parseImages(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseExperience(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [period = "时间", title = "经历", description = "补充经历说明"] = line
        .split("|")
        .map((part) => part.trim());
      return { period, title, description };
    });
}

function parseProjects(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "项目", description = "补充项目说明", link = "#"] = line
        .split("|")
        .map((part) => part.trim());
      return { title, description, link };
    });
}

function profileFromForm() {
  const data = new FormData(form);
  const nextProfile = {
    ...profile,
    siteTitle: text(data.get("siteTitle"), defaultProfile.siteTitle),
    name: text(data.get("name"), defaultProfile.name),
    images: parseImages(String(data.get("images") || "")),
    tagline: text(data.get("tagline"), defaultProfile.tagline),
    role: text(data.get("role"), defaultProfile.role),
    location: text(data.get("location"), defaultProfile.location),
    intro: text(data.get("intro"), defaultProfile.intro),
    about: text(data.get("about"), defaultProfile.about),
    email: text(data.get("email"), defaultProfile.email),
    phone: text(data.get("phone"), defaultProfile.phone),
    social: text(data.get("social"), "#"),
    resume: text(data.get("resume"), "#"),
    contactNote: text(data.get("contactNote"), defaultProfile.contactNote),
    experience: parseExperience(String(data.get("experience") || "")),
    projects: parseProjects(String(data.get("projects") || ""))
  };
  nextProfile.initials = initialsFromName(nextProfile.name);
  return nextProfile;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function openEditor() {
  editor.hidden = false;
  fillForm();
  form.elements.name.focus();
}

function closeEditor() {
  editor.hidden = true;
}

function configureEditMode() {
  const isPublicPage = window.location.protocol === "http:" || window.location.protocol === "https:";

  if (isPublicPage) {
    document.body.classList.add("public-mode");
    editToggle.hidden = true;
    editToggle.setAttribute("aria-hidden", "true");
  }
}

function setupPageMotion() {
  const sections = document.querySelectorAll(".section");
  const navLinks = [...document.querySelectorAll(".nav a")];

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.16 }
  );

  sections.forEach((section) => revealObserver.observe(section));

  const navObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visibleEntry.target.id}`);
      });
    },
    {
      rootMargin: "-35% 0px -52% 0px",
      threshold: [0.1, 0.25, 0.5]
    }
  );

  document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));
}

function downloadCurrentSite() {
  const html = document.documentElement.outerHTML.replace(
    "window.siteProfile = null;",
    `window.siteProfile = ${JSON.stringify(profile, null, 2)};`
  );
  const blob = new Blob([`<!doctype html>\n${html}`], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "index.html";
  link.click();
  URL.revokeObjectURL(url);
  showToast("已导出 index.html，可用于发布。");
}

editToggle.addEventListener("click", openEditor);
document.querySelector("#closeEditor").addEventListener("click", closeEditor);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveProfile(profileFromForm());
  showToast("已保存到当前浏览器并更新预览。");
});

document.querySelector("#resetProfile").addEventListener("click", () => {
  localStorage.removeItem(storageKey);
  profile = defaultProfile;
  imageIndex = 0;
  renderProfile();
  fillForm();
  showToast("已恢复示例内容。");
});

document.querySelector("#downloadSite").addEventListener("click", () => {
  saveProfile(profileFromForm());
  downloadCurrentSite();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !editor.hidden) {
    closeEditor();
  }
});

configureEditMode();
setupPageMotion();
renderProfile();
fillForm();
