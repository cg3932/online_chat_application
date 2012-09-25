/*
Manages the interface between the UI and the server. Creates "Conversation" objects when needed.
Pierre-Alexandre Bastarache Roberge	
February 5th 2011
*/

//Params
//myName : the loged-in user.
//bodyBox : the div in which we put the conversation text
//sendBox : the div in which the user writes to send messages
function ConversationManager(myName, bodyBoxID, sendBoxID, onConversationCreate, onConversationDestroy, onConversationActivate)
{
	var intervalTime = 100000000; //Miliseconds)
	this._myName = myName;
	var ref = this;
	this._timer = setInterval(function(){ref.pollServer();}, intervalTime);
	this._conversations = [];
	this._conversationNumber = 0;
	this._lastReceivedTime = -1;
	
	this._activeConversation = null;
	this._bodyDiv = document.getElementById(bodyBoxID);
	this._sendDiv = document.getElementById(sendBoxID);
	this._onConversationCreate = onConversationCreate;
	this._onConversationDestroy = onConversationDestroy;
	this._onConversationActivate = onConversationActivate;
	
	var conv = this.createConversation("test");
	conv.appendBody("How are you gentleman");
	
	var conv2 = this.createConversation("Barney");
	conv2.appendBody("Barney says: This project will be LEGENDARY");
}

ConversationManager.prototype =
{
	createConversation:function( converserName )
	{
		this._conversationNumber++;
		this._conversations[this._conversationNumber] = new Conversation( converserName );
		this._onConversationCreate(converserName);
		return this._conversations[this._conversationNumber];
	},
	
	deleteConversation:function ( converserName )
	{
		var temp = this._conversationNumber;
		for (var i = 1; i <= temp; i++)
		{
			if (this._conversations[i].getTarget() == converserName)
			{
				this._onConversationDestroy(converserName);
				this._conversations[i].destroy();
				this._conversations[i] = null;
				this._conversationNumber--;
			}
		}
	},

	pollServer:function ()
	{
		var messages;
		
		//Todo messages = getNewMessage(this._myName, this._lastReceivedTime);
		
		if (messages == null) return;
		
		for (var mes in messages)
		{
			var mesConversation = this._findConversation(mes.usernameSource);
			if (mesConversation != null)
			{
				mesConversation.appendBody(mes.Body);
			}
			else
			{
				//Need to create a new conversation to put the message in
				this._createConversation(mes.usernameSource).appendBody(mes.Body);
			}
		}
		this._lastReceivedTime = messages[messages.length-1];
	},

	findConversation:function (sender)
	{
		for (var i = 1; i <= this._conversationNumber; i++)
		{
			if (this._conversations[i].getTarget() == sender)
			{
				return this._conversations[i];
			}
		}
		return null;
	},
	
	activateConversation:function (converserName)
	{
		for (var i = 1; i <= this._conversationNumber; i++)
		{
			if (this._conversations[i].getTarget() == converserName)
			{
				if (this._activeConversation != null)
				{	
					this._activeConversation.saveSendText(this._sendDiv.value);
				}
				
				this._activeConversation = this._conversations[i];
				
				this._bodyDiv.value = this._activeConversation.getBody();
				this._sendDiv.value = this._activeConversation.getSendText();
				
				this._onConversationActivate(converserName);
				
				return;
			}
		}
	},
	
	sendMessage:function ()
	{
		//TODO sendMessage(this._myName, this._activeConversation.getTarget(), this._sendDiv.value);
	
		this._sendDiv.value = "";
		this._activeConversation.saveSendText("");
	}
}