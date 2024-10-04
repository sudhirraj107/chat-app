import { createContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";


export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();

    const[userData,setUserData] = useState(null);
    const[chatData,setChatData] = useState(null);

    const[messagesId,setMessagesId] = useState(null)
    const[messages,setMessages] = useState([])
    const[chatUser,setChatUser] = useState(null)
    const[chatVisible,setChatVisible] = useState(false)

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db,'users',uid) //users is collection from firebase
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            setUserData(userData)
            if(userData.avatar && userData.name){
                navigate('/chat') //this condition directs the user to chat page after login if he has uploaded his avatar and name else directed to profile 
            }
            else{
                navigate('/profile')
            }
            await updateDoc(userRef,{
                lastSeen:Date.now()
            })
            setInterval(async()=>{ //await can be added only within async
                if(auth.chatUser){
                    await updateDoc(userRef,{
                        lastSeen:Date.now()
                    })
                }
            }, 60000);
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        if(userData){
            const chatRef = doc(db,'chats',userData.id);
            const unSub = onSnapshot(chatRef, async(res) => {
                const chatItems = res.data().chatsData;
                const tempData = [];
                for(const item of chatItems){
                    const userRef = doc(db,'users',item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({...item,userData })
                }
                setChatData(tempData.sort((a,b)=>b.updatedAt - a.updatedAt))

            })
            return () => {
                unSub();
            }
        }
    },[userData])

    const value = {
        userData,setUserData,
        chatData,setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser,
        chatVisible,setChatVisible
    }

    return (
        <>
            <AppContext.Provider value={value}>
                {props.children}
            </AppContext.Provider>
        </>
    )
}

export default AppContextProvider