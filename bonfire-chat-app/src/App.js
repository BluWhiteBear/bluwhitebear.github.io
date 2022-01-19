import React from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firesotre';

firebase.initializeApp({
  apiKey: "AIzaSyCNM_3n5wGFoo3Yuh7YVMn50-gwgIEN7B8",
  authDomain: "bonfire-chat-app.firebaseapp.com",
  projectId: "bonfire-chat-app",
  storageBucket: "bonfire-chat-app.appspot.com",
  messagingSenderId: "151574405203",
  appId: "1:151574405203:web:f4a4a0a538087585d826a6",
  measurementId: "G-4XVPNDKRT1"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App()
{

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section >
        {user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}

function SignIn()
{
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProbider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut()
{
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom()
{
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <div>

      </div>


    </>
  )

}

function ChatMessage(props)
{
  const {text, uid } = props.message;

  return <p>{text}</p>
}

export default App;
