// project-builder.js
// Renders a single project detail page based on the URL slug

function getProjectSlug() {
  const pathMatch = window.location.pathname.match(/\/projects\/([^/]+)\/?$/);
  if (pathMatch) return pathMatch[1];

  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderNotFound(slug) {
  const main = document.querySelector('.main-container');
  main.innerHTML = `
    <div class="about-panel">
      <a href="index.html" class="back-link">(Back to all projects)</a>
      <h1>Project not found</h1>
      <p>No project matching "${slug || 'this URL'}" exists.</p>
    </div>
  `;
}

function formatGallery(rawGallery, fallbackImage) {
  // Normalize gallery — accept arrays of strings OR arrays of objects
  if (!rawGallery || !rawGallery.length) {
    return fallbackImage ? [{ src: fallbackImage, caption: '' }] : [];
  }
  return rawGallery.map(item =>
  typeof item === 'string'
    ? { src: item, caption: '' }
    : { src: item.src, video: item.video || null, caption: item.caption || '' }
  );
}

const numberWords = [
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen', 'twenty'
];

function wordForIndex(i) {
  return numberWords[i] || (i + 1);
}

function renderProject(project) {
  // Title + number
  document.title = `${project.title} — Emma Sato`;
  document.getElementById('project-number').textContent = `(${project.id})`;
  document.getElementById('project-title').textContent = project.title.toUpperCase();

  // Description (supports paragraphs via \n\n, first-line indent via CSS)
  const descEl = document.getElementById('project-description');
  if (project.description) {
    descEl.innerHTML = project.description
      .split(/\n\n+/)
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  } else {
    document.getElementById('project-description-section').style.display = 'none';
  }

  // Helper to slugify for anchor links (matches view-builder.js logic)
function toAnchor(prefix, value) {
  const slug = String(value).toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
  return `${prefix}-${slug}`;
}

// Discipline — link each category to its anchor on home
const categories = Array.isArray(project.category)
  ? project.category
  : (project.category ? [project.category] : []);

if (categories.length) {
  const catLinks = categories.map(c =>
    `<a href="/#${toAnchor('discipline', c)}">(${c})</a>`
  ).join(', ');
  document.getElementById('meta-discipline').innerHTML = `Discipline: ${catLinks}`;
} else {
  document.getElementById('meta-discipline').style.display = 'none';
}

// Year — link to year anchor on home
if (project.year) {
  document.getElementById('meta-year').innerHTML =
    `Year: <a href="/#year-${project.year}">(${project.year})</a>`;
} else {
  document.getElementById('meta-year').style.display = 'none';
}

  const tagsEl = document.getElementById('meta-tags');
  if (project.tags && project.tags.length) {
    // Build tags as linked spans
    tagsEl.innerHTML = 'Tags: ' + project.tags.map(tag => {
      const anchor = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
      return `<a href="/#${anchor}">(${tag})</a>`;
    }).join(', ');
  } else {
    tagsEl.style.display = 'none';
  }

  // Gallery
  const gallery = formatGallery(project.gallery, project.image);
  const imgEl = document.getElementById('gallery-image');
  const navEl = document.getElementById('gallery-nav');
  const captionSection = document.getElementById('image-caption-section');
  const captionLabelEl = document.getElementById('caption-image-label');
  const captionTextEl = document.getElementById('image-caption');

  if (gallery.length === 0) {
    document.getElementById('project-gallery').style.display = 'none';
    captionSection.style.display = 'none';
    return;
  }

  let currentIndex = 0;

  const videoEl = document.getElementById('gallery-video');

function render() {
  const current = gallery[currentIndex];

  // Swap between video and image based on whether the item has a video
  if (current.video) {
    videoEl.src = current.video;
    videoEl.style.display = '';
    imgEl.style.display = 'none';
    videoEl.play().catch(() => { /* autoplay may be blocked; that's fine */ });
  } else {
    imgEl.src = current.src;
    imgEl.alt = `${project.title} — image ${currentIndex + 1}`;
    imgEl.style.display = '';
    videoEl.style.display = 'none';
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }

  // Caption
  if (current.caption && current.caption.trim()) {
  captionSection.style.display = '';
  captionLabelEl.textContent = `(${wordForIndex(currentIndex)})`;
  captionTextEl.innerHTML = current.caption
    .split(/\n\n+/)
    .map(p => `<p>${p.trim()}</p>`)
    .join('');
  } else {
    captionSection.style.display = 'none';
  }

  // Active state on thumbnails
  thumbsEl.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === currentIndex);
  });
}

// Build gallery thumbnails
const thumbsEl = document.getElementById('gallery-thumbs');
if (gallery.length > 1) {
  gallery.forEach((item, i) => {
    const thumb = document.createElement('button');
    thumb.className = 'gallery-thumb';
    thumb.setAttribute('aria-label', `Show image ${i + 1}`);
    
    const thumbImg = document.createElement('img');
    thumbImg.src = item.src;
    thumbImg.alt = '';
    thumb.appendChild(thumbImg);
    
    thumb.addEventListener('click', () => {
      currentIndex = i;
      render();
    });
    
    thumbsEl.appendChild(thumb);
  });
} else {
  thumbsEl.style.display = 'none';
}

  // Build the stacked mobile gallery
const stackEl = document.getElementById('gallery-stack');
gallery.forEach((item, i) => {
  const figure = document.createElement('figure');
  figure.className = 'stack-item';

  let media;
    if (item.video) {
      media = document.createElement('video');
      media.src = item.video;
      media.autoplay = true;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
    } else {
      media = document.createElement('img');
      media.src = item.src;
      media.alt = `${project.title} — image ${i + 1}`;
    }
    figure.appendChild(media);

  if (item.caption && item.caption.trim()) {
    const caption = document.createElement('figcaption');
    caption.className = 'stack-caption';
    const label = document.createElement('p');
    label.textContent = `About image (${wordForIndex(i)})`;
    const text = document.createElement('div');
    text.innerHTML = item.caption
      .split(/\n\n+/)
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
    caption.appendChild(label);
    caption.appendChild(text);
    figure.appendChild(caption);
  }

  stackEl.appendChild(figure);
});

  // Hotzones over the image
  const prevHotzone = document.getElementById('gallery-hotzone-prev');
  const nextHotzone = document.getElementById('gallery-hotzone-next');

  if (gallery.length > 1) {
    prevHotzone.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
      render();
    });
    nextHotzone.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % gallery.length;
      render();
    });

    // Arrow follows cursor
    function setupCursorFollow(hotzone) {
      const arrow = hotzone.querySelector('.gallery-hotzone-arrow');
      hotzone.addEventListener('mousemove', (e) => {
        const rect = hotzone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        arrow.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
    setupCursorFollow(prevHotzone);
    setupCursorFollow(nextHotzone);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        render();
      }
      if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % gallery.length;
        render();
      }
    });
  } else {
    prevHotzone.style.display = 'none';
    nextHotzone.style.display = 'none';
  }

  render();
}

// Init
const slug = getProjectSlug();
if (!slug) {
  renderNotFound(null);
} else {
  const project = projects.find(p => p.slug === slug);
  if (!project) {
    renderNotFound(slug);
  } else {
    renderProject(project);
  }
}