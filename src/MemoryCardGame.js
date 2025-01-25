import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Select, Layout, List } from 'antd';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

// Liste des 16 couleurs
const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#000080', '#808000', '#FFC0CB',
  '#A52A2A', '#8B4513', '#808080', '#000000',
];

function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameMode, setGameMode] = useState(4); // Mode par défaut : 4 cartes
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('gameHistory')) || []);
  const [background, setBackground] = useState('#f0f2f5');

  useEffect(() => {
    initializeGame();
  }, [gameMode]);

  function initializeGame() {
    // Sélectionner le bon nombre de paires de couleurs en fonction du mode
    const colorPairs = COLORS.slice(0, gameMode / 2);
    const shuffled = [...colorPairs, ...colorPairs]
      .map((color, id) => ({ id, color, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards([]);
  }

  function handleCardClick(card) {
    if (flippedCards.length === 2 || matchedCards.includes(card.id) || flippedCards.includes(card.id)) return;

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards.map(id => cards.find(c => c.id === id));
      if (first.color === second.color) {
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
    React.createElement(Header, { style: { color: 'white', textAlign: 'center' } }, 'Jeu de Memory (16 couleurs)'),

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
                  background: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.color : '#8c8c8c',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'transparent', // Texte invisible
                  border: '1px solid #d9d9d9',
                }
              },
              flippedCards.includes(card.id) || matchedCards.includes(card.id) ? '' : '' // Pas de contenu
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
