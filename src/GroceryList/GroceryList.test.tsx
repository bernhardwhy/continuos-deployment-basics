import React from "react";
import ReactDOM from "react-dom";
import GroceryList from "./GroceryList";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const groceries = [];
  let activeGroceryState: boolean;
  let changeData: () => void;
  groceries.push({
    id: "213",
    name: "test",
    buyed: true
  });
  ReactDOM.render(
    <GroceryList
      groceries={groceries}
      activeGroceryState={activeGroceryState}
      changeData={changeData}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
