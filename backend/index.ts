import express from 'express'
import { Server } from 'socket.io';
import { createServer } from 'node:http'
import cors from 'cors'
const PORT = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET','POST']
    }
});

app.use(express.json());
app.use(cors({
    origin:'*',
    methods:['GET','POST']
}))

const EmailToSocketIdMap = new Map<string, string>();
const SocketIdToEmailMap = new Map<string, string>();

app.get('/', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('room:join', (msg) => {
        const {email, roomid} = msg;
        EmailToSocketIdMap.set(email,socket.id);
        SocketIdToEmailMap.set(socket.id,email);
        io.to(roomid).emit('user:joined', {email, id:socket.id});
        socket.join(roomid);
        io.to(socket.id).emit("room:join", msg);
    });

    socket.on('user:call', (data) => {
        const {to, offer} = data;
        io.to(to).emit('incoming:call',{
            from:socket.id,
            offer
        })
    });

    socket.on('call:accepted', (data) => {
        const {to, ans} = data;
        io.to(to).emit('call:accepted', {
            from: socket.id,
            ans
        })
    });

    socket.on('peer:nego:needed', (data)=>{
        const {offer,to} = data;
        io.to(to).emit('peer:nego:needed', {
            from: socket.id,
            offer
        })
    })

    socket.on('peer:nego:done', (data)=>{
        const {to,ans} = data;
        io.to(to).emit('peer:nego:final', {
            from: socket.id,
            ans
        })
    })
});


httpServer.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});