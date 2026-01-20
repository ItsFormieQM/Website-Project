// GLOBAL GAME STATE
window.canMove = true;

window.gameFlags = {
  playerNamed: false
};

// Example functions you may want to call
window.DialogueActions = {
  healPlayer(amount = 10) {
    console.log("Healed player by", amount);
  },
  shakeScreen() {
    console.log("Screen shake!");
  }
};

const Dialogue = (() => {
  // Container
  const container = document.createElement('div');
  container.id = 'dialogue-container';

  Object.assign(container.style, {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    maxWidth: '680px',
    minHeight: '120px',
    padding: '15px',
    boxSizing: 'border-box',
    fontFamily: '"Pixel Operator", monospace',
    fontSize: '18px',
    lineHeight: '1.4em',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.85)',
    border: '4px solid white',
    zIndex: '1000',
    display: 'none',
    userSelect: 'none',
    pointerEvents: 'none'
  });

  document.body.appendChild(container);

  // State
  let lines = [];
  let currentLine = 0;
  let isTyping = false;
  let typingTimeout = null;
  let typingSpeed = 30;
  let onFinishCallback = null;

  let letterSound = new Audio('/static/sfx/snd_txtasr.wav');
  letterSound.volume = 0.6;

  // Show
  function show(lineArray, onFinish = null) {
    if (!lineArray?.length) return;

    window.canMove = false;
    lines = lineArray;
    currentLine = 0;
    onFinishCallback = onFinish;
    container.style.display = 'block';

    typeLine();
  }

  // Typewriter
  function typeLine() {
    isTyping = true;
    container.innerHTML = '';

    const text = lines[currentLine];
    let i = 0;

    function typeNextChar() {
      if (i >= text.length) {
        isTyping = false;
        return;
      }

      if (text[i] === '{') {
        // {delay=NUMBER}
        let m = text.slice(i).match(/^\{delay=(\d+)\}/);
        if (m) {
          i += m[0].length;
          typingTimeout = setTimeout(typeNextChar, Number(m[1]));
          return;
        }

        // {set=path:value}
        m = text.slice(i).match(/^\{set=([\w.]+):([^}]+)\}/);
        if (m) {
          assignValue(m[1], m[2]);
          i += m[0].length;
          typeNextChar();
          return;
        }

        // {sound=path}
        m = text.slice(i).match(/^\{sound=([^}]+)\}/);
        if (m) {
          letterSound.pause();
          letterSound = new Audio(m[1]);
          letterSound.volume = 0.6;
          i += m[0].length;
          typeNextChar();
          return;
        }

        // {call=functionName(args)}
        m = text.slice(i).match(/^\{call=([\w.]+)(?:\(([^)]*)\))?\}/);
        if (m) {
          callFunction(m[1], m[2]);
          i += m[0].length;
          typeNextChar();
          return;
        }
      }

      const char = text[i++];
      container.innerHTML += char;

      if (/[a-zA-Z0-9]/.test(char)) {
        letterSound.currentTime = 0;
        letterSound.play().catch(() => {});
      }

      let delay = typingSpeed;
      if (/[.!?]/.test(char)) delay = 250;
      else if (char === ',') delay = 120;

      typingTimeout = setTimeout(typeNextChar, delay);
    }

    typeNextChar();
  }

  // Helpers
  function assignValue(pathStr, rawValue) {
    const path = pathStr.split('.');
    let target = window;

    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in target)) target[path[i]] = {};
      target = target[path[i]];
    }

    let value;
    if (rawValue.startsWith('$')) {
      value = rawValue.slice(1).split('.').reduce((o, k) => o?.[k], window);
    } else if (rawValue === 'true' || rawValue === 'false') {
      value = rawValue === 'true';
    } else if (!isNaN(rawValue)) {
      value = Number(rawValue);
    } else {
      value = rawValue;
    }

    target[path.at(-1)] = value;
  }

  function callFunction(pathStr, argStr) {
    const fn = pathStr.split('.').reduce((o, k) => o?.[k], window);
    if (typeof fn !== 'function') return;

    const args = argStr
      ? argStr.split(',').map(a => {
          a = a.trim();
          if (a.startsWith('$')) return a.slice(1).split('.').reduce((o, k) => o?.[k], window);
          if (a === 'true' || a === 'false') return a === 'true';
          if (!isNaN(a)) return Number(a);
          return a;
        })
      : [];

    fn(...args);
  }

  function finishTyping() {
    clearTimeout(typingTimeout);
    container.innerHTML = lines[currentLine]
      .replace(/\{delay=\d+\}/g, '')
      .replace(/\{set=[^}]+\}/g, '')
      .replace(/\{sound=[^}]+\}/g, '')
      .replace(/\{call=[^}]+\}/g, '');
    isTyping = false;
  }

  function nextLine() {
    if (isTyping) return finishTyping();

    currentLine++;
    if (currentLine >= lines.length) {
      container.style.display = 'none';
      window.canMove = true;
      onFinishCallback?.();
    } else {
      typeLine();
    }
  }

  window.addEventListener('keydown', e => {
    if (
      container.style.display === 'block' &&
      (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x')
    ) {
      nextLine();
    }
  });

  return { show };
})();

Dialogue.show([
  "* Oh! You've fallen down...{delay=300}",
  "* Here,{delay=200} get up...{sound=/static/sfx/snd_txtasr2.wav}",
  "* Chara, huh?",
  "* ..."
]);
