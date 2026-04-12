---
layout: page
title: Recipes
permalink: /recipes/
---

{% assign _empty = "" | split: "" %}
{% assign all_occasions = _empty %}
{% assign all_courses = _empty %}
{% for recipe in site.recipes %}
  {% assign _occ = recipe.occasions | default: _empty %}
  {% for o in _occ %}
    {% unless all_occasions contains o %}
      {% assign all_occasions = all_occasions | push: o %}
    {% endunless %}
  {% endfor %}
  {% assign _crs = recipe.courses | default: _empty %}
  {% for c in _crs %}
    {% unless all_courses contains c %}
      {% assign all_courses = all_courses | push: c %}
    {% endunless %}
  {% endfor %}
{% endfor %}
{% assign all_occasions = all_occasions | sort %}
{% assign all_courses = all_courses | sort %}

<div id="recipe-filters">
  <input type="search" id="recipe-search" placeholder="Search recipes…" aria-label="Search recipes">

  <div class="filter-group">
    <strong>Occasion:</strong>
    <button class="filter-btn active" data-filter-type="occasion" data-value="">All</button>
    {% for occasion in all_occasions %}<button class="filter-btn" data-filter-type="occasion" data-value="{{ occasion | escape }}">{{ occasion | replace: "-", " " }}</button>
    {% endfor %}
  </div>

  <div class="filter-group">
    <strong>Course:</strong>
    <button class="filter-btn active" data-filter-type="course" data-value="">All</button>
    {% for course in all_courses %}<button class="filter-btn" data-filter-type="course" data-value="{{ course | escape }}">{{ course | replace: "-", " " }}</button>
    {% endfor %}
  </div>
</div>

## <span id="list-heading">Full List</span>

<div id="recipe-list">
{% for recipe in site.recipes %}
  <div class="recipe-item"
    data-title="{{ recipe.title | downcase | escape }}"
    data-excerpt="{{ recipe.excerpt | markdownify | strip_html | downcase | strip | escape }}"
    data-occasion="{% for o in recipe.occasions %}{{ o }}|{% endfor %}"
    data-course="{% for c in recipe.courses %}{{ c }}|{% endfor %}">
    <h3>
      <a href="{{ recipe.url | relative_url }}">
        {{ recipe.title }}
      </a>
    </h3>
    {% assign _empty = "" | split: "" %}
    {% assign _occasions = recipe.occasions | default: _empty %}
    {% assign _courses = recipe.courses | default: _empty %}
    {% assign all_meta = _occasions | concat: _courses %}
    {% if all_meta.size > 0 %}
    <div class="meta-chips">{% for item in all_meta %}<span class="meta-chip">{{ item }}</span>{% endfor %}</div>
    {% endif %}
    <p>{{ recipe.excerpt | markdownify }}</p>
  </div>
{% endfor %}
</div>

<p id="no-results" style="display:none">No recipes match your filters.</p>

<script>
(function () {
  var searchInput = document.getElementById('recipe-search');
  var items = Array.from(document.querySelectorAll('.recipe-item'));
  var noResults = document.getElementById('no-results');
  var listHeading = document.getElementById('list-heading');
  var activeOccasion = '';
  var activeCourse = '';

  // Stash original label text on each button before any counts are appended
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.dataset.label = btn.textContent;
  });

  function itemMatchesSearch(item, query) {
    if (!query) return true;
    return item.dataset.title.indexOf(query) !== -1 ||
           item.dataset.excerpt.indexOf(query) !== -1;
  }

  function itemMatchesOccasion(item, occasion) {
    return !occasion || item.dataset.occasion.indexOf(occasion + '|') !== -1;
  }

  function itemMatchesCourse(item, course) {
    return !course || item.dataset.course.indexOf(course + '|') !== -1;
  }

  // --- URL state ---

  function updateURL() {
    var params = new URLSearchParams(window.location.search);
    var q = searchInput.value.trim();
    if (q) { params.set('q', q); } else { params.delete('q'); }
    if (activeOccasion) { params.set('occasion', activeOccasion); } else { params.delete('occasion'); }
    if (activeCourse) { params.set('course', activeCourse); } else { params.delete('course'); }
    history.replaceState(null, '', params.toString() ? window.location.pathname + '?' + params.toString() : window.location.pathname);
  }

  function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var occasion = params.get('occasion') || '';
    var course = params.get('course') || '';

    if (q) searchInput.value = q;

    if (occasion) {
      var occBtn = document.querySelector('.filter-btn[data-filter-type="occasion"][data-value="' + occasion + '"]');
      if (occBtn) {
        document.querySelectorAll('.filter-btn[data-filter-type="occasion"]').forEach(function (b) { b.classList.remove('active'); });
        occBtn.classList.add('active');
        activeOccasion = occasion;
      }
    }

    if (course) {
      var crsBtn = document.querySelector('.filter-btn[data-filter-type="course"][data-value="' + course + '"]');
      if (crsBtn) {
        document.querySelectorAll('.filter-btn[data-filter-type="course"]').forEach(function (b) { b.classList.remove('active'); });
        crsBtn.classList.add('active');
        activeCourse = course;
      }
    }
  }

  // --- Filter logic ---

  function updateFilterCounts() {
    var query = searchInput.value.toLowerCase().trim();

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      var type = btn.dataset.filterType;
      var value = btn.dataset.value;
      var count;

      if (type === 'occasion') {
        // Count items that match: search + active course + this occasion value
        count = items.filter(function (item) {
          return itemMatchesSearch(item, query) &&
                 itemMatchesCourse(item, activeCourse) &&
                 itemMatchesOccasion(item, value);
        }).length;
      } else {
        // type === 'course'
        // Count items that match: search + active occasion + this course value
        count = items.filter(function (item) {
          return itemMatchesSearch(item, query) &&
                 itemMatchesOccasion(item, activeOccasion) &&
                 itemMatchesCourse(item, value);
        }).length;
      }

      btn.textContent = btn.dataset.label + ' (' + count + ')';
    });
  }

  function updateHeading(visible) {
    var hasSearch = searchInput.value.trim().length > 0;
    var hasFilter = activeOccasion || activeCourse;
    var label;
    if (hasSearch) {
      label = 'Search Results';
    } else if (hasFilter) {
      label = 'Filtered List';
    } else {
      label = 'Full List';
    }
    listHeading.textContent = label + ' (' + visible + ')';
  }

  function applyFilters() {
    var query = searchInput.value.toLowerCase().trim();
    var visible = 0;
    items.forEach(function (item) {
      var show = itemMatchesSearch(item, query) &&
                 itemMatchesOccasion(item, activeOccasion) &&
                 itemMatchesCourse(item, activeCourse);
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    noResults.style.display = visible === 0 ? '' : 'none';
    updateHeading(visible);
    updateFilterCounts();
    updateURL();
  }

  searchInput.addEventListener('input', applyFilters);

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.dataset.filterType;
      var value = btn.dataset.value;
      document.querySelectorAll('.filter-btn[data-filter-type="' + type + '"]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      if (type === 'occasion') activeOccasion = value;
      if (type === 'course') activeCourse = value;
      applyFilters();
    });
  });

  // Restore state from URL, then apply
  loadFromURL();
  applyFilters();
})();
</script>
