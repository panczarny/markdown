(global => {
  const s1 = (s, context) => (document || context).querySelector(s);
  const s = (s, context) => (document || context).querySelectorAll(s);
  const c = (t, context) => (document || context).createElement(t);

  const EVENTS = [/*"keydown", */"input"];
  const events = {};
  EVENTS.forEach(ev => events[ev] = (el, fn) => el.addEventListener(ev, fn));

  class Markdown {
    constructor (wrapper) {
      if (!wrapper) {
        throw new Error("Markdown constructor needs a wrapper");
      }
      this.wrapper = wrapper;
      this.options = {
        timeout: 100
      };
      this.specialChars = ["*", "_"];
      this.regexps = [
      {
        reg: /\*([\s\S\+])\*/,
        fn: this.strong
      }
      ];
    }
    init () {
      if (!this.checkHTMLStructure()) {
        throw new Error("Wrong HTML structure provided - check that!");
      }
      this.addEventHandlers();
      this.updatePreview();
    }
    checkHTMLStructure () {
      return (this.textarea = s1("textarea", this.wrapper)) && (this.preview = s1("preview", this.wrapper));
    }
    addEventHandlers () {
      events.input(this.textarea, e => {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this.onInput(), this.options.timeout);
      });
    }
    onInput () {
      this.updatePreview();
    }
    updatePreview () {
      const lines = this.textarea.value.split("\n");
      lines.forEach(l => {
        this.createLine(l);
      });
    }
    createLine (line) {
      let j;
      for (let i = 0, len$ = line.length; i < len$; i++) {
        const char = line[i];
        if (this.tagMap[char]) {
          if ((j = line.indexOf(char))) {
          }
        }
      }
    }
  }

  global.Markdown = Markdown;
})(window);
