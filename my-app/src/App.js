import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { useEffect, useState } from 'react';
import './App.css';
import { auth } from './firebase-config';
import { firestore } from './firebase-config';
import { collection, onSnapshot, query, where } from '@firebase/firestore';

function App() {

  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [EError, setEError] = useState('');
  const [PError, setPError] = useState('');
  const [hasAcc, setHasAcc] = useState(false);
  const [insC, setInsC] = useState('');
  const [insT, setInsT] = useState('');
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  const insRef = collection(firestore, 'Instructors')

  const clear = () => {
    setEmail('');
    setPass('');
  }

  const clearErrors = () => {
    setEError('');
    setPError('');
  }

  const clearins = () => {
    setInsC('');
    setInsT('');
  }

  const handleLogin = async () => {
    clearErrors();
    try {
      const user = await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      switch(error.code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setEError(error.message);
          break;
        case "auth/wrong-password":
          setPError(error.message);
          break;
      }
    }
  }

  const handleSignup = async () => {
    clearErrors();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, pass)
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEError(error.message);
          break;
        case "auth/weak-password":
          setPError(error.message);
          break;
      }
    }
  }

  const handleLogout = () => {
    signOut(auth);
  }

  const handleIns = async () => {
    clearins();
    setData([]);
    const q = query(insRef, where('City', '==', insC))
    onSnapshot(q, (snapshot) => {
      let ins = []
      snapshot.docs.forEach((doc) => {
        ins.push({...doc.data() ,id: doc.id})
      })
      setData(ins)
      setLoader(false)
      console.log(ins)
    })
  }

  const authL = () => {
    onAuthStateChanged(auth, (user) => {
      if(user){
        clear();
        setUser(user);
      } else {
        setUser('');
      }
    })
  }

  useEffect(() => {
    authL();
  }, []);

  return (
    <div className="App">

      {user ? (
        <section className="hero">
          <nav>
            <h2>Welcome</h2>
            <button onClick={handleLogout}>Logout</button>
          </nav>
          <info>
          <h1> Find an Instructor: </h1>
          <p><br></br></p>
          <label>City: </label>
          <input type="text" required value={insC} onChange={(e) => setInsC(e.target.value)}/>
          <p><br></br></p>
          <button onClick={handleIns}>Find Instructor's</button>
          <p><br></br></p>
          {loader === false && (data.map((i) => (
            <div key={i.id}>
              <h1>{i.name}</h1>
              <p><br></br></p>
              <p>City: {i.City}</p>
              <p>Transmission: {i.Transmission}</p>
              <p>Phone Number: {i.number}</p>
              <p>Email: {i.email}</p>
              <p><br></br></p>
            </div>
          )))}
          </info>
        </section>
      ) : (
        <section className="login">
        <div className="loginContainer">
            <label>Username</label>
            <input type="text" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <p className="errorMsg">{EError}</p>
            <label>Password</label>
            <input type="password" required value={pass} onChange={(e) => setPass(e.target.value)}/>
            <p className="errorMsg">{PError}</p>
            <div className="btnContainer">
              {hasAcc ? (
                <>
                  <button onClick={handleLogin}>Sign in</button>
                  <p>Don't have an account? <span onClick={() => setHasAcc(!hasAcc)}>Sign up</span></p>
                </>
              ) : (
                <>
                  <button onClick={handleSignup}>Sign up</button>
                  <p>Already have an account? <span onClick={() => setHasAcc(!hasAcc)}>Sign in</span></p>
                </>
              )}
            </div>
        </div>
        </section>
      )}
    </div>
  );
}

export default App;
