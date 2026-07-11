import { useState, useEffect, useRef, useCallback } from 'react';

const quotes = [
  {
    text: "So long, and thanks for all the fish.",
    author: "Douglas Adams",
    art: [
      "       /`\u00B7.\u00B8",
      "      /\u00B8...\u00B8`:\u00B7",
      " \u00B8.\u00B7\u00B4  \u00B8   `\u00B7.\u00B8.\u00B7\u00B4)",
      ": \u00A9 )         `\u00B7.\u00B8.\u00B7\u00B4",
      " `\u00B7.\u00B8 `\u00B7  \u00B8.\u00B7\u00B4\\",
      "     `\\\\\u00B4\u00B4\\\u00B8.\u00B7\u00B4",
    ],
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    art: [
      "              *    .  *",
      "           .    *    .",
      "        *    ______    *",
      "           .'      `.",
      "     *    /   .~~.   \\    .",
      "         |   |    |   |",
      "         |   |    |   |",
      "          \\  `.__.'  /",
      "           `.      .'",
      "             '----'",
      "              |  |",
      "             _|  |_",
      "            [______]",
    ],
  },
  {
    text: "In God we trust. All others must bring data.",
    author: "W. Edwards Deming",
    art: [
      "                           _____",
      "                     __   |     |",
      "               __   |  |  |     |",
      "         __   |  |  |  |  |     |",
      "   __   |  |  |  |  |  |  |     |",
      "  |  |  |  |  |  |  |  |  |     |",
      "  |  |  |  |  |  |  |  |  |     |",
      "  |  |  |  |  |  |  |  |  |     |",
      "  |__|__|__|__|__|__|__|__|_____|",
      "  Q1   Q2   Q3   Q4   >>>>>>>>>>",
    ],
  },
  {
    text: "Enjoy every sandwich.",
    author: "Warren Zevon",
    art: [
      "        _.------._",
      "      .'           '.",
      "     /  ~~  ~~  ~~  ~\\",
      "    |__________________|",
      "    |  ///  ///  ///   |",
      "    |__________________|",
      "    | ~~~~~ ~~~~~ ~~~~ |",
      "    |__________________|",
      "    | . .. . .. . .. . |",
      "    |__________________|",
      "     \\  ~~  ~~  ~~  ~ /",
      "      '.__________.'",
    ],
  },
  {
    text: "The map is not the territory.",
    author: "Alfred Korzybski",
    art: [
      "           .    N    .",
      "            \\   |   /",
      "         .---\\--+--/---.",
      "         |    \\ | /    |",
      "      W--+-----*-----+--E",
      "         |    / | \\    |",
      "         '---/--+--\\---'",
      "            /   |   \\",
      "           '    S    '",
      "",
      "       [X] YOU ARE HERE",
    ],
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien",
    art: [
      "                  /\\",
      "                 /  \\      /\\",
      "                /    \\    /  \\",
      "          /\\   /      \\  /    \\",
      "         /  \\ /   /\\   \\/      \\",
      "        /    /   /  \\   \\       \\",
      "       /    /   /    \\   \\   /\\  \\",
      "      /    /   /      \\   \\ /  \\  \\",
      "   __/    /___/________\\___/    \\__\\__",
      "         *",
      "        /|\\     .  .  .  .  .  .  .",
      "         |",
    ],
  },
  {
    text: "All that glitters is not gold.",
    author: "J.R.R. Tolkien",
    art: [
      "              .",
      "             / \\",
      "            / | \\",
      "           /  |  \\",
      "          /   |   \\",
      "         / ,--+--, \\",
      "        / '   |   ` \\",
      "       /   `--+--'   \\",
      "      /       |       \\",
      "     /_______/|\\_______\\",
      "        \\   /   \\   /",
      "         \\_/     \\_/",
      "       ~  ~  ~  ~  ~  ~",
    ],
  },
];

const FLIP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?=-+~";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SplitFlapText({ text, startDelay = 0, charDelay = 30, flipsPerChar = 6 }) {
  const [display, setDisplay] = useState('');
  const frameRef = useRef(null);

  useEffect(() => {
    if (!text) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }
    const chars = text.split('');
    const settled = new Array(chars.length).fill(false);
    const current = new Array(chars.length).fill(' ');
    let startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < startDelay) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const activeElapsed = elapsed - startDelay;
      let allDone = true;

      for (let i = 0; i < chars.length; i++) {
        if (settled[i]) continue;
        const charStart = i * charDelay;
        if (activeElapsed < charStart) {
          allDone = false;
          continue;
        }

        if (chars[i] === ' ') {
          current[i] = ' ';
          settled[i] = true;
          continue;
        }

        const charElapsed = activeElapsed - charStart;
        const flipInterval = 50;
        const totalFlips = flipsPerChar + Math.floor(Math.random() * 3);
        const currentFlip = Math.floor(charElapsed / flipInterval);

        if (currentFlip >= totalFlips) {
          current[i] = chars[i];
          settled[i] = true;
        } else {
          current[i] = FLIP_CHARS[Math.floor(Math.random() * FLIP_CHARS.length)];
          allDone = false;
        }
      }

      setDisplay(current.join(''));

      if (!allDone) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, startDelay, charDelay, flipsPerChar]);

  return <span>{display}</span>;
}

function SplitFlapBlock({ lines, startDelay = 0 }) {
  return (
    <div className="splitflap-block">
      {lines.map((line, i) => (
        <div key={i} className="splitflap-line">
          <SplitFlapText
            text={line}
            startDelay={startDelay + i * 100}
            charDelay={15}
            flipsPerChar={4}
          />
        </div>
      ))}
    </div>
  );
}

export default function SurpriseMe() {
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Lead with Zevon, then Adams, then shuffle the rest
    const zevon = quotes.find(q => q.author === "Warren Zevon");
    const adams = quotes.find(q => q.author === "Douglas Adams");
    const rest = shuffle(quotes.filter(q => q.author !== "Warren Zevon" && q.author !== "Douglas Adams"));
    setOrder([zevon, adams, ...rest]);
  }, []);

  const handleNext = useCallback(() => {
    setIndex(prev => prev + 1);
    setKey(prev => prev + 1);
  }, []);

  if (order.length === 0) return null;

  const quote = order[index % order.length];
  const artDuration = quote.art.length * 100 + quote.art.reduce((max, l) => Math.max(max, l.length), 0) * 15 + 200;

  return (
    <div className="surprise-page" key={key}>
      <div className="surprise-art">
        <SplitFlapBlock lines={quote.art} startDelay={300} />
      </div>

      <div className="surprise-quote-container">
        <div className="surprise-quote-text">
          <SplitFlapText
            text={quote.text}
            startDelay={300 + artDuration + 600}
            charDelay={28}
            flipsPerChar={5}
          />
        </div>
        <div className="surprise-quote-author">
          <SplitFlapText
            text={"// " + quote.author}
            startDelay={300 + artDuration + 600 + quote.text.length * 28 + 400}
            charDelay={35}
            flipsPerChar={3}
          />
        </div>
      </div>

      <button onClick={handleNext} className="surprise-next-btn">
        <span className="surprise-prompt">$</span> next
        <span className="surprise-cursor">&#9611;</span>
      </button>
    </div>
  );
}
