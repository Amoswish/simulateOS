function createnewprocess(){
	let priority = $("[name='createpriority'] option:selected").val()
	let runtime = $("[name='runtime'] option:selected").val()
	let isblock = $("[name='createisblock'] option:selected").val()
	let blocktime = $("[name='blocktime'] option:selected").val()
	let blocklasttime = $("[name='blocklasttime'] option:selected").val()
	createprocess(priority,runtime,isblock,blocktime,blocklasttime)
	console.log(isblock)
}
