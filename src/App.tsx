import * as React from 'react';
import './App.css';

import { Button } from 'antd';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
          <Button type="primary">Klick mich</Button>
      </div>
    );
  }
}

export default App;
