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

const SearchDialog = (props: SearchDialogProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [filteredGroceries, setFilteredGroceries] = React.useState();
  const [searchInput, setSearchInput] = React.useState('');
  
  useEffect(() => {
    setOpen(props.openDialog);
  });

  function handleClose() {
    props.onCloseDialog();
  }

  const enterSearchInput = (event: React.ChangeEvent<HTMLInputElement> ) => {
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

  const handleAddNewGrocerieItem = () => {
    props.addNewGrocerieItem(searchInput);
    setSearchInput('');
    setFilteredGroceries(null);
  }

  const groceriesToDisplay = !filteredGroceries ? props.groceries : filteredGroceries;
  const showEmptyListItem = groceriesToDisplay.length === 0;

  const renderedGroceriesList = groceriesToDisplay.map((item: GroceryType) => {
    if (item.buyed) {
      return (
        <div key={item.id}>
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
  })

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
          {showEmptyListItem ? 
          <ListItem
          onClick={ handleAddNewGrocerieItem }
          button
        >
          <ListItemText
            primary={searchInput}
            secondary="Click to add"
          />
        </ListItem> : 
        renderedGroceriesList
        }
        </List>
        <div className={classes.inputWrapper}>
          <TextField
            id="outlined-bare"
            className={classes.textField}
            label="Suchen"
            onChange={enterSearchInput}
            value={searchInput}
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

export default SearchDialog;
