import React, {useState, useEffect} from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import {withAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: ''}
const ADMIN_USER = "mdg0501@gmail.com";

function App() {
  const [admin, setAdmin] = useState(false);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    authorizeUser();
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function authorizeUser() {
    const userInfo = await API.Auth.currentUserInfo();
    setAdmin(userInfo.attributes.email !== ADMIN_USER);
  }

  async function fetchNotes() {
    const apiData = await API.graphql({query: listNotes});
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData }});
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
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

  return (
    <div className="App">
      <h1>Point of Care App</h1>
      {admin === true && 
        <h2>Admin user!</h2>
      }
      {admin === false &&
        <div>
          <h2>Non Admin user</h2>
          <input
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Note name"
            value={formData.name}
          />
          <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Note description"
            value={formData.description}
          />
          <button onClick={createNote}>Create Note</button>
          <input
            type="file"
            onChange={onChange}
          />
          <div style={{marginBottom: 30}}>
            {
              notes.map(note => (
                <div key={note.id || note.name}>
                  <h2>{note.name}</h2>
                  <p>{note.description}</p>
                  <button onClick={() => deleteNote(note)}>Delete note</button>
                  {
                    note.image && <img src={note.image} style={{width:400}} />
                  }
                </div>
              ))
            }
          </div>
        </div>
      }
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
