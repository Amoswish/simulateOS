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