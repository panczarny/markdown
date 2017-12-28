(() => {
  const s1 = (sel, context) => s(sel, context)[0];
  const s = (sel, context) => Array.from((document || context).querySelectorAll(sel));
  const c = (t, context) => (document || context).createElement(t);
  const on = (els, type, cb = () => {}) => {
    if (Array.isArray(els)) {
      els.forEach(el => {
        el.addEventListener(type, cb);
      });
    }
    else {
      els.addEventListener(type, cb);
    }
  };

  const m = new Markdown(s1('markdown'));
  m.init();

  const download = e => {
    const getData = $el => {
      let data, type;
      if ($el.classList.contains('md')) {
        data = m.textarea.value;
        type = 'md';
      }
      else if ($el.classList.contains('html')) {
        data = m.preview.innerHTML;
        type = 'html';
      }
      return [data, type];
    };
    const [data, type] = getData(e.target);
    if (!data) {
      console.error('There is no data!');
      return;
    }
    new Downloader(data, `markdown.${type}`);
  });
  on(s('.download button'), 'click', download);
})();
