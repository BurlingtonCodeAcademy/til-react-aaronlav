import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Today I Learned</h1>
      <li><a href='/facts'>List all entries (JSON)</a></li>
      <h2>Add a fact</h2>
      <form method="POST" action="/facts">
        <input type="text" name="text"></input>
        <input type="submit"></input>
      </form>
      </header>
    </div>
  );
}

export default App;