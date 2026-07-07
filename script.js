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
    "images/me-10.jpg"
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
  intelLabel: "LAST UPDATE",
  intelText: "最后更新时间：2026-07-08 01:43:42",
  profileStatus: "照片墙、行动面板、经历与作品持续更新中。",
  deck: [
    {
      title: "战术身份",
      description: "偏好清晰计划、稳定推进，也喜欢在复杂问题里寻找漂亮的解法。"
    },
    {
      title: "兴趣坐标",
      description: "游戏、技术、影像与审美表达，是我用来观察世界的几条主线。"
    },
    {
      title: "当前任务",
      description: "把学习、作品和个人表达整理成一个持续更新的公开空间。"
    }
  ],
  signalTitle: "我的个性信号",
  signalText: "这个网站不是一张静态名片，而是一块可以持续更新的终端屏幕：记录我的成长、作品、兴趣和正在靠近的目标。",
  signalTags: ["FOCUS", "TACTIC", "CREATE", "EXPLORE", "LOGIC", "STYLE"],
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
  blog: [
    {
      title: "最近在想的事",
      description: "记录一段近期思考、学习笔记、游戏体验或生活片段。",
      link: "#"
    },
    {
      title: "游戏与审美",
      description: "聊聊我喜欢的游戏、角色、世界观，以及它们带给我的灵感。",
      link: "#"
    },
    {
      title: "学习记录",
      description: "整理我正在学习的内容、踩过的坑，以及值得留下来的方法。",
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
const bootScreen = document.querySelector("#bootScreen");
const bootPercent = document.querySelector("#bootPercent");
const bootProgressBar = document.querySelector("#bootProgressBar");
const sectionIndex = document.querySelector("#sectionIndex");
const sectionTotal = document.querySelector("#sectionTotal");

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

  if (!Array.isArray(nextProfile.deck)) {
    nextProfile.deck = defaultProfile.deck;
  }

  if (!Array.isArray(nextProfile.signalTags)) {
    nextProfile.signalTags = defaultProfile.signalTags;
  }

  if (!Array.isArray(nextProfile.blog)) {
    nextProfile.blog = Array.isArray(nextProfile.projects)
      ? nextProfile.projects
      : defaultProfile.blog;
  }

  if (nextProfile.avatar && !nextProfile.images.length) {
    nextProfile.images = [nextProfile.avatar];
  }

  nextProfile.images = nextProfile.images.map((url) => text(url)).filter(Boolean);
  nextProfile.deck = nextProfile.deck.filter((item) => item && text(item.title));
  nextProfile.signalTags = nextProfile.signalTags.map((tag) => text(tag)).filter(Boolean);
  nextProfile.blog = nextProfile.blog.filter((item) => item && text(item.title));
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
  setText("intelLabel", text(profile.intelLabel, defaultProfile.intelLabel));
  setText("intelText", text(profile.intelText, defaultProfile.intelText));
  setText("profileStatus", text(profile.profileStatus, defaultProfile.profileStatus));
  setText("signalTitle", text(profile.signalTitle, defaultProfile.signalTitle));
  setText("signalText", text(profile.signalText, defaultProfile.signalText));

  renderPortrait();
  renderContactLinks();
  renderDeck();
  renderSignalTags();
  renderExperience();
  renderBlog();
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
  socialLink.href = normalizeLink(profile.social);
  socialLink.style.display = text(profile.social) && profile.social !== "#" ? "inline-flex" : "none";

  const resumeLink = document.querySelector("#resumeLink");
  resumeLink.href = normalizeLink(profile.resume);
  resumeLink.style.display = text(profile.resume) && profile.resume !== "#" ? "inline-flex" : "none";
}

function normalizeLink(value) {
  const link = text(value, "#");
  if (!link || link === "#") {
    return "#";
  }

  if (/^(https?:|mailto:|tel:)/i.test(link)) {
    return link;
  }

  return `https://${link}`;
}

function renderDeck() {
  const grid = document.querySelector(".deck-grid");
  const items = profile.deck.length ? profile.deck : defaultProfile.deck;
  grid.innerHTML = "";

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "deck-card";
    card.innerHTML = `
      <span></span>
      <h3></h3>
      <p></p>
    `;
    card.querySelector("span").textContent = String(index + 1).padStart(2, "0");
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    grid.append(card);
  });
}

function renderSignalTags() {
  const grid = document.querySelector(".signal-grid");
  const tags = profile.signalTags.length ? profile.signalTags : defaultProfile.signalTags;
  grid.innerHTML = "";

  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    grid.append(span);
  });
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

