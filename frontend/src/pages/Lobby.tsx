import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketProvider';
import { useNavigate } from 'react-router-dom';
export function Lobby() {
    const [email, setEmail] = useState('');
    const [roomid, setRoomid] = useState('');
    const socket = useSocket();
    const navigate = useNavigate();
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log({ email, roomid });
        socket?.emit('room:join', {
            email,
            roomid
        });
    }
    const handleJoinRoom = useCallback((data:any)=>{
        // const {email, roomid} = data;
        const {roomid} = data;
        // console.log(email,roomid);
        navigate(`room/${roomid}`)
    },[navigate]);
    
    useEffect(()=>{
        // socket?.on('room:join', msg =>{ console.log('Backend Data', msg)})
        socket?.on('room:join', handleJoinRoom);
        return () => {
            socket?.off('room:join', handleJoinRoom);
        }
    },[socket])
    return (
        <div>
            <form onSubmit={handleSubmit}>
            <label>Enter Email</label>
            <input 
            type="email" 
            placeholder='Enter your email' 
            value={email} 
            onChange={(e) => { setEmail(e.target.value) }} 
            />
            <label>Enter Your Room Number</label>
            <input type="text" 
            placeholder='Enter your Room Number' 
            value={roomid} 
            onChange={(e) => { setRoomid(e.target.value) }}
             />
            <button className='p-2 bg-green-400 rounded-xl px-6 cursor-pointer m-2'>Join</button>
        </form>
        {/* {JSON.stringify({socket})} */}
        </div>
    )
}