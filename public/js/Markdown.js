(global => {
  const s1 = (s, context) => (document || context).querySelector(s);
  const s = (s, context) => (document || context).querySelectorAll(s);
  const c = (t, context) => (document || context).createElement(t);

  const REGEXPS = [
    {
      reg: /(__\*\*\*(.+?)\*\*\*__)/g,
      replace: "<u><strong><i>$2</i></strong></u>"
    },
    {
      reg: /(__\*\*(.+?)\*\*__)/g,
      replace: "<u><strong>$2</strong></u>"
    },
    {
      reg: /(__\*(.+?)\*__)/g,
      replace: "<u><i>$2</i></u>"
    },
    {
      reg: /(__(.+?)__)/g,
      replace: "<u>$2</u>"
    },
    {
      reg: /(\*\*\*(.+?)\*\*\*)/g,
      replace: "<strong><i>$2</i></strong>"
    },
    {
      reg: /(\*\*(.+?)\*\*)/g,
      replace: "<strong>$2</strong>"
    },
    {
      reg: /(\*(.+?)\*)/g,
      replace: "<i>$2</i>"
    },
    {
      reg: /(_(.+?)_)/g,
      replace: "<i>$2</i>"
    },
    {
      reg: /(~~(.+?)~~)/g,
      replace: "<strike>$2</strike>"
    },
    {
      reg: /\[(.*)\]\((.*)\)/g,
      replace: "<a target=\"_blank\" href='$2'>$1</a>"
    },
    {
      reg: /(#{1,6}(.*?))(?=\n)/g,
      replace: function () {
        const match = arguments[0];
        const h = Math.min(match.split("#").length - 1, 6);
        const re = new RegExp(`#{${h}}([\\w\\s\\S]+)`);
        return match.replace(re, `<h${h}>$1</h${h}>`);
      }
    },
    {
      reg: /(\* )(.*?)(?=\n|$)/g,
      replace: "<li>$2</li>"
    },
    {
      reg: /<\/li>\n<li>/g,
      replace: "<\/li><li>"
    },
    {
      reg: /(<li>.*<\/li>)/g,
      replace: "<ul>$1</ul>"
    },
    {
      reg: /```([\s\S]*)```/g,
      replace: "<pre>$1</pre>"
    },
    {
      reg: /`(.*)`/g,
      replace: "<code>$1</code>"
    },
    {
      reg: /(<i>|<strong>|<u>|<strike>)(.+)/g,
      replace: "<p>$1$2</p>"
    }
  ];
  const DEFAULTS = {
    timeout: 100,
    eventTypes: ["input"]
  };

  class Markdown {
    constructor (wrapper) {
      if (!wrapper) {
        throw new Error("Markdown constructor needs a wrapper");
      }
      this.wrapper = wrapper;
      this.options = Object.assign({}, DEFAULTS);
      this.regexps = [].concat(REGEXPS);
      this.events = {};
      this.options.eventTypes.forEach(ev => this.events[ev] = (el, fn) => el.addEventListener(ev, fn));
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
      this.events.input(this.textarea, e => {
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
  Markdown.prototype.value = "";
  Markdown.prototype.wrapper = null;
  Markdown.prototype.textarea = null;
  Markdown.prototype.preview = null;
  Markdown.prototype.options = null;
  Markdown.prototype.regexps = null;
  Markdown.prototype.events = null;

  global.Markdown = Markdown;
})(window);
