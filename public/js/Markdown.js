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
        reg: /(\*{2}([\w]+?)\*{2})/g,
        replace: "<strong>$2</strong>"
      },
      {
        reg: /(_([\w]+?)_)/g,
        replace: "<i>$2</i>"
      },
      {
        reg: /^(#{1,6}([\w\s\S]+))$/g,
        replace: function () {
          const match = arguments[0];
          const h = Math.min(match.split("#").length - 1, 6);
          const re = new RegExp(`#{${h}}([\\w\\s\\S]+)`);
          return match.replace(re, `<h${h}>$1</h${h}>`);
        }
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
      this.preview.innerHTML = "";
      lines.forEach(l => {
        this.preview.insertAdjacentHTML('beforeend', this.parseLine(l));
      });
    }
    parseLine (line) {
      this.regexps.forEach(r => {
        line = line.replace(r.reg, r.replace);
      });
      return line;
    }
  }

  global.Markdown = Markdown;
})(window);
