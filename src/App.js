import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import logo from './images/site_logo.png';
import noticiationSound from './sounds/bonfire_notification_2.wav'

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
            <div className='desktop-only' id="banner">
              <h1 id="site-name">Bonfire</h1>
            </div>
            <SignOut />
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
    <button className="sign-out" onClick={() => auth.signOut()}>X</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, userName } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      userName: auth.currentUser.displayName,
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
    console.log("user: " + auth.currentUser);
  }

  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>

    <EmojiKeyboard/>

    <form onSubmit={sendMessage}>
        <div className='inputWrapper'>
          <input id ='keyboardInput' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="" />
          <button className='emojiKeyboard desktop-only' type='button' onClick={() => DisplayEmojiKeyboard()}>+</button>
          <button className='sendButton' type="submit" disabled={!formValue}>&#128172;</button>
        </div>
      </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL, userName, createdAt } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>
        <b>{userName}</b>
        <br/>
        {text}
      </p>
    </div>
  </>)
}

function DisplayEmojiKeyboard()
{
  if(document.getElementById('emojiKeyboard').style.display != 'none')
  {
    document.getElementById('emojiKeyboard').style.display = 'none';
  }
  else
  {
    document.getElementById('emojiKeyboard').style.display = 'block';
  }
}

function EmojiKeyboard()
{
  return (<>
  <div id="emojiKeyboard">
    Emojis
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[0].innerHTML}>😂</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[1].innerHTML}>❤️</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[2].innerHTML}>😊</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[3].innerHTML}>🤣</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[4].innerHTML}>🙏</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[5].innerHTML}>💕</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[6].innerHTML}>😲</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[7].innerHTML}>👍</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[8].innerHTML}>😭</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[9].innerHTML}>😘</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[10].innerHTML}>😒</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[11].innerHTML}>👌</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[12].innerHTML}>😌</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[13].innerHTML}>😩</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[14].innerHTML}>😏</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[15].innerHTML}>😁</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[16].innerHTML}>😳</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[17].innerHTML}>🙌</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[18].innerHTML}>💁</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[19].innerHTML}>🙈</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[20].innerHTML}>😔</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[21].innerHTML}>😎</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[22].innerHTML}>✌️</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[23].innerHTML}>😑</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[24].innerHTML}>😋</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[25].innerHTML}>😜</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[26].innerHTML}>🎵</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[27].innerHTML}>😞</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[28].innerHTML}>👀</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[29].innerHTML}>✋</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[30].innerHTML}>😊</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[31].innerHTML}>😴</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[32].innerHTML}>👏</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[33].innerHTML}>😉</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[34].innerHTML}>😕</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[35].innerHTML}>💯</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[36].innerHTML}>😢</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[37].innerHTML}>😐</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[38].innerHTML}>🥵</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[39].innerHTML}>😩</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[40].innerHTML}>😱</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[41].innerHTML}>💔</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[42].innerHTML}>💋</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[43].innerHTML}>💜</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[44].innerHTML}>😪</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[45].innerHTML}>💙</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[46].innerHTML}>😝</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[47].innerHTML}>😅</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[48].innerHTML}>👊</button></div>
    </div>
    <div className='emojiRow'>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[49].innerHTML}>😤</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[50].innerHTML}>😢</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[51].innerHTML}>😆</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[52].innerHTML}>😀</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[53].innerHTML}>👿</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[54].innerHTML}>✔️</button></div>
      <div className='emojiWrapper'><button className='emoji' onClick={() => document.getElementById('keyboardInput').value += document.getElementsByClassName('emoji')[55].innerHTML}>🔫</button></div>
    </div>
  </div>
  </>)
}


export default App;