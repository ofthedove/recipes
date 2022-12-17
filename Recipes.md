---
layout: page
title: Recipes
permalink: /recipes/
---

{% for recipe in site.recipes %}
  <h2>
    <a href="{{ recipe.url | relative_url }}">
      {{ recipe.name }}
    </a>
  </h2>
  <p>{{ recipe.content | markdownify }}</p>
{% endfor %}