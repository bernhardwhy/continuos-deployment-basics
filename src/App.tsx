import React, { Component } from 'react'
import './App.css';
import { firebaseDB } from './shared/config';
import { GroceryType } from './groceryType';

export default class App extends Component {
  state = {
    groceries: {},
    name: '',
  }

  componentDidMount() {

    const database = firebaseDB.database().ref().child('groceries');
    database.on('value', snap => {
      console.log(snap.val());
      this.setState({ groceries: snap.val() })
    })
  }

  changeData = (groceryId: string, isBuyed: boolean) => {
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

  enterName = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      name: event.currentTarget.value
    })
  }

  loopThroughObject = (object: any) => {
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
    const renderedGroceries: GroceryType[] = Object.values(this.state.groceries);
    this.loopThroughObject(this.state.groceries);
    return (
      <div className="App">
        <h1>Groceries:</h1>
        {renderedGroceries.map(grocery => {
          return (
            <div key={ grocery.id }>
              {!grocery.buyed &&
                <div>
                  <h1>{grocery.name}</h1>
                  <button onClick={() => this.changeData(grocery.id, grocery.buyed)}>gekauft</button>
                </div>
              }
            </div>
          )
        })}
        <input type="text" onChange={this.enterName} value={this.state.name} placeholder="enter lebensmittel" />
        <button disabled={!this.state.name} onClick={this.addData}>Hinzufügen</button>
      </div>
    )
  }
}
