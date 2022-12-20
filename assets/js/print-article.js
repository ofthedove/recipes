function printArticle() {
   const articles = document.getElementsByTagName('article');
   if (articles.length > 0) {
      const article = articles.item(0);
      const content = article.innerHTML;

      let w = window.open();
      w.document.write(content);
      w.print();
      w.close();
   }
}