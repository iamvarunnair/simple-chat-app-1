# Simple Chat Application

A clinet in angular to connect to a nodejs express application socket, like this [example](https://github.com/iamvarunnair/simple-chat-app-0).

**This does not have the server side code, only client side**

### Features

-   A single chat room
-   Shows active users
-   Shows when users are typing
-   Newly sent messages

### Technology

-   [Angular](angular.io)
-   [socket.io-client](https://www.npmjs.com/package/socket.io-client) - for socket client on angular.

### Installation

**Make sure a server is running on the same port, for example 'localhost:5000'**

```sh
$ npm i
$ ng serve
```

### Todos

-   Implement multiple chat rooms with socket.join() and socket.leave()

**Have fun designing your own architecture**
