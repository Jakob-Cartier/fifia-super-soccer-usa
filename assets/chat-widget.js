// Tawk.to live support chat widget for the USA National Team website.
// The same shared file is loaded on every page.

var Tawk_API = Tawk_API || {};
var Tawk_LoadStart = new Date();

(function () {
  var s1 = document.createElement("script");
  var s0 = document.getElementsByTagName("script")[0];

  s1.async = true;
  s1.src = "https://embed.tawk.to/6af1d804c28c583c4084fb82/1k70b7k8n";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");

  if (s0 && s0.parentNode) {
    s0.parentNode.insertBefore(s1, s0);
  } else {
    document.head.appendChild(s1);
  }
})();
