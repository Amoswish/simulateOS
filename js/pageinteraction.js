$(document).ready(function(){
$("[name='createisblock']").change(function (){
	console.log($(this).val())
	if($(this).val() == "false"){
		$("[name='blocktime']").css("display","none")
		$("[name='blocklasttime']").css("display","none")
	}
	else if($(this).val() == "true"){
		$("[name='blocktime']").css("display","")
		$("[name='blocklasttime']").css("display","")
	}
	console.log($(this).val())
})
})
function showdetail(buttonobject){
	let process  = buttonobject.parentNode
	console.log(process.parentNode)
	processinfo = process.attributes[2].nodeValue.split("-")
	console.log(processinfo);
	$(".processdetail-pid").text("pid:"+process.attributes[1].nodeValue)
	processchild = process.childNodes
	$(".processdetail-state").text(processchild[1].textContent)
	$(".processdetail-priority").text("priority:"+processinfo[0])
	$("#modifyruntime").value=processinfo[1]
	$("#modifyruntime").css("display","")
	$("#modifyisblock").value=processinfo[2]
	$("#modifyisblock").css("display","")
	// $(".processdetail-isblock").text("isblock:"+processinfo[2])
	$(".processdetail-blocktime").text("blockstarttime:"+processinfo[3])
	$(".processdetail-blocklasttime").text("blocklasttime:"+processinfo[4])

}