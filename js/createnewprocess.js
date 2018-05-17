function createnewprocess(){
	let priority = $("[name='createpriority'] option:selected").val()
	// let runtime = $("[name='runtime'] option:selected").val()
	let runtime = document.getElementsByName("runtime")[1].value
	let isblock = document.getElementsByName("createisblock")[1].value
	let blocktime = document.getElementsByName("blocktime")[1].value
	let blocklasttime = document.getElementsByName("blocklasttime")[1].value
	createprocess(priority,runtime,isblock,blocktime,blocklasttime)
	console.log(isblock)
}
