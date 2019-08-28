import React, { Component } from "react";
import { GroceryType } from "../groceryType";
import "./GroceryList.css";
import ShoppingCartOutlined from "@material-ui/icons/ShoppingCartOutlined";
import DoneOutlined from "@material-ui/icons/DoneOutlined";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Slide,
  Zoom
} from "@material-ui/core";

type GroceryProps = {
  groceries: GroceryType[];
  changeData: any;
};

export default class GroceryList extends Component<GroceryProps> {
  state = {
    showSuccessMessage: false
  };

  handleGroceryBuyedButtonClicked = (
    groceryId: string,
    GroceryBuyed: boolean
  ) => {
    if (this.props.groceries.length === 1) {
      //display success message
      console.log("last element clicked");
      this.setState({
        showSuccessMessage: true
      });
      setTimeout(() => {
        this.setState({
          showSuccessMessage: false
        });
      }, 2000);
    }
    this.props.changeData(groceryId, GroceryBuyed);
  };

  render() {
    const groceryList =
      this.props.groceries.length > 0 ? (
        this.props.groceries.map(grocery => {
          return (
            <div className="GroceryItem" key={grocery.id}>
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
                      this.handleGroceryBuyedButtonClicked(
                        grocery.id,
                        grocery.buyed
                      )
                    }
                    size="small"
                  >
                    gekauft
                  </Button>
                </CardActions>
              </Card>
            </div>
          );
        })
      ) : (
        <Zoom
          in={!this.state.showSuccessMessage}
          style={{
            transitionDelay: !this.state.showSuccessMessage ? "200ms" : "0ms"
          }}
        >
          <div className="IconWrapper">
            <ShoppingCartOutlined color="disabled" className="CustomIcon" />
            <Button disabled>Nichts einzukaufen</Button>
          </div>
        </Zoom>
      );

    return (
      <div className="GroceryList">
        <Slide
          direction="up"
          in={this.state.showSuccessMessage}
          mountOnEnter
          unmountOnExit
        >
          <div className="IconWrapper">
            <DoneOutlined color="disabled" className="CustomIcon" />
            <Button disabled>Alles eingekauft</Button>
          </div>
        </Slide>
        {!this.state.showSuccessMessage && groceryList}
      </div>
    );
  }
}
