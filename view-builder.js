// view-builder.js



// Build Visual View
function buildVisualView() {
  const grid = document.querySelector('.project-grid');
  grid.innerHTML = ''; // Clear existing
  
  // Sort by year (newest first) for visual view
  const sortedProjects = [...projects].sort((a, b) => b.id - a.id);
  
  sortedProjects.forEach(project => {
  // Derive link from slug; skip rendering tile if no slug
  if (!project.slug) return;
  const projectUrl = `/projects/${project.slug}/`;

  // Check if project has video
  const media = project.video 
    ? `<video autoplay muted loop playsinline>
         <source src="${project.video}" type="video/mp4">
         <img src="${project.image}" alt="${project.title}">  <!-- fallback -->
       </video>`
    : `<img src="${project.image}" alt="${project.title}">`;
    
  grid.innerHTML += `
    <div class="project-item" data-num="${project.id}">
      <a href="${projectUrl}" class="no-underline">
        ${media}
        <div class="project-meta" style="display:flex;align-items:flex-start;gap:0.5rem;margin-top:0.5rem;">
          <span class="project-number">(${project.id})</span>
          <span class="project-title">${project.title}</span>
        </div>
      </a>
    </div>
  `;
});

}

function projectLink(id) {
  const project = projects.find(p => p.id === id);
  if (!project || !project.slug) return `<span class="project-number">(<span class="project-number-label">${id}</span>)</span>`;
  return `<a href="/projects/${project.slug}/" class="project-number">(<span class="project-number-label">${id}</span>)</a>`;
}


// Build Index View
function buildIndexView() {
  const indexContent = document.querySelector('.index-content');
  let html = '';
  
  // Group by category/discipline - handle both single and array categories
    const byCategory = {};
    projects.forEach(project => {
    if (project.category) {
    
        // Check if category is an array or single value
    const categories = Array.isArray(project.category) 
      ? project.category 
      : [project.category]; // Make single values into array
    
    // Add project to each category it belongs to
    categories.forEach(cat => {
      if (!byCategory[cat]) {
        byCategory[cat] = [];
      }
      byCategory[cat].push(project.id);
    });
  }
});
  
  // Sort categories alphabetically
  const sortedCategories = Object.keys(byCategory).sort();
  
  if (sortedCategories.length > 0) {
    html += '<h2 class="label font-alt">by Discipline</h2>';
    sortedCategories.forEach(cat => {
      const catAnchor = `discipline-${cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`;
      html += `
        <div id="${catAnchor}">
          <span class="category-label">${cat}:</span>
          ${byCategory[cat].map(id => projectLink(id)).join(', ')}
        </div>
      `;
    });
  }


  // Group by year - dynamically collect all years
  const byYear = {};
  projects.forEach(project => {
    if (project.year) {
      if (!byYear[project.year]) {
        byYear[project.year] = [];
      }
      byYear[project.year].push(project.id);
    }
  });
  
  // Sort years in reverse order (newest first)
  const sortedYears = Object.keys(byYear).sort((a, b) => b - a);
  
  if (sortedYears.length > 0) {
    html += '<h2 class="label font-alt">by Year</h2>';
    sortedYears.forEach(year => {
      html += `
        <div id="year-${year}">
          <span class="category-label">${year}:</span>
          ${byYear[year].map(id => projectLink(id)).join(', ')}
        </div>
      `;
    });
  }

  // Group by tags section
  const byTag = {};
  projects.forEach(project => {
    if (project.tags && Array.isArray(project.tags)) {
      project.tags.forEach(tag => {
        if (!byTag[tag]) {
          byTag[tag] = [];
        }
        byTag[tag].push(project.id);
      });
    }
  });

  // Sort tags alphabetically
  const sortedTags = Object.keys(byTag).sort();

  if (sortedTags.length > 0) {
    html += '<h2 class="label font-alt">by Tags</h2>';
    html += '<div class="tags-container">'; // Wrap all tags in one container
    
    sortedTags.forEach((tag, index) => {
      const tagAnchor = `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`;
      html += `<span class="tag-group" id="${tagAnchor}">${tag}: `;
      html += byTag[tag].map(id => projectLink(id)).join(', ');
      if (index < sortedTags.length - 1) {
        html += ' ';
      }
      html += '</span>';
    });
    
    html += '</div>';
  }

  // ADD THIS LINE - you were missing the innerHTML assignment!
  indexContent.innerHTML = html;
} // This closing brace was also missing

document.addEventListener('DOMContentLoaded', function() {
  // Only build the visual grid if its container exists (homepage only)
  if (document.querySelector('.project-grid')) {
    buildVisualView();
  }
  // Only build the index if its container exists (homepage or about page)
  if (document.querySelector('.index-content')) {
    buildIndexView();
  }
});