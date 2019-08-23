import React, { useEffect } from "react";
import {
  fade,
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { GroceryType } from "../groceryType";
import { InputBase, Snackbar } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

type SearchDialogProps = {
  openDialog: boolean;
  onCloseDialog: () => void;
  groceries: GroceryType[];
  handleListItemClicked: (itemId: string, itemBuyed: boolean) => void;
  addNewGrocerieItem: (newGrocerieItemName: string) => void;
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
    textField: {
      background: "white",
      [`& fieldset`]: {
        borderRadius: 100
      }
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    close: {
      padding: theme.spacing(0.5)
    }
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

const SearchDialog = (props: SearchDialogProps) => {
  const classes = useStyles();
  const [openDialog, setOpen] = React.useState(false);
  const [showSnackbar, setSnackbarOpen] = React.useState(false);
  const [filteredGroceries, setFilteredGroceries] = React.useState();
  const [searchInput, setSearchInput] = React.useState("");

  useEffect(() => {
    setOpen(props.openDialog);
  });

  function handleDialogClose() {
    props.onCloseDialog();
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  const enterSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let updatedList = [...props.groceries];
    if (event.currentTarget.value.length > 0) {
      updatedList = updatedList.filter(function(item: GroceryType) {
        return (
          item.name
            .toLowerCase()
            .search(event.currentTarget.value.toLowerCase()) !== -1
        );
      });
    }
    setSearchInput(event.currentTarget.value);
    setFilteredGroceries(updatedList);
  };

  const handleAddRecentGrocerieItem = (itemId: string, itemBuyed: boolean) => {
    setSearchInput("");
    setFilteredGroceries(null);
    props.handleListItemClicked(itemId, itemBuyed);
    setSnackbarOpen(true);
  };

  const handleAddNewGrocerieItem = () => {
    props.addNewGrocerieItem(searchInput);
    setSearchInput("");
    setFilteredGroceries(null);
    setSnackbarOpen(true);
  };

  const groceriesToDisplay = !filteredGroceries
    ? props.groceries
    : filteredGroceries;
  const showEmptyListItem = groceriesToDisplay.length === 0;

  const renderedGroceriesList = groceriesToDisplay.map((item: GroceryType) => {
    if (item.buyed) {
      return (
        <div key={item.id}>
          <ListItem
            onClick={() => handleAddRecentGrocerieItem(item.id, item.buyed)}
            button
          >
            <ListItemText primary={item.name} secondary="Click to add" />
          </ListItem>
          <Divider />
        </div>
      );
    }
  });

  return (
    <div>
      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleDialogClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                onChange={enterSearchInput}
                placeholder="Search…"
                value={searchInput}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </Toolbar>
        </AppBar>
        <List className={classes.listWrapper}>
          {showEmptyListItem ? (
            <ListItem onClick={handleAddNewGrocerieItem} button>
              <ListItemText primary={searchInput} secondary="Click to add" />
            </ListItem>
          ) : (
            renderedGroceriesList
          )}
        </List>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Zum Einkaufswagen hinzugefügt</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={handleSnackbarClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </div>
  );
};

export default SearchDialog;
