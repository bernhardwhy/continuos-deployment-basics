import React, { Component } from "react";
import { GroceryType } from "../groceryType";
import "./GroceryList.css";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button
} from "@material-ui/core";

type GroceryProps = {
  groceries: GroceryType[];
  activeGroceryState: boolean;
  changeData: any;
};

export default class GroceryList extends Component<GroceryProps> {
  render() {
    return (
      <div className="GroceryList">
        {this.props.groceries.length > 0 ? (
          this.props.groceries.map(grocery => {
            return (
              <div className="GroceryItem" key={grocery.id}>
                {this.props.activeGroceryState === !grocery.buyed && (
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
                          this.props.changeData(grocery.id, grocery.buyed)
                        }
                        size="small"
                      >
                        {this.props.activeGroceryState
                          ? "gekauft"
                          : "in den einkaufwagen"}
                      </Button>
                    </CardActions>
                  </Card>
                )}
              </div>
            );
          })
        ) : (
          <p>loading...</p>
        )}
      </div>
    );
  }
}
