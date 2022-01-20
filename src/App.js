import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import logo from './images/site_logo.png';
import banner from './images/banner.png';

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
//const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className='AppWrapper'>
      <div className="App">
        <header>
          <div id="navWrapper">
            <a href="#"> <img className="img-fluid" id="siteLogo" src={logo} alt="Website logo" /> </a>
          </div>
        </header>

        <section>
          <div className='chatWrapper'>
            {user ? <ChatRoom /> : <SignIn />}
          </div>
        </section>
      </div>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <h1 className="text">Join the Conversation</h1>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <div id="bannerWrapper">
      <img id="banner" src={banner} alt="Website banner" />
      <SignOut />
    </div>

    <main>
      

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>
      

      <form onSubmit={sendMessage}>

        <div className='inputWrapper'>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="" />
          <button className='sendButton' type="submit" disabled={!formValue}>💬</button>
        </div>

      </form>
    </main>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;