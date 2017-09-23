(() => {
  const s1 = (s, context) => (document || context).querySelector(s);
  const s = (s, context) => (document || context).querySelectorAll(s);
  const c = (t, context) => (document || context).createElement(t);

  const m = new Markdown(s1('markdown'));
  m.init();
})();
