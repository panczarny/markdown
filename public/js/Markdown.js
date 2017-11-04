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

  class Markdown {
    constructor (wrapper) {
      if (!wrapper) {
        throw new Error("Markdown constructor needs a wrapper");
      }
      this.wrapper = wrapper;
      this.regexps = [].concat(REGEXPS);
      this.events = {};
      if (!Array.isArray(this.eventType)) {
        this.eventType = [this.eventType];
      }
      this.eventType.forEach(ev => this.events[ev] = (el, fn) => el.addEventListener(ev, fn));
    }
    init () {
      if (!this.checkHTMLStructure()) {
        throw new Error("Wrong HTML structure provided - check that!");
      }
      this.addEventHandlers();
      if (!this.checkLocalStorage()) {
        this.setLocalStorage = this.restoreLocalStorage = () => {};
      }
      this.setValue();
      this.updatePreview();
    }
    checkHTMLStructure () {
      return (this.textarea = s1("textarea", this.wrapper)) && (this.preview = s1("preview", this.wrapper));
    }
    addEventHandlers () {
      this.events.input(this.textarea, e => {
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => this.onInput(), this.timeout);
      });
    }
    checkLocalStorage () {
      return localStorage !== undefined;
    }
    setValue () {
      if (this.textarea.value) {
        this.value = this.textarea.value;
        this.setLocalStorage();
      }
      else {
        this.value = this.textarea.value = this.restoreLocalStorage() || "";
      }
    }
    onInput () {
      this.value = this.textarea.value;
      this.updatePreview();
      this.setLocalStorage();
    }
    updatePreview () {
      let HTML = this.value;
      this.regexps.forEach(r => {
        HTML = HTML.replace(r.reg, r.replace);
      });
      this.preview.innerHTML = HTML;
    }
    setLocalStorage () {
      localStorage.setItem(this.storageName, this.value);
    }
    restoreLocalStorage () {
      return localStorage.getItem(this.storageName);
    }
  }
  Markdown.prototype.value = "";
  Markdown.prototype.wrapper = null;
  Markdown.prototype.textarea = null;
  Markdown.prototype.preview = null;
  Markdown.prototype.regexps = null;
  Markdown.prototype.events = null;

  Markdown.prototype.storageName = "_markdown_editor_";
  Markdown.prototype.eventType = "input"; // It's possible to pass an array of eventTypes

  global.Markdown = Markdown;
})(window);
