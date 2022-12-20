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
  <p>{{ recipe.excerpt | markdownify }}</p>
{% endfor %}