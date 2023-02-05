import React, { useEffect, useCallback, useState } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from "../providers/Peer"
import ReactPlayer from 'react-player'

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer,sendStream,remoteStream } = usePeer();

  const [myStream, SetMyStream] = useState(null);
  const [remoteEmailId,setRemoteEmail]=useState(null);

  const handelnewuserjoined = useCallback(async (data) => {
    const { emailId } = data;
    console.log("New user joined room", emailId)
    const offer = await createOffer();
    socket.emit('call-user', { emailId, offer })
    setRemoteEmail(emailId);
  }, [createOffer, socket])

  const handelincommingcall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("Incomming call from", from, " ", offer)
    const ans = await createAnswer(offer);
    socket.emit('call-accepted', { emailId: from, ans });
    setRemoteEmail(from);
  }, [createAnswer, socket])

  const handelcallaccepted = useCallback(async (data) => {
    const { ans } = data;
    console.log("Call got accepted", ans);
    await setRemoteAnswer(ans);
   

  }, [setRemoteAnswer])

  const getusermediastream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    
    SetMyStream(stream);
  }, [SetMyStream])

  useEffect(() => {
    socket.on('user-joined', handelnewuserjoined)
    socket.on('incomming-call', handelincommingcall)
    socket.on('call-accepted', handelcallaccepted)

    return () => {
      socket.off("user-joined", handelnewuserjoined)
      socket.off("incomming-call", handelincommingcall)
      socket.off('call-accepted', handelcallaccepted)

    }
  }, [socket, handelnewuserjoined, handelincommingcall, handelcallaccepted])


  useEffect(() => {
    getusermediastream();
  }, [getusermediastream,SetMyStream])
  
  const handelnegotiation=useCallback(()=>{
    const localoffer=peer.localDescription;
    socket.emit('call-user',{emailId:remoteEmailId,offer:localoffer})

    },[peer.localDescription,remoteEmailId,socket]);



    useEffect(()=>{
      peer.addEventListener('negotiationneeded',handelnegotiation)
      return()=>{
         peer.removeEventListener("negotiationneeded",handelnegotiation);
      }

    },[handelnegotiation,peer])

  console.log(myStream)
  console.log(remoteStream,"Remote stream received")
  return (
    <div style={{ backgroundColor: 'balck' }}>
      Wlecome top

      <h2>We are connecteed to {remoteEmailId}</h2>
     {
      myStream && <ReactPlayer url={myStream} playing={true} muted/>
      }

      {  
      remoteStream &&<ReactPlayer url={remoteStream} playing={true} />
      }

      welcome bottom
      <button onClick={e=> sendStream(myStream)}>Send Stream</button>
    </div>
  )
}

export default Room