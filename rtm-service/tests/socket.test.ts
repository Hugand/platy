import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";
import SocketController from "../src/controller/sockets";
import { DataContainer } from "../src/model/DataContainer";
import { JoinRoomData } from "../src/model/JoinRoomData";
import { NewMessageData } from "../src/model/NewMessageData";
import { SendMessageData } from "../src/model/SendMessageData";
import { SKT_EVT } from "../src/model/SocketEventEnum";

describe('Socket testing', () => {
  let io: Server;
  let clientSocket: SocketIOClient.Socket;
  let socketController: SocketController = new SocketController(new DataContainer())
  let mockUserUid = '123321123';

  beforeEach((done) => {
    fetchMock.resetMocks();

    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const httpAddress: any = httpServer.address()
      const port: number = httpAddress.port;
      clientSocket = Client(`http://localhost:${port}`, { query: { uid: mockUserUid } });
      io.on("connection", (socket) => {
        // serverSocket = socket;
        socketController.onConnect(io, socket)
      });

      clientSocket.on("connect", done);
    });
  });

  afterEach(() => {
    io.close();
    clientSocket.close();
  });
  
  it("successfuly joins rooms", (done) => {
    fetchMock.mockResponseOnce(JSON.stringify({status: true}));
  
    const data: JoinRoomData = {
      token: "dasdada",
      uid: mockUserUid,
      roomIds: ["F12", "F32"]
    };

    clientSocket.on(SKT_EVT.JOIN_ROOM_VALIDATE, () => {
      const connectedSockets = io.sockets.sockets
      const mySocket = connectedSockets.values().next().value

      expect(mySocket.rooms.has(data.roomIds[0])).toBeTruthy();
      expect(mySocket.rooms.has(data.roomIds[1])).toBeTruthy();
      done();
    });

    clientSocket.emit(SKT_EVT.JOIN_ROOM, data)
  });

  it("fail to join room by invalid token", (done) => {
    fetchMock.mockResponseOnce(JSON.stringify({status: false}));
  
    const data: JoinRoomData = {
      token: "dasdada",
      uid: mockUserUid,
      roomIds: ["F12", "F32"]
    };

    clientSocket.on(SKT_EVT.ERROR, (errorType: string) => {
      expect(errorType).toBe(SKT_EVT.TOKEN_INVALID)
      done();
    });

    clientSocket.emit(SKT_EVT.JOIN_ROOM, data)
  })

  it("fail to join room by invalid room id (null)", (done) => {
    fetchMock.mockResponseOnce(JSON.stringify({status: true}));
  
    const data = {
      token: "dasdada",
      uid: mockUserUid,
      roomIds: null
    };

    clientSocket.on(SKT_EVT.ERROR, (errorType: string) => {
      expect(errorType).toBe(SKT_EVT.INVALID_ROOM_ID)
      done();
    });

    clientSocket.emit(SKT_EVT.JOIN_ROOM, data)
  })

  it("fail to join room by invalid room id (undefined)", (done) => {
    fetchMock.mockResponseOnce(JSON.stringify({status: true}));
  
    const data = {
      token: "dasdada",
      uid: mockUserUid,
    };

    clientSocket.on(SKT_EVT.ERROR, (errorType: string) => {
      expect(errorType).toBe(SKT_EVT.INVALID_ROOM_ID)
      done();
    });

    clientSocket.emit(SKT_EVT.JOIN_ROOM, data)
  })

  it("fail to sendMessage by inexistent roomd id", (done) => {
    const data: SendMessageData = {
      token: 'asdd1wqadas',
      newChat: {
        id: 0,
        userOrigin: 0,
        msg: 'Hello world!',
        friendshipId: 12,
        timestamp: new Date()
      },
      roomId: 'F12'
    }

    fetchMock.mockResponseOnce(JSON.stringify(data.newChat));

    clientSocket.on(SKT_EVT.ERROR, (errorType: string) => {
      expect(errorType).toBe(SKT_EVT.INVALID_ROOM_ID)
      done();
    });

    clientSocket.emit(SKT_EVT.SEND_MESSAGE, data)
  })

  it("succeed to sendMessage", (done) => {
    const joinRoomData: JoinRoomData = {
      token: "dasdada",
      uid: mockUserUid,
      roomIds: ["F12", "F32"]
    };

    const sendMessageData: SendMessageData = {
      token: 'asdd1wqadas',
      newChat: {
        id: 0,
        userOrigin: 0,
        msg: 'Hello world!',
        friendshipId: 12,
        timestamp: new Date()
      },
      roomId: 'F12'
    }

    fetchMock.mockResponses([
      JSON.stringify({ status: true }),
      { status: 200 }
    ],[
      JSON.stringify(sendMessageData.newChat),
      { status: 200 }
    ]);

    clientSocket.on(SKT_EVT.JOIN_ROOM_VALIDATE, () => {
      clientSocket.emit(SKT_EVT.SEND_MESSAGE, sendMessageData);
    });

    clientSocket.on(SKT_EVT.NEW_MESSAGE, (newMessageDataString: string) => {
      const newMessageData: NewMessageData = JSON.parse(newMessageDataString);
      expect(JSON.stringify(newMessageData.message)).toBe(JSON.stringify(sendMessageData.newChat))
      expect(newMessageData.roomId).toBe(sendMessageData.roomId)
      done();
    });

    clientSocket.emit(SKT_EVT.JOIN_ROOM, joinRoomData)
  })

  it('fail to send message by invalid token', done => {
    const data: SendMessageData = {
      token: 'asdd1wqadas',
      newChat: {
        id: 0,
        userOrigin: 0,
        msg: 'Hello world!',
        friendshipId: 12,
        timestamp: new Date()
      },
      roomId: 'F12'
    }

    fetchMock.mockResponseOnce();
    fetchMock.mockReject(() => Promise.reject('Invalid token'));

    clientSocket.on(SKT_EVT.ERROR, (errorType: string) => {
      expect(errorType).toBe(SKT_EVT.TOKEN_INVALID)
      done();
    });

    clientSocket.emit(SKT_EVT.SEND_MESSAGE, data)
  })

  
})