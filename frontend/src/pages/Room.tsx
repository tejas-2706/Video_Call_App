import { useCallback, useEffect, useRef, useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import peer from '../services/peer';

function Room() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string>();
  const [mystream, setMyStream] = useState<MediaStream>();
  const [remotestream, setRemotestream] = useState<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const remotevideoRef = useRef<HTMLVideoElement>(null);
  const handleUserJoined = useCallback(({ email, id }: any) => {
    console.log(`User with email ${email} and id ${id} just joined`);
    setRemoteSocketId(id);
  }, [])

  const handleIncomingCall = useCallback(async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
    // console.log(`Incoming Call from ${from} and offer is ${offer}`);
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream)
    }
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket?.emit('call:accepted', {
      to: from,
      ans
    })
  }, [socket])

  // const SendStreams = useCallback(() => {
  //   if (mystream) {
  //     for (const track of mystream?.getTracks()) {
  //       peer.peer.addTrack(track, mystream)
  //     }
  //   }
  // }, [mystream]);

  const handleCallAccepted = useCallback(async ({ ans }: { from: string, ans: RTCSessionDescriptionInit }) => {
    await peer.setRemote(ans);
    console.log('Call Accepted');
    // SendStreams();
  }, []);

  const handleNegoIncoming = useCallback(async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
    const ans = await peer.getAnswer(offer);
    socket?.emit('peer:nego:done', {
      to: from,
      ans
    })
  }, [socket]);


  const handleNegoFinal = useCallback(async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
    await peer.setRemote(ans);
    console.log('Call Final DOne');
  }, [socket]);

  useEffect(() => {
    socket?.on('user:joined', handleUserJoined);
    socket?.on('incoming:call', handleIncomingCall);
    socket?.on('call:accepted', handleCallAccepted);
    socket?.on('peer:nego:needed', handleNegoIncoming);
    socket?.on('peer:nego:final', handleNegoFinal);

    return () => {
      socket?.off('user:joined', handleUserJoined);
      socket?.off('incoming:call', handleIncomingCall);
      socket?.off('call:accepted', handleCallAccepted);
      socket?.off('peer:nego:needed', handleNegoIncoming);
      socket?.off('peer:nego:final', handleNegoFinal);
    }
  }, [socket, handleUserJoined, handleIncomingCall, handleUserJoined])

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream)
    }
    const offer = await peer.getOffer();
    console.log(offer);

    socket?.emit('user:call', {
      to: remoteSocketId,
      offer
    })
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if (videoRef.current && mystream) {
      videoRef.current.srcObject = mystream;
    }
  }, [mystream]);

  useEffect(() => {
    if (remotevideoRef.current && remotestream) {
      remotevideoRef.current.srcObject = remotestream;
    }
  }, [remotestream]);



  useEffect(() => {
    peer.peer.addEventListener('track', async (e) => {
      const remotestream = e.streams;
      console.log('Got tracks');
      console.log("SUCCESS: 'track' event fired. Received streams:", e.streams);
      setRemotestream(remotestream[0])
    })
  }, [])

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket?.emit('peer:nego:needed', { offer, to: remoteSocketId })
  },[socket],
  )

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  return (
    <div className='m-4'>
      Room
      {remoteSocketId ? 'Connected' : 'No One in room'}
      {remoteSocketId && <button onClick={handleCallUser} className='p-2 bg-green-400 rounded-xl px-6 cursor-pointer m-2'>
        Call</button>}
      <div>
        <h1>My Stream</h1>
        {mystream && (
          <video
            ref={videoRef}
            width={'300px'}
            height={'300px'}
            autoPlay
            // muted
            playsInline
            className='rounded-2xl py-2'
          />
        )}
      </div>
      <div>
        <h1>Remote Stream</h1>
        {remotestream && (
          <video
            ref={remotevideoRef}
            width={'300px'}
            height={'300px'}
            autoPlay
            // muted
            playsInline
            className='rounded-2xl py-2'
          />
        )}
      </div>
    </div>
  )
}

export default Room