import React, { Component } from "react";
import "./App.css";
import { firebaseDB } from "./shared/config";
import { GroceryType } from "./groceryType";

import { Button, Fab, Zoom } from "@material-ui/core";
import GroceryList from "./GroceryList/GroceryList";
import SearchDialog from "./SearchDialog/SearchDialog";
import AddCircleOutlineSharp from "@material-ui/icons/AddCircleOutlineSharp";

export default class App extends Component {
  state = {
    groceries: [],
    activeTab: 0,
    loading: false,
    errorLoadingData: false,
    dialogOpen: false,
    groceriesToBuy: []
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true });
    const database = firebaseDB
      .database()
      .ref()
      .child("groceries");
    database.on(
      "value",
      snap => {
        const dataToManipulate = snap.val();
        this.loopThroughObject(dataToManipulate);
        const manipulatedData: GroceryType[] = Object.values(dataToManipulate);
        const groceriesToBuy = manipulatedData.filter(
          data => data.buyed === false
          );
        this.setState({
          groceries: manipulatedData,
          loading: false,
          groceriesToBuy
        });
      },
      () => {
        this.setState({ loading: false, errorLoadingData: true });
      }
    );
  };

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

  changeGrocerieName = (groceryId: string, groceryName: string) => {
    firebaseDB
      .database()
      .ref()
      .child("groceries/" + groceryId)
      .update({
        name: groceryName
      });
  };

  changeGrocerieArea = (groceryId: string, groceryArea: string) => {
    firebaseDB
      .database()
      .ref()
      .child("groceries/" + groceryId)
      .update({
        area: groceryArea
      });
  };

  addData = (newGrocerieName: string) => {
    firebaseDB
      .database()
      .ref()
      .child("groceries/")
      .push({
        name: newGrocerieName,
        buyed: false
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

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    return (
      <div className="App">
        Groceries: v1.2.0
        {this.state.errorLoadingData ? (
          <div>
            <p>error fetching data...</p>
            <Button onClick={this.fetchData} size="small">
              retry
            </Button>
          </div>
        ) : (
          <div>
            {this.state.loading ? (
              <p>loading data...</p>
            ) : (
              <GroceryList
                groceries={this.state.groceriesToBuy}
                changeData={this.changeData}
                changeGrocerieName={this.changeGrocerieName}
                changeGrocerieArea={this.changeGrocerieArea}
              />
            )}
          </div>
        )}
        <SearchDialog
          addNewGrocerieItem={(newGrocerieItemName: string) =>
            this.addData(newGrocerieItemName)
          }
          handleListItemClicked={this.changeData}
          groceries={this.state.groceries}
          openDialog={this.state.dialogOpen}
          onCloseDialog={this.handleDialogClose}
        />
        <div className="BottomNavigation">
          <Zoom
            in={!this.state.loading}
            style={{
              transitionDelay: `500ms`
            }}
            unmountOnExit
          >
            <Fab
              variant="extended"
              size="large"
              color="primary"
              aria-label="add"
              onClick={this.handleDialogOpen}
            >
              <AddCircleOutlineSharp />
              Hinzufügen
            </Fab>
          </Zoom>
        </div>
      </div>
    );
  }
}
