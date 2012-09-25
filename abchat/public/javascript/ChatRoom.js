/*
Class to represent a conversation with a single user
Pierre-Alexandre Bastarache Roberge	
February 5th 2011
*/

// Conversation constructor
function ChatRoom( roomName, manager )
{
	this._target = roomName;
	this._conversationBody = "";
	this._sendText = "";
	this._lastReceived = -1;		//Todo Date.now (not sure about format atm)
	this._lastID = -1;
	this.isChatRoom = true;
    this.manager = manager;
	this.newData = false;
}

ChatRoom.prototype=
{
	getData:function()
	{
		self = this;
        var curusr = document.getElementById("username").value;
		$.post("http://iain.homelinux.com:8000/data/get_chatroom_messages?chatroom=" + this._target + "&last=" + this._lastReceived + "&user=" + curusr, {},
		function(data)
		{
                var mes;
				if (data == null )
				{
                    alert('Message retrieval failed.');
				} 
				else 
				{
                    messages = data.messages;
                    if (messages.length != 0){
                    /*else 
					{
                        self._lastReceived = data.messages[data.messages.length - 1].time;
                    } */
                    for (var mes in data.messages)
					{
                        if (data.messages[mes].id == 0){
                            continue;
                        }
                        if (data.messages[mes].id > self._lastID)
						{
							self.newData = true;
                            self.appendBody(data.messages[mes].message);
                            self._lastID = data.messages[mes].id;
                        }
                    }
                    }
                    if (data.bans != null){
                        // Did we get banned/kicked?
                        for (var ban in data.bans){
                            if (curusr == data.bans[ban]){
                                self.manager.deleteConversation(self._target, true);
                                alert('You have been banned');
                            }
                            else if (curusr + '*' == data.bans[ban]){
                                self.manager.deleteConversation(self._target, true);
                                alert('You have been kicked');
                            }
                        }
                    }
                        /*if (self._lastReceived != "-1"){
                            if (data.messages[mes].message.search(': USER ' + curusr + ' HAS BEEN KICKED') != -1){
                                self.appendBody(data.messages[mes].message);
                                self._lastID = data.messages[mes].id;
                                alert('You have been kicked!');
                            }
                            if (data.messages[mes].message.search(': USER ' + curusr + ' HAS BEEN BANNED') != -1){
                                self.appendBody(data.messages[mes].message);
                                self._lastID = data.messages[mes].id;
                                alert('You have been banned!');
                            }
                        }
                    } */
                    if (data.messages.length - 1 >= 0){
                        self._lastReceived = data.messages[data.messages.length - 1].time;
                    }
                    if (data.admin == curusr){
                        var adminctl = document.getElementById("chatroomadmin").style.display = "block";
                    }
                    else {
                        document.getElementById("chatroomadmin").style.display = "none";
                    }
                }
		}
		);
		if (this.newData)
		{
			this.newData = false;
			return true;
		}
	},

	getTarget:function()
	{
		return this._target;
	},
	
	getBody:function()
	{
		return this._conversationBody;
	},
	
	clearBody:function()
	{
		this._converationBody = "";
	},

	saveBody:function(bodyText)
	{
		this._conversationBody = bodyText;
	},
	
	appendBody:function(appendText)
	{
		this._conversationBody += appendText;
	},
	
	getSendText:function()
	{
		return this._sendText;
	},
	
	saveSendText:function(sendText)
	{
		this._sendText = sendText;
	},
	
	destroy:function()
	{
		this.target = null;
	}
}
