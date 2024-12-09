import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import App from './components/App'; // Adjust the import based on your file structure

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);


// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './components/App';
// import './components/App.css';

// ReactDOM.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );