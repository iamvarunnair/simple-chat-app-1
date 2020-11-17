import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { io } from 'socket.io-client';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    private SOCKET_ENDPOINT = 'localhost:5000';
    private socket;
    public activeUsers: string[] = [];
    public textInput = new FormControl();
    public isUserTypingInfo = '';
    public currentUser = '';
    public messages: { user: string; time: string; message: string }[] = [];
    ngOnInit() {
        this.socket = io(this.SOCKET_ENDPOINT);
        this.socket.on('connect', () => {
            console.log('connected', this.socket.connected); // true
            this.currentUser = 'User' + Math.floor(Math.random() * 1000000);
            this.socket.emit('new user', this.currentUser);
        });
        this.socket.on('disconnect', reason => {
            console.log('disconnected', reason);
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
                this.socket.connect();
            }
            // else the socket will automatically try to reconnect
        });
        this.socket.on('new user', data => {
            data.map(user => {
                console.log('new user', user);
                if (this.activeUsers.indexOf(user) === -1) {
                    this.activeUsers.push(user);
                }
            });
        });
        this.socket.on('user disconnected', userName => {
            this.activeUsers.splice(this.activeUsers.indexOf(userName), 1);
        });
        this.socket.on('typing', data => {
            const { isTyping, nick } = data;
            if (!isTyping) {
                this.isUserTypingInfo = '';
            } else {
                this.isUserTypingInfo = `${nick} is typing...`;
            }
        });
        this.socket.on('chat message', data => {
            console.log('message', data);
            this.messages.push({
                message: data.message,
                time: new Date().toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                }),
                user: data.nick,
            });
        });
    }
    public onTyping() {
        this.socket.emit('typing', {
            isTyping: this.textInput.value.length > 0,
            nick: this.currentUser,
        });
    }
    public onSend() {
        if (this.textInput.value !== '') {
            this.socket.emit('chat message', {
                message: this.textInput.value,
                nick: this.currentUser,
            });
            this.textInput.setValue('');
            this.socket.emit('typing', {
                isTyping: this.textInput.value.length > 0,
                nick: this.currentUser,
            });
        }
    }
}
