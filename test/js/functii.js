var x = "llllll";
console.log(x);

var textul = document.getElementById("divvv");
console.log(textul);

function addbackground()
{
	this.style.backgroundColor = "red";
	console.log("sdSAsadsdsa")
}
textul.addEventListener("mouseover", addbackground);
textul.addEventListener("mouseleave", function(){this.style.backgroundColor = null;})

/*$("#divvv").hover(
function()
{
    $(this).css("background-color", "yellow");
}, 
function()
{
    $(this).css("background-color", "");
});*/