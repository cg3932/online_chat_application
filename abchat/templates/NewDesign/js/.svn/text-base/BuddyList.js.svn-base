/* This class is used to create the BuddyList of a registered user
 * @author Farzad Towhidi
 */
function BuddyList(){
	var self = this;

	var buddyListContainer = document.createElement("div");
	buddyListContainer.className = "buddyListContainer";
	
	var horizontalRule1 = document.createElement("div");
	horizontalRule1.className = "horizontalRule";
	
	var buddyListMsg = document.createElement("h3");
	buddyListMsg.textContent = "Online";
	
	var spacer = document.createElement("div");
	spacer.className = "spacer2";
	
	buddyListContainer.appendChild(spacer);
	buddyListContainer.appendChild(buddyListMsg);
	buddyListContainer.appendChild(buddyListMsg);
	buddyListContainer.appendChild(horizontalRule1);
	
	var onlineBuddyTable = document.createElement("table");
	onlineBuddyTable.id = "onlineBudTable";
	buddyListContainer.appendChild(onlineBuddyTable);
	
	
    if (buddyListMsg == null){
        alert('buddy list msg is null!');
    }
	var horizontalRule2 = document.createElement("div");
	horizontalRule2.className = "horizontalRule";
	
	var buddyListMsg2 = buddyListMsg.cloneNode(true);
	buddyListMsg2.textContent = "Offline";
	buddyListContainer.appendChild(buddyListMsg2);
	buddyListContainer.appendChild(horizontalRule2);
	
	var offlineBuddyTable = document.createElement("table");
	offlineBuddyTable.id = "offlineBudTable";
	buddyListContainer.appendChild(offlineBuddyTable);
	
	var intervalTime = 3000;
	setInterval(function(){poll_buddies();}, intervalTime);
	return buddyListContainer;
	
}

function addBuddy(buddyName){
	var buddyTable = document.getElementById("budTable");
	//TODO: call the backend addbuddy function
    post_to_buddyadd(buddyName);
	/*var buddy = new Buddy(buddyName);
	$(buddy).hide();
	buddyTable.appendChild(buddy);
	$(buddy).fadeIn(); */
}

function delBuddy(buddyName){
    post_to_buddydel(buddyName);
}

function confBuddy(buddyName){
    post_to_buddyconf(buddyName);
}

function poll_buddies(){
	var curusr = document.getElementById("username").value;
	var buddy, bud;
	var answer = true;
	$.post("http://iain.homelinux.com:8000/data/get_buddies?username=" + curusr, {},
		function(data){
			var onlineBuddyTable = document.getElementById("onlineBudTable");
			var offlineBuddyTable = document.getElementById("offlineBudTable");
			for(i in data.buddies){
				buddy = data.buddies[i];
				if(!data.confirm[i]){
					answer = confirm("Accept friend request from "+buddy+"?");
				}
				if(answer){
					//TODO connect to database and set the confirm field to true
					if(data.online[i]){
						if(!data.confirm[i]){
							$.post("http://iain.homelinux.com:8000/data/confirm_buddy?user1=" + buddy + "&user2=" + curusr, {},function(data){});
							bud = new Buddy(buddy);
							bud.online = data.online[i];
							$(bud).hide();
							onlineBuddyTable.appendChild(bud);
							$(bud).fadeIn();
							continue;
						}
                        // Buddy in table?
                        // Double-writes buddies who are confirmed on sign-on
						bud = document.getElementById(buddy);
						if(bud.parentNode.id==offlineBuddyTable.id){
							offlineBuddyTable.removeChild(bud);
							onlineBuddyTable.appendChild(bud);
						}
					}else{
						if(!data.confirm[i]){
							$.post("http://iain.homelinux.com:8000/data/confirm_buddy?user1=" + buddy + "&user2=" + curusr, {},function(data){});
							bud = new Buddy(buddy);
							bud.online = data.online[i];
							$(bud).hide();
							offlineBuddyTable.appendChild(bud);
							$(bud).fadeIn();
							continue;
						}
						bud = document.getElementById(buddy);
						if(bud.parentNode.id==onlineBuddyTable.id){
							onlineBuddyTable.removeChild(bud);
							offlineBuddyTable.appendChild(bud);
						}
					}
					bud.online = data.online[i];
				}else{
					//TODO: connect to database and remove declined buddy 
					$.post("http://iain.homelinux.com:8000/data/del_buddy?user1=" + buddy + "&user2=" + curusr, {},function(data){});
				}
			}

            // Iain is not a great Javascript programmer
            // Remove buddies from the table if they were not in the JSON
            var i = 0;
            var j = 0;
            var found = 0;
            var elem;
            while (onlineBuddyTable.children.item(i) != null){
                found = 0;
                for (j in data.buddies){
                    if (onlineBuddyTable.children.item(i).id == data.buddies[j]){
                        found = 1;
                        break;
                    }
                }
                if (found == 0){
                    onlineBuddyTable.removeChild(onlineBuddyTable.children.item(i));
                }
                i++;
            }
            while (offlineBuddyTable.children.item(i) != null){
                found = 0;
                for (j in data.buddies){
                    if (offlineBuddyTable.children.item(i).id == data.buddies[j]){
                        found = 1;
                        break;
                    }
                }
                if (found == 0){
                    offlineBuddyTable.removeChild(offlineBuddyTable.children.item(i));
                }
                i++;
            }
		}
	);
}

