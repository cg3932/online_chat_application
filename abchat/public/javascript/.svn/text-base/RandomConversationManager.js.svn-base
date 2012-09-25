/*
Used to initiate a random conversation
Pierre-Alexandre Bastarache Roberge	
March 5th 2011
*/

//Params
//myName : the loged-in user.
//conversationManager : the manager for all conversations
function RandomConversationManager(myName, conversationManager)
{
	this.conversationManager = conversationManager;
	this.user = myName;
}

RandomConversationManager.prototype=
{
	startRandomChat:function()
	{
		self = this;
		$.post("http://iain.homelinux.com:8000/data/random_chat?username=" + this.user, {}, 
        function(data){
            if (data == null){
                alert("Error trying to start random chat");
            }
            else {
                if (data.status == "Connected"){
					self.conversationManager.createConversation(data.name);
                }
                else {
                    if (data.status == "Waiting"){
                        1+1;
                        //alert("Waiting for another user");
                    }
                    else {
                        alert("Error trying to start random chat");
                    }
                }
            }
        });
	}
}
