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

<script src="{{ '/assets/js/recipe-filters.js' | relative_url }}"></script>
