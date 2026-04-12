---
layout: page
title: Recipes
permalink: /recipes/
---

<div id="recipe-filters">
  <input type="search" id="recipe-search" placeholder="Search recipes…" aria-label="Search recipes">

  <div class="filter-group">
    <strong>Occasion:</strong>
    <button class="filter-btn active" data-filter-type="occasion" data-value="">All</button>
    <button class="filter-btn" data-filter-type="occasion" data-value="Everyday/Other">Everyday/Other</button>
    <button class="filter-btn" data-filter-type="occasion" data-value="Christmas">Christmas</button>
    <button class="filter-btn" data-filter-type="occasion" data-value="Thanksgiving">Thanksgiving</button>
    <button class="filter-btn" data-filter-type="occasion" data-value="Easter">Easter</button>
    <button class="filter-btn" data-filter-type="occasion" data-value="New Years/Super Bowl/Party">New Year's/Super Bowl/Party</button>
  </div>

  <div class="filter-group">
    <strong>Course:</strong>
    <button class="filter-btn active" data-filter-type="course" data-value="">All</button>
    <button class="filter-btn" data-filter-type="course" data-value="Entree">Entree</button>
    <button class="filter-btn" data-filter-type="course" data-value="Side">Side</button>
    <button class="filter-btn" data-filter-type="course" data-value="Appetizer/Snack">Appetizer/Snack</button>
    <button class="filter-btn" data-filter-type="course" data-value="Breakfast">Breakfast</button>
    <button class="filter-btn" data-filter-type="course" data-value="Dessert">Dessert</button>
  </div>
</div>

## Full List

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
    {% assign all_meta = recipe.occasions | concat: recipe.courses %}
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
  var activeOccasion = '';
  var activeCourse = '';

  function applyFilters() {
    var query = searchInput.value.toLowerCase().trim();
    var visible = 0;
    items.forEach(function (item) {
      var titleMatch = !query || item.dataset.title.indexOf(query) !== -1;
      var excerptMatch = !query || item.dataset.excerpt.indexOf(query) !== -1;
      var occasionMatch = !activeOccasion || item.dataset.occasion.indexOf(activeOccasion + '|') !== -1;
      var courseMatch = !activeCourse || item.dataset.course.indexOf(activeCourse + '|') !== -1;
      var show = (titleMatch || excerptMatch) && occasionMatch && courseMatch;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    noResults.style.display = visible === 0 ? '' : 'none';
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
})();
</script>