// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//Importing firebase auth from firebase
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore,doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyCxUDDzwcb9aGxSKDPM6GeriUZN9peEbio",
  authDomain: "chat-app-gs-6ec92.firebaseapp.com",
  projectId: "chat-app-gs-6ec92",
  storageBucket: "chat-app-gs-6ec92.appspot.com",
  messagingSenderId: "1053222297924",
  appId: "1:1053222297924:web:e5a8bceaa7381114ee7711"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db=getFirestore(app);

const signup = async (username,email,password) =>{
    try{
        const res = await createUserWithEmailAndPassword(auth,email,password);  //response
        const user = res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username : username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey there...",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    }catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split['-'].join(" "));

    }

}

const login = async (email,password) => {
    try{
        await signInWithEmailAndPassword(auth,email,password);
    }
    catch(error){
        console.log(error);
        toast.error(error.code.split('/')[1].split['-'].join(" "));
    }
} 

const logout = async () => {
    try {
        await signOut(auth)        
    } catch (error) {
        console.log(error);
        toast.error(error.code.split('/')[1].split['-'].join(" "));        
    }
}

const resetPass = async (email) => {
    if(!email){
        toast.error("Enter your email")
        return null;
    }
    try {
        const userRef = collection(db,'users');
        const q = query(userRef,where("email","==",email))
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth,email)
            toast.success("Reset Email sent")
        }
        else{
            toast.error("Email is not exists")
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

export { signup , login ,logout , auth , db,resetPass}
