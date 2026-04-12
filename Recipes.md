---
layout: page
title: Recipes
permalink: /recipes/
---

## Full List

{% for recipe in site.recipes %}
  <h3>
    <a href="{{ recipe.url | relative_url }}">
      {{ recipe.title }}
    </a>
  </h3>
  {% if recipe.occasions.size > 0 %}
  <p>Occasions: {% for occasion in recipe.occasions %} <a href="/occasions/{{ occasion | slugify: "raw" }}">{{ occasion }}</a>{% unless forloop.last %}, {% endunless %} {% endfor %}</p>
  {% endif %}
  {% if recipe.courses.size > 0 %}
  <p>Courses: {% for course in recipe.courses %} <a href="/courses/{{ course | slugify: "raw" }}">{{ course }}</a>{% unless forloop.last %}, {% endunless %} {% endfor %}</p>
  {% endif %}
  {% if recipe.tags.size > 0 %}
  <p>Tags: {% for tag in recipe.tags %} <a href="/tags/{{ tag | slugify: "raw" }}">{{ tag }}</a>{% unless forloop.last %}, {% endunless %} {% endfor %}</p>
  {% endif %}
  <p>{{ recipe.excerpt | markdownify }}</p>
{% endfor %}
