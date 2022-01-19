//Calls the getNewUsername function once the page finishes loading
getNewUsername();

//Creates an event listener that calls the changeStyle function on option change
document.getElementById("message-input").addEventListener("change", checkCommand);
function checkCommand()
{
    let message = document.getElementById("message-input").value
    if(message == "/name")
    changeUsername()
}

//Retrieves theme index from localStorage
function getNewUsername()
{
    //Gets saved value from LocalStorage
    var savedUserName = localStorage.getItem('userName');

    //Calls the setUsername function
    setUsername(savedUserName);
}

//Applies theme based on user's drop down selection
function changeUsername()
{
    //Stores the new drop down selection index
    let userName = prompt("User Name: ")
    if(userName == null || userName == "")
    {
        userName = "Unnamed User"
    }
    window.location.reload();
    //Calls the setUsername function
    setUsername(userName);
}

//Applies theme based on saved index
function setUsername(userName)
{
    //Saves the value of selected index to localStorage
    localStorage.setItem('userName', userName);
}