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
    filteredGroceries: undefined,
    searchInput: "",
    activeTab: 0,
    loading: false,
    errorLoadingData: false,
    dialogOpen: false
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
        this.setState({ groceries: manipulatedData, loading: false });
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
    let updatedList = [...this.state.groceries];
    if (event.currentTarget.value.length > 0) {
      updatedList = updatedList.filter(function(item: GroceryType) {
        return (
          item.name
            .toLowerCase()
            .search(event.currentTarget.value.toLowerCase()) !== -1
        );
      });
    }

    this.setState({
      filteredGroceries:
        event.currentTarget.value.length > 0 ? updatedList : undefined,
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

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const activeGroceryState = this.state.activeTab === 0;

    return (
      <div className="App">
        Groceries: v1.7.2
        {this.state.errorLoadingData ? (
          <div>
            <p>error fetching data...</p>
            <Button onClick={this.fetchData} size="small">
              retry
            </Button>
          </div>
        ) : (
          <GroceryList
            groceries={this.state.groceries}
            activeGroceryState={activeGroceryState}
            changeData={this.changeData}
          />
        )}
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
        <SearchDialog
          handleListItemClicked={this.changeData}
          groceries={this.state.filteredGroceries || this.state.groceries}
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
