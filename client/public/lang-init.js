// Runs before first paint: apply the saved (or browser) language + direction to avoid an RTL flash.
try {
  var l = localStorage.getItem('masar-lang');
  if (!l) l = (navigator.language || '').slice(0, 2) === 'ar' ? 'ar' : 'en';
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
} catch (e) {}
