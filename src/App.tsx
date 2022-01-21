import './App.css';
import Exchange from './componnets/Exchange';

function App() {

  if (!process.env.REACT_APP_API_KEY) {
    return (
      <>
        <p>Please create an api key from <a href="https://fcsapi.com/">this url</a>.</p>
        <p>Create a .env file and add the process.env.REACT_APP_API_KEY=YOUR_API_KEY_FROM_FCSAPI</p>
      </>
    );
  } else {
    return (
      <div className="App">
          <Exchange />
      </div>
    );
  }
}

export default App;
