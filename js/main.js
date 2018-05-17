const memory = 10000
const readylevel = 4//一共多少个优先级
const readyquerysize = 4
const everyreadyquerysize =4
const newquerysize = 4
const blockquerysize = 4
const runquerysize = 1
//init后
let b = []
//创建二维readyquery数组
// var ab = []
for(let i = 0;i<readylevel;i++){
	let a = []
	b.push(a)
}
const readyquery = [[],[],[],[]]
const timeslice = [100,100,100,100]
const runquery = []//单核
const blockquery = []
const newquery = []
const exitquery = []
//动态判断运行的变量
var nowreadylevel1 = 0
var nowreadylevel2 = 0
var nowreadylevel3 = 0
var nowreadylevel4 = 0
var nownewquery = 0
var nowblockquery = 0
//当前进程的总共的pid
var pid = 0
function pcb(priority,runtime,isblock,blocktime,blocklasttime){
	let o ={
		id: pid, 
		size:10,
		isblock:isblock,
		blocktime:blocktime,
		blocklasttime:blocklasttime,
		runtime:runtime,
		priority:priority,
		state:"new",
		create:function(priority,runtime,isblock,blocktime,blocklasttime){//size,runtime,priority,blocktime
			console.log(arguments.length)
			switch(arguments.length){
				case 0:
					return 
					break
				case 1://size
					o.size = arguments[0]
					return 
					break
				case 2://size runtime
					o.size = arguments[0]
					o.runtime = arguments[1]
					return 
					break
				case 3://size,runtime,block
					o.size = arguments[0]
					o.runtime = arguments[1]
					o.isblock = true
					o.blocktime = arguments[2]
			}
		}
	}
	return o;
}
function init(){
	//创建就绪队列
	
}
function createprocess(priority,runtime,isblock,blocktime,blocklasttime){
	console.log("create")
	if(newquery.length<newquerysize){
		let newpcb = pcb(priority,runtime,isblock,blocktime,blocklasttime)
		newquery.unshift(newpcb)
		creatediv("newquery","newprocess",newpcb)
		// let newquerydiv = "<div class = 'newprocess'" + "name='" + newpcb.id.toString +"' >"+ newpcb.id.toString() +"  state  "+newpcb.state.toString()+"</div>"
		// $(".newquery").append(newquerydiv)
		pid = pid + 1
	}
	else{
		alert("队列已满，请等待")
	}
}
function disposeblockquery(){
	//将阻塞队列进行处理
	if(blockquery.length>0){
		for (let j = 0;j<blockquery.length;j++){
			blockprocess  = blockquery[j]
			blockprocess.blocklasttime = blockprocess.blocklasttime - timeslice
			if(blockprocess.blocklasttime <= 0){
				//阻塞完成
				for(let i = blockprocess.priority;i>0;i--){
					if(i == 1){
						if(readyquery[0].length >= readyquerysize){
							//应该加入阻塞队列，但这里直接非正常exit
							alert("内存不够大，非正常exit")
							blockquery.pop()
							blockprocess.state = "exit"
							exitquery.push(blockprocess)
							deletediv(blockprocess)
							creatediv("exitquery","exitprocess",blockprocess)
						}
						else {
							blockquery.pop()
							blockprocess.state="ready"
							blockprocess.isblock = "false"
							readyquery[0].push(blockprocess)
							deletediv(blockprocess)
							createreadeydiv("readyquerylevel","readyprocess",blockprocess)
							break
						}
					}
					else if(readyquery[i-2].length<readyquerysize){
						blockquery.pop()
						blockprocess.state="ready"
						blockprocess.isblock = "false"
						readyquery[i-2].push(blockprocess)
						deletediv(blockprocess)
						createreadeydiv("readyquerylevel","readyprocess",blockprocess)
					}
				}
			}
		}
	}
}
function disposerunquery(){
		//判断runquery
	console.log(runquery);
	if(runquery.length <= runquerysize && runquery.length > 0){
		let nowprocess = runquery.pop()
		nowprocess.runtime = nowprocess.runtime - timeslice[nowprocess.priority-1]
		if(nowprocess.isblock == "true"){
			nowprocess.blocktime = nowprocess.blocktime - timeslice
		}
		if(nowprocess.blocktime <=0 && nowprocess.isblock == "true"){
			if(blockquery.length<blockquerysize){
				nowprocess.state = "block"
				blockquery.push(nowprocess)
				deletediv(nowprocess)
				creatediv("blockquery","blockprocess",nowprocess)
			}
			else{
				alert("内存不够大，非正常exit")
				nowprocess.state = "exit"
				exitquery.push(nowprocess)
				deletediv(nowprocess)
				creatediv("exitquery","exitprocess",nowprocess)
			}
		}
		else{
			if(nowprocess.runtime<=0){
				//运行结束
				nowprocess.state = "exit"
				exitquery.push(nowprocess)
				deletediv(nowprocess)
				creatediv("exitquery","exitprocess",nowprocess)
			}
			else{
					//时间片轮转结束，回到就绪队列
					for(let i = nowprocess.priority;i>0;i--){
						if(i == 1){
							if(readyquery[0].length >= readyquerysize){
								//应该加入阻塞队列，但这里直接非正常exit
								alert("内存不够大，非正常exit")
								nowprocess.state = "exit"
								exitquery.push(nowprocess)
								deletediv(nowprocess)
								creatediv("exitquery","exitprocess",nowprocess)
							}
							else{
								readyquery[0].push(nowprocess)
								deletediv(nowprocess)
								createreadeydiv("readyquerylevel","readyprocess",nowprocess)
								break
							}
						}
						else if(readyquery[i-2].length<readyquerysize){
							readyquery[i-2].push(nowprocess)
							deletediv(nowprocess)
							createreadeydiv("readyquerylevel","readyprocess",nowprocess)
						}
					}
			}
		}
	}
}
function readyTorun(){
	//重新将就绪队列的进程加入到运行队列
	for(let i = readylevel-1;i>=0;i--){
		//  console.log(readyquery[i][0])
		if(typeof(readyquery[i][0]) == "object" ){
			console.log(i);
			if(readyquery[i].length>0){
				let temprunpcb = readyquery[i].shift()
				temprunpcb.state = "run"
				runquery.push(temprunpcb)
				deletediv(temprunpcb)
				creatediv("runquery","runprocess",temprunpcb)
				break
			}
		}
		// else break
	}
}
function createtoready(){
	if(newquery.length>0){
		let temppcb = newquery.pop()
		if(readyquery[temppcb.priority-1].length<readyquerysize){
			// readyquery[temppcb.priority-1]
			temppcb.state="ready"
			readyquery[temppcb.priority-1].push(temppcb)
			console.log(readyquery);
			deletediv(temppcb)
			createreadeydiv("readyquerylevel","readyprocess",temppcb)
			// let readyquerydiv = "<div class = 'readyprocess'>"+ temppcb.id.toString() +" state "+temppcb.state.toString()+"</div>"
			// let tempstring = ".readyquerylevel"+temppcb.priority.toString()
			// $(tempstring).append(readyquerydiv)
			
			// let needdeletedpidstring = "[name='" + temppcb.id.toString + "']"
			// $("div").remove(needdeletedpidstring)
		}
		else newquery.push(temppcb)
	}
}
function run(){
	//处理阻塞队列
	disposeblockquery()
	//对运行队列进行处理
	disposerunquery()
	readyTorun()
	//将创建队列加入到就绪队列
	createtoready()
	
}
function createreadeydiv(fatherclassname,divclassname,neededcreatepcb){
	//通过classname加入div
	let neededcreatediv = "<div class = '"+divclassname+"' "+"name='"+neededcreatepcb.id+"'"
									+"value='"+neededcreatepcb.priority +"-"//priority,runtime,isblock,blocktime,blocklasttime
											  +neededcreatepcb.runtime +"-"
											  +neededcreatepcb.isblock +"-"
											  +neededcreatepcb.blocktime +"-"
											  +neededcreatepcb.blocklasttime		  
								+"'>"
							+ "<div class='processtitle'>进程id"+neededcreatepcb.id.toString()+"</div>" 
							+ "<div class='processcontain'>state "+neededcreatepcb.state.toString()+"</div>"
							+ "<button class='btn btn-info processinfo' onclick='showdetail(this)'>详情</button> "
						  +"</div>"
	let tempstring = "."+fatherclassname.toString() + neededcreatepcb.priority.toString()
	$(tempstring).append(neededcreatediv)
}
{/* <div class = "newprocess"> */}
{/* <div class="processtitle">进程id</div> */}
{/* <div class="processcontain">state</div> */}
{/* <button class=" btn btn-info processinfo">详情</button> */}
{/* </div> */}
function creatediv(fatherclassname,divclassname,neededcreatepcb){
	//通过classname加入div
	let neededcreatediv = "<div class = '"+divclassname+"' "+"name='"+neededcreatepcb.id+"'"
									+"value='"+neededcreatepcb.priority +"-"//priority,runtime,isblock,blocktime,blocklasttime
											  +neededcreatepcb.runtime +"-"
											  +neededcreatepcb.isblock +"-"
											  +neededcreatepcb.blocktime +"-"
											  +neededcreatepcb.blocklasttime
								+"'>"
							+ "<div class='processtitle'>进程id"+neededcreatepcb.id.toString()+"</div>" 
							+ "<div class='processcontain'>state "+neededcreatepcb.state.toString()+"</div>"
							+ "<button class='btn btn-info processinfo' onclick='showdetail(this)'>详情</button>"
						+"</div>"
	let tempstring = "."+fatherclassname.toString()
	$(tempstring).append(neededcreatediv)
}
function deletediv(needdeletepcb){
	//通过pcb的id查找name属性删除
	// let a = document.getElementsByName(needdeletepcb.id.toString())
	// a.parentNode.removeChild(a);
	let needdeletedpidstring = "[name='" + needdeletepcb.id.toString() + "']"
	$("div").remove(needdeletedpidstring)
	return 1
}