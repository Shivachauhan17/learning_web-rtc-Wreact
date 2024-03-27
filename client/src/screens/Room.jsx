import React,{ useEffect, useCallback, useState } from 'react'
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";


function Room() {
    const socket = useSocket();
    console.log(socket)
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();

    const handleUserJoined=useCallback(({email,id})=>{
        console.log(`Email ${email} joined room`)
        setRemoteSocketId(id);
    },[])

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
      }, [remoteSocketId, socket]);

    useEffect(()=>{
        socket.on('user:joined',handleUserJoined)

        return()=>{
            socket.off('user:joined',handleUserJoined)
        }
    },[])

  return (
    <div>
        <h1>Room Page</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>

        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}

    </div>
  )
}

export default Room