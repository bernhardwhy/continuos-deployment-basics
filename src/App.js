import React, { Component } from 'react'
import './App.css';
import { DB_CONFIG } from './shared/config';
import firebase from 'firebase';

export default class App extends Component {
  state = {
    groceries: 5,
  }

  componentDidMount() {
    const app = firebase.initializeApp(DB_CONFIG);
    const database = app.database().ref().child('groceries');
    database.on('value', snap => {
      this.setState({
        groceries: snap.val()
      })
    })
  }

  render() {
    return (
      <div className="App">
        <p>
          {this.state.groceries}
        </p>
      </div>
    )
  }
}
