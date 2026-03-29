import { useState, useEffect } from 'react';

const quotes = [
  { text: "So long, and thanks for all the fish.", author: "Douglas Adams" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "In God we trust. All others must bring data.", author: "W. Edwards Deming" },
  { text: "Enjoy every sandwich.", author: "Warren Zevon" },
  { text: "The map is not the territory.", author: "Alfred Korzybski" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "All that glitters is not gold.", author: "J.R.R. Tolkien" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SurpriseMe() {
  const [order, setOrder] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState('');
  const [showAuthor, setShowAuthor] = useState(false);

  useEffect(() => {
    setOrder(shuffle(quotes));
  }, []);

  useEffect(() => {
    if (!visible || order.length === 0) return;
    const full = order[index % order.length].text;
    setTyped('');
    setShowAuthor(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(timer);
        setTimeout(() => setShowAuthor(true), 300);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [visible, index, order]);

  function handleClick() {
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => prev + 1);
        setVisible(true);
      }, 150);
    }
  }

  const quote = order.length > 0 ? order[index % order.length] : null;

  return (
    <section className="surprise-section">
      <button onClick={handleClick} className="surprise-btn">
        <span className="surprise-prompt">$</span> surprise_me
        <span className="surprise-cursor">▋</span>
      </button>

      {visible && quote && (
        <div className="surprise-card">
          <div className="surprise-border-top">
            ╔══════════════════════════════════════════════╗
          </div>
          <div className="surprise-body">
            <span className="surprise-quote-mark">&#62; </span>
            <span className="surprise-text">{typed}</span>
            {typed.length < quote.text.length && (
              <span className="surprise-typing-cursor">▋</span>
            )}
          </div>
          <div
            className="surprise-author"
            style={{ opacity: showAuthor ? 1 : 0 }}
          >
            // {quote.author}
          </div>
          <div className="surprise-border-bottom">
            ╚══════════════════════════════════════════════╝
          </div>
        </div>
      )}
    </section>
  );
}
