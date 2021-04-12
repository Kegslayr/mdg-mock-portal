import React, {useState, useEffect} from 'react';
import './App.css';
import { API } from 'aws-amplify';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
//import { listNotes } from './graphql/queries';
//import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: ''}

function App() {
  //const [notes, setNotes] = useState([]);
  //const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    //const apiData = await API.graphql({query: listNotes});
    //setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    //if (!formData.name || !formData.description) return;
    //await API.graphql({ query: createNoteMutation, variables: { input: formData }});
    //setNotes([ ...notes, formData ]);
    //setFormData(initialFormState);
  }

  async function deleteNote({id}) {
    //const newNoteArray = notes.filter(note => note.id !== id);
    //setNotes(newNoteArray);
    //await API.graphql({query: deleteNoteMutation, variables: {input: {id}}});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
