// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

import React from 'react';
import Calculator from './components/Calculator';
import Explanation from './components/Explanation';

const App = () => {
  return (
    <div className="container">
      <Explanation title="מחשבון רווחי ESPP" initialText="Loading explanation text..." />
      <Calculator />
    </div>
  );
};

export default App;

