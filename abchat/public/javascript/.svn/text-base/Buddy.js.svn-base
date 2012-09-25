/* 
 * @author Farzad Towhidi
 * @param user json object user
*/
function Buddy(username){
	this.username = username;
	
	var tableRow = document.createElement("tr");
	var tableColumn = document.createElement("td");
	
	var buddyContainer = document.createElement("div");
	buddyContainer.className = "buddyContainer";
	
	/*// TODO: add online/offline button
	var buddyStatus = document.createElement("p");
	buddyStatus.className = "buddyStatus";*/
	
	var buddyName = document.createElement("div");
	buddyName.className = "buddyName";
	buddyName.textContent = username;
	
	//buddyContainer.appendChild(buddyStatus);
	buddyContainer.appendChild(buddyName);
	tableColumn.appendChild(buddyContainer);
	tableRow.appendChild(tableColumn);
	
	//TODO Refactor this so there's an interface to the manager instead of just guessing a manager object will be there.
	tableRow.onclick = function() { if (manager.findConversation(username) == null) manager.createConversation(username); manager.activateConversation(username); };
	
    tableRow.id= username;

	return tableRow;
}