function post_to_buddyadd(buddyName){
    var curusr = document.getElementById("username").value;
    $.post("http://iain.homelinux.com:8000/data/add_buddy?user_initiate=" + curusr + "&user_target=" + buddyName, {}, 
        function(data){
            if (data == null){
                alert('Error adding buddy ' + buddyName);
            }
            else {
                if (data.status == "success"){
					if(data.online){
						var buddyTable = document.getElementById("onlineBudTable");
					}else{
						var buddyTable = document.getElementById("offlineBudTable");
					}
                	var buddy = new Buddy(buddyName);
					buddy.online = data.online;
                	$(buddy).hide();
                	buddyTable.appendChild(buddy);
                	$(buddy).fadeIn();
	                /* var buddyTable = document.getElementById("budTable");
                	var buddy = new Buddy(buddyName + '*');
                    buddy.id = buddyName
                	$(buddy).hide();
                	buddyTable.appendChild(buddy);
                	$(buddy).fadeIn(); */
                }
                else {
                    alert("Adding buddy " + buddyName + " failed. " + data.status);
                }
            }
        });
}


function post_to_buddydel(buddyName){
    var curusr = document.getElementById("username").value;
	var buddyList;
    $.post("http://iain.homelinux.com:8000/data/del_buddy?user1=" + buddyName + "&user2=" + curusr, {}, 
        function(data){
            if (data == null){
                alert('Error removing buddy ' + buddyName);
            }
            else {
                if (data.status == "success"){
                    var buddy = document.getElementById(buddyName);
					if(buddy.online){
                   		buddyList = document.getElementById("onlineBudTable");
					}else{
						buddyList = document.getElementById("offlineBudTable");
					}
                    tableRow = buddy;
                    $(buddy).fadeOut();
                    setTimeout(function() {buddyList.removeChild(buddy);},500);
                }
                else {
                    alert("Deleting buddy " + buddyNAme + " failed.  " + data.status);
                }
            }
        });

}


function post_to_getbuddies(){
    var curusr = document.getElementById("username").value;
	var buddyList;
    $.post("http://iain.homelinux.com:8000/data/get_buddies?username=" + curusr, {}, 
        function(data){
            if (data == null){
                alert('Error removing buddy ' + buddyName);
            }
            else {
				for(var i=0; i<data.buddies.length;i++){
                    if (data.confirm[i]){
					    if(data.online[i]){
                       		buddyList = document.getElementById("onlineBudTable");
	    				}else{
		    				buddyList = document.getElementById("offlineBudTable");
			    		}
                    	var buddy = new Buddy(data.buddies[i]);
                	    $(buddy).hide();
                    	buddyList.appendChild(buddy);
                    	$(buddy).fadeIn();
		    			// addBuddy(buddy);
                    }
				}
            }
        });


}


// borked
function post_to_buddyconf(buddyName){
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "http://iain.homelinux.com:8000/data/del_buddy");
    var curusr = document.getElementById("username").value;
    var hiddenfield = document.createElement("input");
    hiddenfield.setAttribute("type", "hidden");
    hiddenfield.setAttribute("name", "user1");
    hiddenfield.setAttribute("value", curusr);
    form.appendChild(hiddenfield);
    var hiddenfield = document.createElement("input");
    hiddenfield.setAttribute("type", "hidden");
    hiddenfield.setAttribute("name", "user2");
    hiddenfield.setAttribute("value", buddyName);
    form.appendChild(hiddenfield);
    document.body.appendChild(form);
    form.submit();

    alert('Removed buddy ' + buddyName);

}
