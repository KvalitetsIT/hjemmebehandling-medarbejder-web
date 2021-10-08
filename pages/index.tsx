  function foo(x: number) {
    return x;
  }
  
  function bar() {
    console.log('calling bff ...');
  
    fetch('http://localhost:8080/api/v1/hello', { 'method': 'POST', 'body': '{"name": "Slartibartfast"}', 'headers': new Headers({'Content-Type': 'application/json'})})
    .then(res => res.json())
    .then(res => console.log(res));
  }
  
  function App() {
    console.log('Calling foo. Result: ' + foo(4));
  
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
  
          <button onClick={bar}>Call medarbejder-bff</button>
        </header>
      </div>
    );
  }
  
  export default App;