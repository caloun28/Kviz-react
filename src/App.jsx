import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://crm.skch.cz/ajax0/kvizapi.php/api.php?action=listQuestion');
        
        if (!response.ok) {
          throw new Error('Nepodařilo se načíst data z API');
        }
        
        const data = await response.json();
        
        
        const shuffledQuestions = data.sort(() => 0.5 - Math.random());
        
        
        setQuestions(shuffledQuestions);
        localStorage.setItem('cached_questions', JSON.stringify(shuffledQuestions));
        setLoading(false);
      } catch (err) {
        console.log('API je nedostupné, pokus o načtení z cache (offline režim)...');
        

        const localData = localStorage.getItem('cached_questions');
        if (localData) {
          setQuestions(JSON.parse(localData));
          setLoading(false);
        } else {
          setError('Aplikace je offline a nemáte žádná uložená data.');
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Vedomostní Kvíz</h1>
      </header>
      <main>
        {loading && <div className="loader">Načítám otázky...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && questions.length > 0 && (
          <Quiz questions={questions} />
        )}
      </main>
    </div>
  );
}

export default App
