import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Select, Layout, List } from 'antd';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameMode, setGameMode] = useState(4);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('gameHistory')) || []);
  const [background, setBackground] = useState('#f0f2f5');

  useEffect(() => {
    initializeGame();
  }, [gameMode]);

  function initializeGame() {
    const pairs = Array.from({ length: gameMode / 2 }, (_, i) => i + 1);
    const shuffled = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    setCards(shuffled.map((value, id) => ({ id, value, flipped: false })));
    setFlippedCards([]);
    setMatchedCards([]);
  }

  function handleCardClick(card) {
    if (flippedCards.length === 2 || matchedCards.includes(card.id) || flippedCards.includes(card.id)) return;

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards.map(id => cards.find(c => c.id === id));
      if (first.value === second.value) {
        setMatchedCards([...matchedCards, first.id, second.id]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }

    if (matchedCards.length + 2 === cards.length) {
      saveGameHistory();
    }
  }

  function saveGameHistory() {
    const newHistory = [...history, { gameMode, date: new Date().toLocaleString() }];
    setHistory(newHistory);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));
  }

  function changeBackground(color) {
    setBackground(color);
  }

  return React.createElement(
    Layout,
    { style: { minHeight: '100vh', background } },
    React.createElement(Header, { style: { color: 'white', textAlign: 'center' } }, 'Jeu de Memory'),

    React.createElement(
      Content,
      { style: { padding: '20px' } },
      React.createElement(
        'div',
        { style: { marginBottom: '20px', textAlign: 'center' } },
        React.createElement(
          Select,
          {
            value: gameMode,
            onChange: value => setGameMode(value),
            style: { width: 120, marginRight: 10 }
          },
          React.createElement(Option, { value: 4 }, 'Mode 4'),
          React.createElement(Option, { value: 16 }, 'Mode 16'),
          React.createElement(Option, { value: 32 }, 'Mode 32')
        ),
        React.createElement(
          Button,
          { onClick: () => changeBackground('#e6f7ff'), style: { marginRight: 10 } },
          'Fond Bleu'
        ),
        React.createElement(
          Button,
          { onClick: () => changeBackground('#f6ffed'), style: { marginRight: 10 } },
          'Fond Vert'
        )
      ),

      React.createElement(
        Row,
        { gutter: [16, 16], justify: 'center' },
        cards.map(card =>
          React.createElement(
            Col,
            { key: card.id, xs: 6, sm: 4, md: 3, lg: 2 },
            React.createElement(
              Card,
              {
                onClick: () => handleCardClick(card),
                hoverable: true,
                style: {
                  textAlign: 'center',
                  background: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'white' : '#8c8c8c',
                  color: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'black' : 'transparent'
                }
              },
              flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.value : ''
            )
          )
        )
      ),

      React.createElement(
        'div',
        { style: { marginTop: '30px' } },
        React.createElement('h2', null, 'Historique des jeux :'),
        React.createElement(
          List,
          {
            bordered: true,
            dataSource: history,
            renderItem: item =>
              React.createElement(List.Item, null, `Mode : ${item.gameMode}, Date : ${item.date}`)
          }
        )
      )
    ),

    React.createElement(Footer, { style: { textAlign: 'center' } }, 'Memory Card Game ©2025')
  );
}

export default MemoryCardGame;
