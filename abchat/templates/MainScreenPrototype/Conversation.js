/*
Class to represent a conversation with a single user
Pierre-Alexandre Bastarache Roberge	
February 5th 2011
*/

// Conversation constructor
function Conversation( conversationTarget )
{
	this._target = conversationTarget;
	this._conversationBody = "";
	this._sendText = "";
}

Conversation.prototype=
{
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