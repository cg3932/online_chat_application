/*
Class to represent a conversation with a single user
Pierre-Alexandre Bastarache Roberge	
February 5th 2011
*/

// Conversation constructor
function ChatRoom( roomName )
{
	this._target = roomName;
	this._conversationBody = "";
	this._sendText = "";
	this._lastReceived = -1;		//Todo Date.now (not sure about format atm)
	this._lastID = -1;
	this.isChatRoom = true;
}

ChatRoom.prototype=
{
	getData:function()
	{
		$.post("http://iain.homelinux.com:8000/data/get_chatroom_messages?chatroom=" + this._target + "&last=" + this._lastReceived, {},
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
                    if (messages.length == 0){
                        return;
                    }
                    else 
					{
                        this._lastReceived = data.messages[data.messages.length - 1].time;
                    }
                    for (var mes in data.messages)
					{
                        if (data.messages[mes].id > this._lastID)
						{
                            this.appendBody(data.messages[mes].message);
                            page._lastid = data.messages[mes].id;
                        }
                    }
                }
		}
		);
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