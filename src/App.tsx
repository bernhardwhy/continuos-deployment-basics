import React, { Component } from "react";
import "./App.css";
import { firebaseDB } from "./shared/config";
import { GroceryType } from "./groceryType";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import AddCircleOutlineSharp from "@material-ui/icons/AddCircleOutlineSharp";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button
} from "@material-ui/core";

export default class App extends Component {
  state = {
    groceries: {},
    searchInput: "",
    activeTab: 0
  };

  componentDidMount() {
    const database = firebaseDB
      .database()
      .ref()
      .child("groceries");
    database.on("value", snap => {
      console.log(snap.val());
      this.setState({ groceries: snap.val() });
    });
  }

  changeData = (groceryId: string, isBuyed: boolean) => {
    if ("vibrate" in navigator) {
      // vibration API supported
      navigator.vibrate([200, 500, 200]);
    }
    firebaseDB
      .database()
      .ref()
      .child("groceries/" + groceryId)
      .update({
        buyed: !isBuyed
      });
  };

  addData = () => {
    firebaseDB
      .database()
      .ref()
      .child("groceries/")
      .push({
        name: this.state.searchInput,
        buyed: false
      });
    this.setState({
      searchInput: ""
    });
  };

  enterSearchInput = (event: React.FormEvent<HTMLInputElement>) => {
    navigator.vibrate([200, 500, 200]);
    this.setState({
      searchInput: event.currentTarget.value
    });
  };

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
  };

  render() {
    const renderedGroceries: GroceryType[] = Object.values(
      this.state.groceries
    );
    this.loopThroughObject(this.state.groceries);
    return (
      <div className="App">
        Groceries: v1.6.1
        <div className="GroceryList">
          {renderedGroceries.map(grocery => {
            return (
              <div key={grocery.id}>
                {this.state.activeTab === 0
                  ? !grocery.buyed && (
                      <Card className="Card">
                        <CardContent>
                          <Typography variant="h5" component="h2">
                            {grocery.name}
                          </Typography>
                          <Typography className="Pos" color="textSecondary">
                            adjective
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            onClick={() =>
                              this.changeData(grocery.id, grocery.buyed)
                            }
                            size="small"
                          >
                            gekauft
                          </Button>
                        </CardActions>
                      </Card>
                    )
                  : grocery.buyed && (
                      <Card className="Card">
                        <CardContent>
                          <Typography variant="h5" component="h2">
                            {grocery.name}
                          </Typography>
                          <Typography className="Pos" color="textSecondary">
                            adjective
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            onClick={() =>
                              this.changeData(grocery.id, grocery.buyed)
                            }
                            size="small"
                          >
                            auf die einkaufsliste
                          </Button>
                        </CardActions>
                      </Card>
                    )}
              </div>
            );
          })}
        </div>
        {this.state.activeTab === 1 && (
          <div className="InputWrapper">
            <input
              type="text"
              onChange={this.enterSearchInput}
              value={this.state.searchInput}
              placeholder="enter lebensmittel"
            />
            <button disabled={!this.state.searchInput} onClick={this.addData}>
              Hinzufügen
            </button>
          </div>
        )}
        <BottomNavigation
          className="BottomNavigation"
          value={this.state.activeTab}
          onChange={(event, newValue) => {
            this.setState({
              activeTab: newValue
            });
          }}
          showLabels
        >
          <BottomNavigationAction
            label="New"
            icon={<AddCircleOutlineSharp />}
          />
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        </BottomNavigation>
      </div>
    );
  }
}
