import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { GroceryType } from "../groceryType";

type SearchDialogProps = {
  openDialog: boolean;
  onCloseDialog: () => void;
  groceries: GroceryType[];
  handleListItemClicked: (itemId: string, itemBuyed: boolean) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export default function SearchDialog(props: SearchDialogProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    console.log("use effect", props);
    setOpen(props.openDialog);
  });

  function handleClose() {
    props.onCloseDialog();
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
            <Button color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {props.groceries.map(item => {
            if (item.buyed) {
              return (
                <div>
                  <ListItem
                    onClick={() =>
                      props.handleListItemClicked(item.id, item.buyed)
                    }
                    button
                  >
                    <ListItemText
                      primary={item.name}
                      secondary="Click to add"
                    />
                  </ListItem>
                  <Divider />
                </div>
              );
            }
          })}
        </List>
      </Dialog>
    </div>
  );
}
