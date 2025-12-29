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
  {% if recipe.tags.size > 0 %}
  <p>Tags: {% for tag in recipe.tags %} <a href="/tags/{{ tag | slugify: "raw" }}">{{ tag }}</a>{% unless forloop.last %}, {% endunless %} {% endfor %}</p>
  {% endif %}
  <p>{{ recipe.excerpt | markdownify }}</p>
{% endfor %}