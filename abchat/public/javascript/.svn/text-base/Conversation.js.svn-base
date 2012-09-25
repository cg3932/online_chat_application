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
	this.isChatRoom = false;
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
	},
	
	mute:function(mutedName)
	{
		if (this.isChatRoom)
		{
	
			$.post("http://iain.homelinux.com:8000/data/mute?" + "chatroom=" + this._target + "&username=" + mutedName, {
			},function(data){
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
					if (data.status != "OK"){
						alert("Could not mute the user. Mayhaps you are not the chatroom administrator?");
					}
				}
			}
			);
		}
		else
		{
			//Todo implement user to user muting?
		}
	},
	
	kick:function(kickedName)
	{
		if (this.isChatRoom)
		{
			$.post("http://iain.homelinux.com:8000/data/kick?" + "chatroom=" + this._target + "&username=" + kickedName, {		
			},function(data){
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
					if (data.status != "OK"){
						alert("Could not kick the user. Mayhaps you are not the chatroom administrator?");
					}
				}
			}
			);
		}
		else
		{
			//Nothing to do here. Wouldn't make sense to kick someone in a 1 to 1 conversation.
		}
	},
	
	ban:function(bannedName, banTime)
	{
		banDuration = "";
		if (banTime != -1) banDuration = "&expires"+banTime;
	
		if (this.isChatRoom)
		{
			$.post("http://iain.homelinux.com:8000/data/ban?" + "chatroom=" + this._target + "&username=" + bannedName + banDuration, {
			},function(data){
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
					if (data.status != "OK"){
						alert("Could not ban the user. Mayhaps you are not the chatroom administrator?");
					}
				}
			}
			);
		}
		else
		{
			//TODO: Add user block here?
		}
	},
	
	unban:function(bannedName)
	{
		if (this.isChatRoom)
		{
			$.post("http://iain.homelinux.com:8000/data/unban?" + "chatroom=" + this._target + "&username=" + bannedName, {
			},function(data){
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
					if (data.status != "OK"){
						alert("Could not unban the user. Mayhaps you are not the chatroom administrator?");
					}
				}
			}
			);
		}
		else
		{
			//TODO: Add user unblock here?
		}
	},
	
	setAdmin:function(adminName)
	{
		if (this.isChatRoom)
		{
			$.post("http://iain.homelinux.com:8000/data/set_admin?" + "chatroom=" + this._target + "&username=" + adminName, {
			},function(data){
				if (data == null ){
					alert('An error occured, please contact administrator.');
				} else {
					if (data.status != "OK"){
						alert("Could not change administration rights. Mayhaps you are not the chatroom administrator?");
					}
				}
			}
			);
		}
		else
		{
			//Nothing to do here, move along folks
		}
	}
}
