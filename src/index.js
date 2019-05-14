import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App.jsx';

if (module.hot) module.hot.accept();

// const App = () => {
//   return <div>My React App</div>;
// };
// render(<App />, document.querySelector('#root'));
ReactDOM.render(<App />, document.getElementById('root'));