function renderBlog() {
  const list = document.querySelector("#blogList");
  list.innerHTML = "";
  profile.blog.forEach((item) => {
    const article = document.createElement("article");
    article.className = "blog-card";
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
      link.textContent = "阅读全文";
    }
    list.append(article);
  });
}

function fillForm() {
  const values = {
    ...profile,
    images: profile.images.join("\n"),
    deck: profile.deck.map((item) => `${item.title} | ${item.description}`).join("\n"),
    signalTags: profile.signalTags.join("\n"),
    experience: profile.experience
      .map((item) => `${item.period} | ${item.title} | ${item.description}`)
      .join("\n"),
    blog: profile.blog
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

function parseDeck(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "标题", description = "补充说明"] = line
        .split("|")
        .map((part) => part.trim());
      return { title, description };
    });
}

function parseTags(value) {
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

function parseBlog(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "日志", description = "补充日志内容", link = "#"] = line
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
    intelLabel: text(data.get("intelLabel"), defaultProfile.intelLabel),
    intelText: text(data.get("intelText"), defaultProfile.intelText),
    profileStatus: text(data.get("profileStatus"), defaultProfile.profileStatus),
    deck: parseDeck(String(data.get("deck") || "")),
    signalTitle: text(data.get("signalTitle"), defaultProfile.signalTitle),
    signalText: text(data.get("signalText"), defaultProfile.signalText),
    signalTags: parseTags(String(data.get("signalTags") || "")),
    experience: parseExperience(String(data.get("experience") || "")),
    blog: parseBlog(String(data.get("blog") || ""))
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
  const indexedSections = [...document.querySelectorAll("section")];
  const navTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sectionTotal) {
    sectionTotal.textContent = `// 00 / ${String(indexedSections.length).padStart(2, "0")}`;
  }

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

      const currentIndex = indexedSections.indexOf(visibleEntry.target) + 1;
      if (sectionIndex && currentIndex > 0) {
        sectionIndex.textContent = String(currentIndex).padStart(2, "0");
      }
    },
    {
      rootMargin: "-35% 0px -52% 0px",
      threshold: [0.1, 0.25, 0.5]
    }
  );

  document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

  function setActiveNav(targetId) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${targetId}`);
    });
  }

  function updateActiveNav() {
    const isPageBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

    if (isPageBottom) {
      setActiveNav("contact");
      if (sectionIndex) {
        sectionIndex.textContent = String(indexedSections.length).padStart(2, "0");
      }
      return;
    }

    const current = [...navTargets]
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= 150);

    if (current) {
      setActiveNav(current.id);
    }
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.getAttribute("href").replace("#", "");
      window.setTimeout(() => setActiveNav(targetId), 120);
    });
  });

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();
}

function runBootSequence() {
  if (!bootScreen || !bootPercent) {
    return;
  }

  let progress = 0;
  const timer = window.setInterval(() => {
    progress += 17;
    const visibleProgress = Math.min(progress, 100);
    bootPercent.textContent = `${visibleProgress}%`;
    if (bootProgressBar) {
      bootProgressBar.style.width = `${visibleProgress}%`;
    }

    if (progress >= 100) {
      window.clearInterval(timer);
      window.setTimeout(() => bootScreen.classList.add("is-hidden"), 220);
    }
  }, 48);
}

function buildCleanExportHtml() {
  const clone = document.documentElement.cloneNode(true);

  clone.querySelector("#editor")?.setAttribute("hidden", "");
  clone.querySelector("#editToggle")?.setAttribute("hidden", "");
  clone.querySelector("body")?.classList.add("public-mode");
  clone.querySelector("#toast")?.classList.remove("show");
  clone.querySelectorAll(".portrait-window").forEach((node) => node.remove());

  const clonedPortrait = clone.querySelector("#portraitPreview");
  if (clonedPortrait) {
    clonedPortrait.className = "portrait";
    clonedPortrait.removeAttribute("style");
  }

  const clonedDots = clone.querySelector("#imageDots");
  if (clonedDots) {
    clonedDots.innerHTML = "";
    clonedDots.removeAttribute("hidden");
  }

  clone.querySelector("#bootScreen")?.classList.remove("is-hidden");

  return clone.outerHTML.replace(
    "window.siteProfile = null;",
    `window.siteProfile = ${JSON.stringify(profile, null, 2)};`
  );
}

function downloadCurrentSite() {
  const html = buildCleanExportHtml();
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
runBootSequence();
renderProfile();
fillForm();
