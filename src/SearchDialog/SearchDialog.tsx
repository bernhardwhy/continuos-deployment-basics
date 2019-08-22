import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
import { TextField } from "@material-ui/core";

type SearchDialogProps = {
  openDialog: boolean;
  onCloseDialog: () => void;
  groceries: GroceryType[];
  handleListItemClicked: (itemId: string, itemBuyed: boolean) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "fixed"
    },
    listWrapper: {
      marginTop: "56px"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    inputWrapper: {
      position: "fixed",
      bottom: "15px",
      display: "flex",
      justifyContent: "center",
      width: "100%"
    },
    textField: {
      background: "white",
      [`& fieldset`]: {
        borderRadius: 100
      }
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

  const enterSearchInput = (event: React.ChangeEvent<HTMLInputElement> ) => {
    console.log(event.currentTarget.value);
    
  };

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
            <Typography variant="subtitle2" className={classes.title}>
              Zuletzt Hinzugefügt
            </Typography>
          </Toolbar>
        </AppBar>
        <List className={classes.listWrapper}>
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
        <div className={classes.inputWrapper}>
          <TextField
            id="outlined-bare"
            className={classes.textField}
            label="Suchen"
            onChange={enterSearchInput}
            placeholder="Lebensmittel"
            margin="normal"
            variant="outlined"
            inputProps={{ "aria-label": "bare" }}
          />
        </div>
      </Dialog>
    </div>
  );
}
