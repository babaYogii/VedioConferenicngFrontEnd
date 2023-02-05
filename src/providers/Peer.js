import React, { useMemo,useEffect,useState, useCallback } from 'react'



const PeerContext = React.createContext(null);

export const usePeer =()=>{return React.useContext(PeerContext)}

export const PeerProvider=(props)=>{

    const [remoteStream,setRemoteStream]=useState(null);
    
    const peer=useMemo(()=>new RTCPeerConnection(
        {
            iceServers:[
                {
                    urls:[
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:1930",
                    ],
                },
            ],
        }
    ),[]);

    const createOffer=async()=>{
        const offer= await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    const createAnswer=async (offer)=>{
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    const setRemoteAnswer=async(ans)=>{
        await peer.setRemoteDescription(ans);
    }

    const sendStream = async (stream)=>{
        const tracks = stream.getTracks();
        for(const track of tracks){
            peer.addTrack(track,stream);
        }
    };

    const handelTrackEvent=useCallback((event)=>{
        const streams =event.streams;
        console.log(event.streams);
        console.log(streams[0] ,"Remote stream from providers")
        setRemoteStream(streams[0]);
    },[])
    
    

    useEffect(()=>{
        peer.addEventListener('track',handelTrackEvent);
        return()=>{
            peer.removeEventListener('track',handelTrackEvent)
        }
    },[peer,handelTrackEvent])

    return <PeerContext.Provider value={{peer, createOffer , createAnswer,setRemoteAnswer,sendStream,remoteStream}}>
        {props.children}
    </PeerContext.Provider>
}