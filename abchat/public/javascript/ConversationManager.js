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
	var intervalTime = 1000; //Miliseconds
	this._myName = myName;
	var ref = this;
	this._timer = setInterval(function(){ref.pollServer();}, intervalTime);
	this._conversations = [];
	this._chatRooms = [];
	this._lastReceivedTime = -1;
    this._lastid = -1;
	this.newData = false;

	this._activeConversation = null;
	this._bodyDiv = document.getElementById(bodyBoxID);
	this._sendDiv = document.getElementById(sendBoxID);
	this._onConversationCreate = onConversationCreate;
	this._onConversationDestroy = onConversationDestroy;
	this._onConversationActivate = onConversationActivate;
}

ConversationManager.prototype =
{

    mute:function( )
    {
        var mutee = document.getElementById("adminuser").value;
        $.post("http://iain.homelinux.com:8000/data/mute?chatroom=" + this._activeConversation._target + "&username=" + mutee, {}, function(data){});
        //alert(this._activeConversation._target);
    },

    kick:function( )
    {
        var kickee = document.getElementById("adminuser").value;
        $.post("http://iain.homelinux.com:8000/data/kick?chatroom=" + this._activeConversation._target + "&username=" + kickee, {}, function(data){});
    },

    ban:function( )
    {
        var banee = document.getElementById("adminuser").value;
        // Consider building in a Ban duration here... Time permitting
        $.post("http://iain.homelinux.com:8000/data/ban?chatroom=" + this._activeConversation._target + "&username=" + banee, {}, function(data){});
    },

    unmute:function( )
    {
        var unmutee = document.getElementById("adminuser").value;
        $.post("http://iain.homelinux.com:8000/data/unmute?chatroom=" + this._activeConversation._target + "&username=" + unmutee, {}, function(data){});
    },

    setadmin:function( )
    {
        var newadmin = document.getElementById("adminuser").value;
        $.post("http://iain.homelinux.com:8000/data/set_admin?chatroom=" + this._activeConversation._target + "&username=" + newadmin, {}, function(data){});
    },

    unban:function( )
    {
        var unbannee = document.getElementById("adminuser").value;
        $.post("http://iain.homelinux.com:8000/data/unban?chatroom=" + this._activeConversation._target + "&username=" + unbannee, {}, function(data){});
    },

	createConversation:function( converserName )
	{
        if (converserName == null){
            return;
        }
		this._conversations[converserName] = new Conversation( converserName );
		this._onConversationCreate(converserName, false);

        var curusr = this._myName;
        var page = this;
        $.post("http://iain.homelinux.com:8000/data/get_history?user1=" + curusr + "&user2=" + converserName, { }, function(data){
                var mes;
				if (data == null ){
                    alert('Message retrieval failed.');
				} else {
                    if (data.messages == null){
                        return;
                    }
                    if (data.messages.length == 0){
                        return;
                    }
                    else {
                        page._lastReceivedTime = data.messages[data.messages.length - 1].time;
                    }
                    for (var mes in data.messages){
                        if (page._conversations[converserName] != null){
                            if (data.messages[mes].id > page._conversations[converserName]._lastid){
                                page._conversations[converserName].appendBody(data.messages[mes].message);

                                if (page._activeConversation = page._conversations[converserName]){
                                    page._bodyDiv.innerHTML = page._activeConversation.getBody();
                                }
                                page._conversations[converserName]._lastid = data.messages[mes].id;
                            }
                        }
                    }
				}
			}
		);

		return this._conversations[converserName];
	},
	
	joinChatRoom:function(chatRoomName)
	{
	    if (chatRoomName == null){
            return;
        }
		/* this._chatRooms[chatRoomName] = new ChatRoom( chatRoomName );
		this._onConversationCreate(chatRoomName, true); */

        var curusr = this._myName;
        var page = this;
        $.post("http://iain.homelinux.com:8000/data/connect?username=" + curusr + "&chatroom=" + chatRoomName, { }, function(data){
				if (data == null ){
                    alert('Error joining room.');
                    return null;
				} 
                if (data.status == "That user is banned from that chatroom"){
                    alert('You are banned from that chatroom!');
                    this._chatRooms[chatRoomName] = null;
                    return null;
                }
        		page._chatRooms[chatRoomName] = new ChatRoom( chatRoomName, page);
		        page._onConversationCreate(chatRoomName, true);
			});
			
		return this._chatRooms[chatRoomName];
	},
	
	deleteConversation:function ( converserName, isChatRoom )
	{
		if (isChatRoom)
		{
			for (var i in this._chatRooms)
			{
				if (this._chatRooms[i].getTarget() == converserName)
				{
					$.post("http://iain.homelinux.com:8000/data/disconnect?username=" + this._myName + "&chatroom=" + converserName, { }, function(data){
						if (data == null ){
							alert('Error leaving room.');
						} 
					});
				
					this._onConversationDestroy(converserName, isChatRoom);
					this._chatRooms[i].destroy();
					delete this._chatRooms[i];
                    this._lastid = -1;
				}
			}
		}
		else
		{
            $.post("http://iain.homelinux.com:8000/data/convclose?user1=" + this._myName + "&user2=" + converserName, {}, {});
			for (var i in this._conversations)
			{
				if (this._conversations[i].getTarget() == converserName)
				{
					this._onConversationDestroy(converserName, isChatRoom);
					this._conversations[i].destroy();
					delete this._conversations[i];
				}
			}
		}
	},


	pollServer:function ()
	{
		var messages;
        var msgs;
        var page = this;
        var curusr = document.getElementById("username").value;

        try {
            var lrt = this._lastReceivedTime.replace(" ", "-");
        }
        catch (_) {
            var lrt = "-1"
        }
		$.post("http://iain.homelinux.com:8000/data/get_messages?username=" + curusr + "&last=" + lrt, {
                    
			}, function(data){
                var mes;
				if (data == null ){
                    alert('Message retrieval failed.');
				} else {
                    messages = data.messages;
                    if (messages.length == 0){
                        return;
                    }
                    else {
                        page._lastReceivedTime = data.messages[data.messages.length - 1].time;
                    }
                    if (data.messages != null){
                        for (var mes in data.messages){
                            var mesConversation = page.findConversation(data.messages[mes].ufrom);
                            if (mesConversation != null){
                                if (data.messages[mes].id > page._lastid){
									page.newData = true;
                                    mesConversation.appendBody(data.messages[mes].message);
                                    page._lastid = data.messages[mes].id;
                                }
                            }
                            else {
                                if (data.messages[mes].id != 0){
                                    //page.createConversation(data.messages[mes].ufrom);
                                    page.createConversation(data.messages[mes].ufrom).appendBody(data.messages[mes].message);
                                    page._lastid = data.messages[mes].id;
                                }
                                //page.createConversation(data.messages[mes].ufrom).appendBody(data.messages[mes].message);
                            }
                        }
                    }
				}
			}
		);
		
		for (var i in this._chatRooms)
		{
			if (this._chatRooms[i].getData()) page.newData = true;
		}
		
		if (this._activeConversation != null) 
		{
			this._bodyDiv.innerHTML = this._activeConversation.getBody();
			if (this.newData)
			{
				this._bodyDiv.scrollTop = this._bodyDiv.scrollHeight;
				this.newData = false;
			}
			
		}
	},

	findConversation:function (sender)
	{
		return this._conversations[sender];
		return null;
	},

	activateConversation:function (converserName, isChatRoom)
	{
		if (isChatRoom)
		{
			if (this._chatRooms[converserName] == null) return;
				
			if (this._activeConversation != null)
			{	
				this._activeConversation.saveSendText(this._sendDiv.value);
			}	
					
			this._activeConversation = this._chatRooms[converserName];
					
			this._bodyDiv.innerHTML = this._activeConversation.getBody();
			this._sendDiv.value = this._activeConversation.getSendText();
					
			this._onConversationActivate(converserName, isChatRoom);
		}
		else
		{
			if (this._conversations[converserName] == null) return;
					
			if (this._activeConversation != null)
			{	
				this._activeConversation.saveSendText(this._sendDiv.value);
			}	
					
			this._activeConversation = this._conversations[converserName];
					
			this._bodyDiv.innerHTML = this._activeConversation.getBody() ;
			this._sendDiv.value = this._activeConversation.getSendText();
					
			this._onConversationActivate(converserName, isChatRoom);
		}
	},
	
	sendMessage:function ()
	{
		if (this._activeConversation.isChatRoom)
		{
			$.post("http://iain.homelinux.com:8000/data/send_chatroom_message?" + "ufrom=" + this._myName + "&chatroom=" + this._activeConversation.getTarget() + "&message=" + this._sendDiv.value, {
						
				},function(data){
					
					if (data == null ){
						alert('An error occured, please contact administrator.');
					} else {
						if (data.status != "OK"){
							alert('Failed to send message. ' + data.status);
						}
					}
				}
			);
		}
		else
		{
			$.post("http://iain.homelinux.com:8000/data/send_message?" + "userfrom=" + this._myName + "&userto=" + this._activeConversation.getTarget() + "&message="+ this._sendDiv.value.replace('&','%26'), {
						
				},function(data){
					
					if (data == null ){
						alert('An error occured, please contact administrator.');
					} else {
						if (data.status != "success"){
							alert('Failed to send message. ' + data.status);
						}
					}
				}
			);
		}
	
		this._sendDiv.value = "";
		this._activeConversation.saveSendText("");
	}
}
