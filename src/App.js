import React, { Component } from 'react'
import './App.css';
import { firebaseDB } from './shared/config';

export default class App extends Component {
  state = {
    groceries: {},
    name: '',
  }

  componentDidMount() {
    
    const database = firebaseDB.database().ref().child('groceries');
    database.on('value', snap => {
      console.log(snap.val());
      this.setState({groceries: snap.val()})
    })
  }

  changeData = (groceryId, isBuyed) => {
    firebaseDB.database().ref().child('groceries/' + groceryId).update({
      buyed: !isBuyed
    });
  }

  addData = () => {
    firebaseDB.database().ref().child('groceries/').push({
      name: this.state.name,
      buyed: false
    });
  }

  enterName = (event) => {
this.setState({
  name: event.target.value
})
  }

  loopThroughObject = (object) => {
    for (var key in object) {
      // skip loop if the property is from prototype
      if (!object.hasOwnProperty(key)) continue;

      var obj = object[key];
      for (var prop in obj) {
        // skip loop if the property is from prototype
        obj.id = key;
        if (!obj.hasOwnProperty(prop)) continue;
        
      }
    }
  }

  render() {
    const renderedGroceries = Object.values(this.state.groceries);
    this.loopThroughObject(this.state.groceries);
    return (
      <div className="App">
          {renderedGroceries.map(grocery => {
            return (
            <div>
              <div>
                <div>
                  <h1>{grocery.name}</h1>                
                    <p>{grocery.buyed ? 'bought' : 'to buy'}</p>
                    <button onClick={() => this.changeData(grocery.id, grocery.buyed)}>update entry</button>
                </div>
              </div>
            </div>
            )
          })}
          <input type="text" onChange={this.enterName} value={this.state.name} placeholder="enter lebensmittel"/>
        <button disabled={!this.state.name} onClick={this.addData}>add brot</button>
      </div>
    )
  }
}
