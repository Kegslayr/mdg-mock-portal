import React, {useState, useEffect} from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import User from './User';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import { DataGrid } from '@material-ui/data-grid';
import { v4 as uuidv4 } from 'uuid'; 

const initialFormState = { name: '', description: '', owner: ''}
const ADMIN_USER = "mdg0501@gmail.com";
const columns = [
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'description', headerName: 'Description', flex: 1 },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  notifications: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  buttons: {
    width: 100,
    marginBottom: 10,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

function App() {
  const classes = useStyles();
  const [admin, setAdmin] = useState(false);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const [currentImage, setCurrentImage] = useState(false);
  const [image, setImage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    authorizeUser();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function authorizeUser() {
    const userInfo = await API.Auth.currentUserInfo();
    setEmail(userInfo.attributes.email);
    setAdmin(email === ADMIN_USER);
  }

  async function fetchNotes() {
    const apiData = await API.graphql({query: listNotes});
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    const filteredNotes = apiData.data.listNotes.items.filter(x => x.owner === email);
    setNotes(filteredNotes);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    formData.owner = email;
    await API.graphql({ query: createNoteMutation, variables: { input: formData }});
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    if (!formData.id)
      formData.id = uuidv4();
    formData.owner = email;
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
    fetchNotes();
    setImage(false);
  }

  async function deleteNote({id}) {
    const newNoteArray = notes.filter(note => note.id !== id);
    setNotes(newNoteArray);
    await API.graphql({query: deleteNoteMutation, variables: {input: {id}}});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({...formData, image: file.name});
    await Storage.put(file.name, file);
    fetchNotes();
  }

  function onRowClick(rowData) {
    if (rowData.row.image !== '') {
      setCurrentImage(true);
      setImage(rowData.row.image);
    }
  }

  return (
    <div className="classes.root">
      {admin === true && 
        <h2>Admin user!</h2>
      }
      {admin === false &&
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Point of Care Patient Portal
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon></NotificationsIcon>
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                    <TextField
                      required={true}
                      variant="outlined"
                      onChange={e => setFormData({ ...formData, 'name': e.target.value})}
                      placeholder="Create a new note"
                      value={formData.name}
                      style={{width: 300, marginBottom: 10}}
                    />
                    <TextField
                      variant="outlined"
                      onChange={e => setFormData({ ...formData, 'description': e.target.value})}
                      placeholder="Note description"
                      value={formData.description}
                      style={{width: 400, marginBottom: 10}}
                    />
                    <Button variant="contained" color="primary" onClick={createNote} className={classes.buttons}>Create</Button>
                    <Input
                      type="file"
                      onChange={onChange}
                      color="primary"
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper className={fixedHeightPaper}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>Portal User</Typography>
                    <div>
                      <Typography component="p" variant="h6">Username:</Typography>
                    </div>
                    <div>
                      <Typography className={classes.userText} component="p">{email}</Typography>
                    </div>
                    <div>
                      <Typography component="p" variant="h6">Email:</Typography>
                    </div>
                    <div>
                      <Typography className={classes.userText} component="p">{email}</Typography>
                    </div>
                    <div style={{ marginTop: 10, width:50}}>
                      <AmplifySignOut/>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div style={{height: 250, width: '100%' }}>
                      <DataGrid 
                        rows={notes}
                        columns={columns}
                        pageSize={5}
                        onRowClick={(rowData) => onRowClick(rowData)}
                        disableSelectionOnClick={true}
                      />
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    { currentImage && <img src={image} /> }
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </main>
        </div>
      }
    </div>
  );
}

export default withAuthenticator(App);
