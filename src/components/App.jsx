import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Button>hello world</Button>
      </div>
    );
  }
}

export default App;
