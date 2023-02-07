(function (window) {
  var ReverseText = function (options) {
    var maps = {
      vertical: { ",": "\u02cb", "!": "\u00a1", "?": "\u01be", ".": "\u0387", "'": "\u02cc", "\"": "\u02cc\u02cc", "*": "\u2093", "&": "\u214b", "1": "\u0196", "2": "5", "4": "\u0aa4", "5": "\u0ae8", "6": "\u03f1", "7": "\u02e9", "9": "\u10db", "A": "\u2c6f", "a": "\u0251", "b": "p", "d": "q", "e": "\u050d", "F": "\u0537", "f": "\u027b", "G": "\u04bc", "g": "\u10db", "h": "\u03bc", "i": "\u1d09", "J": "\u0542", "j": "\u0e45", "k": "\u0138", "L": "\u0393", "l": "\u027c", "M": "W", "m": "w", "N": "\u0418", "n": "u", "P": "b", "p": "b", "Q": "\u2940", "q": "d", "R": "\u0281", "r": "\u0281", "S": "\u01a7", "s": "\u01a8", "T": "\ua4d5", "t": "\u03dd", "U": "\ua4f5", "u": "n", "V": "\u039b", "v": "\u028c", "W": "M", "w": "\u028d", "Y": "\u2144", "y": "\u03bb" },
      horizontal: { ",": "\u02ce", "?": "\u2e2e", "(": ")", ")": "(", "1": "\u0196", "2": "\u03c2", "3": "\u01b8", "4": "\u03bc", "5": "\u091f", "6": "\u10db", "7": "\u0662", "9": "\u0b67", "a": "\u0252", "B": "\ua4ed", "b": "d", "C": "\u0186", "c": "\u0254", "D": "\ua4f7", "d": "b", "E": "\u018e", "e": "\u01dd", "F": "\u314b", "f": "\u0287", "G": "\u04d8", "g": "\u03f1", "h": "\u029c", "J": "\u10b1", "j": "\u012f", "K": "\ua4d8", "k": "\u029e", "L": "\u2143", "N": "\u0418", "P": "\u146b", "p": "q", "Q": "\u03d8", "q": "p", "R": "\u042f", "r": "\u027f", "S": "\u01a7", "s": "\u01a8", "t": "\u0248", "u": "\u03c5", "y": "\u03b3" },
      flip: { ",": "\u02bb", "!": "\u00a1", "?": "\u00bf", ".": "\u0387", "'": "\u02cc", "\"": "\u02cc\u02cc", "*": "\u2093", "&": "\u214b", "1": "\u0196", "2": "\u0547", "3": "\u0190", "4": "h", "5": "\u0aec", "6": "9", "7": "L", "9": "6", "A": "\u2c6f", "a": "\u0250", "B": "\ua4ed", "b": "q", "C": "\ua4db", "c": "\u0254", "D": "\ua4f7", "d": "p", "E": "\u018e", "e": "\u01dd", "F": "\ua4de", "f": "\u025f", "G": "\ua4e8", "g": "\u0253", "h": "\u0265", "i": "\u1d09", "J": "\u017f", "j": "\u017f", "K": "\ua4d8", "k": "\u029e", "L": "\ua4f6", "l": "\u0e45", "M": "W", "m": "\u026f", "n": "u", "P": "\ua4d2", "p": "d", "Q": "\u1ff8", "q": "b", "R": "\ua4e4", "r": "\u0279", "T": "\ua4d5", "t": "\u0287", "U": "\ua4f5", "u": "n", "V": "\ua4e5", "v": "\u028c", "W": "M", "w": "\u028d", "Y": "\u2144", "y": "\u028e" }
    },
      self = this;
    this.options = options;
    this.options.maps = maps;
    this._lastType = this.options.initialType;
    this.fn = {
      'reverse': _reverse.bind(this),
      'word': _reverseWords.bind(this),
      'horizontal': _mirrorHorizontal.bind(this),
      'vertical': _mirrorVertical.bind(this),
      'flip': _flip.bind(this),
    }

    this.options.elem.addEventListener("input", function () {
      if (!self._lastType) {
        return;
      }
      self.transformByType(self._lastType);
    });

    this.transformByType = function (name) {
      this._lastType = name;
      var text = this.fn[name](this.options.elem.value);
      this._setValue(text);
    }
    this.clear = function () {
      self.options.elem.value = "";
      self.options.elem.focus();
      self._setValue("");
    }
    this.copy = function () {
      var el = document.createElement('textarea');
      el.value = self.options.output.innerText;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    this._setValue = function (value) {
      self.options.output.innerText = value;
      self.options.onChange && self.options.onChange();
    }
    function _reverse(text, split, join) {
      var lines = text.split(/\n/g);
      for (var i = 0, l = lines.length; i < l; i++) {
        lines[i] = lines[i].split(split || "").reverse().join(join || "");
      }
      return lines.join("\n");
    }
    function _reverseWords(text) {
      return _reverse(text, /\s+/g, " ");
    }
    function _mirrorHorizontal(text) {
      return _replace(_reverse(text), "horizontal");
    }
    function _mirrorVertical(text) {
      return _replace(text, "vertical");
    }
    function _flip(text) {
      return _replace(text, "flip");
    }
    function _replace(text, mapName) {
      var maps = self.options.maps,
        filterMap = maps[mapName],
        mapsKeys = Object.keys(maps),
        newIndex = 0;
      return text.replace(/./g, function (letter) {
        var map = filterMap;
        if (map[letter]) {
          return map[letter];
        }
        var symbol = _findSymbol(letter);
        if (symbol) {
          newIndex = (mapsKeys.indexOf(symbol.map) + 1) ^ (mapsKeys.indexOf(mapName) + 1);
          newIndex -= 1;
          if (newIndex < 0) {
            return symbol.letter;
          }
          map = maps[mapsKeys[newIndex]];
          return map[symbol.letter] || symbol.letter;
        }
        return letter;
      });
    }
    function _findSymbol(symbol) {
      var code = symbol.charCodeAt();
      for (var i = 0, k = Object.keys(self.options.maps), l = k.length; i < l; i++) {
        for (var a = 0, map = self.options.maps[k[i]], b = Object.keys(map), c = b.length; a < c; a++) {
          if (map[b[a]].charCodeAt() == code) {
            return { map: k[i], letter: b[a] };
          }
        }
      }
      return null;
    }
  }
  if (typeof window.ReverseText === "undefined") {
    window.ReverseText = ReverseText;
  }
})(window);
(function () {
  var textarea = document.getElementById("text"),
    clearButton = document.getElementById("clear"),
    copyButton = document.getElementById("copy"),
    tabs = document.querySelector(".tabs"),
    reverseText = new ReverseText({
      elem: textarea,
      output: document.getElementById("result"),
      initialType: "reverse",
      onChange: onTextareaInput
    }),
    mediaQuery = window.matchMedia("(max-width: 768px)");

  setListeners();
  handleMediaChange(mediaQuery);
  window.history.scrollRestoration = 'manual';

  function setListeners() {
    tabs.addEventListener("change", function (event) {
      reverseText.transformByType(event.target.value);
    });
    clearButton.addEventListener("click", function () {
      reverseText.clear();
    });
    copyButton.addEventListener("click", function () {
      reverseText.copy();
      copyButton.classList.add("result-copy_copied");
    });
    mediaQuery.addListener(handleMediaChange);
  }
  function onTextareaInput() {
    copyButton.classList.remove("result-copy_copied");
    if (textarea.value.length > 0) {
      clearButton.classList.add("textarea__clear_visible");
    } else {
      clearButton.classList.remove("textarea__clear_visible");
    }
  }
  function handleMediaChange(mediaQuery) {
    var flipElement = document.querySelector(".tabs__item_type_flip"),
      mirrorElement = document.querySelector(".tabs__item_type_horizontal");
    if (mediaQuery.matches) {
      flipElement.parentNode.insertBefore(flipElement, mirrorElement);
    } else {
      flipElement.parentNode.appendChild(flipElement);
    }
  }
})();