import React,{useState,useEffect, useCallback} from 'react'
import { Box, Button, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import "./Home.css"
import {useSocket} from "../providers/Socket"

const Home = () => {
    const {socket} = useSocket();
    const navigate=useNavigate();
    const [email,Setemail]=useState();
    const [roomId,SetroomId]=useState();

    const handelroomJoined=useCallback((roomId)=>{
     navigate(`/room/${roomId}`)   
    },[navigate])
 
    useEffect(()=>{
        socket.on("joined-room",handelroomJoined)
        
    },[socket,handelroomJoined])



   const handelroomJoin=()=>{
    socket.emit('join-room',{emailId:email,roomId})
   }
    
    return (
        <div className='homepageContainer'>

        <Box className="inputcontainer" >
            <Stack
                component="form"
                
                spacing={2}
                noValidate
                autoComplete="off"
            >
                <TextField
                    hiddenLabel
                    placeholder='Enter your email'
                    variant="outlined"
                    size="small"
                    // value={email}
                    onChange={(e)=>{Setemail(e.target.value)}}
                />
                <TextField
                    hiddenLabel
                    placeholder='Enter your room id'
                    size='small'
                    variant="outlined"
                    // value={roomId}
                    onChange={(e)=>{SetroomId(e.target.value)}}
                />
                <Button onClick={handelroomJoin} variant="outlined">Join Meeting</Button>
            </Stack>
        </Box>
        </div>
    )
}

export default Home