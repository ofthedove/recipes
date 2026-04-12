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

<style>
  #recipe-filters { margin-bottom: 1.5em; }
  #recipe-search { width: 100%; max-width: 400px; padding: 0.3em 0.5em; margin-bottom: 0.75em; font-size: 1em; }
  .filter-group { margin-bottom: 0.5em; }
  .filter-btn { margin: 0.15em 0.25em 0.15em 0; padding: 0.2em 0.6em; cursor: pointer; background: none; border: 1px solid #424242; border-radius: 3px; font-size: 0.9em; }
  .filter-btn.active { color: #fff; background-color: #424242; }
  #no-results { display: none; }
</style>

## Full List

<div id="recipe-list">
{% for recipe in site.recipes %}
  <div class="recipe-item"
    data-title="{{ recipe.title | downcase | escape }}"
    data-excerpt="{{ recipe.excerpt | markdownify | strip_html | downcase | strip | escape }}"
    data-occasion="{% for o in recipe.occasion %}{{ o }}|{% endfor %}"
    data-course="{% for c in recipe.course %}{{ c }}|{% endfor %}">
    <h3>
      <a href="{{ recipe.url | relative_url }}">
        {{ recipe.title }}
      </a>
    </h3>
    {% if recipe.tags.size > 0 %}
    <p>Tags: {% for tag in recipe.tags %} <a href="/tags/{{ tag | slugify: "raw" }}">{{ tag }}</a>{% unless forloop.last %}, {% endunless %} {% endfor %}</p>
    {% endif %}
    <p>{{ recipe.excerpt | markdownify }}</p>
  </div>
{% endfor %}
</div>

<p id="no-results">No recipes match your filters.</p>

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