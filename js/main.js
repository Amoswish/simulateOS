const memory = 10000
const timeslice = 100
const readylevel = 4//一共多少个优先级
const readyquerysize = 4
const everyreadyquerysize =4
const newquerysize = 4
const blockquerysize = 4
//init后
var readyquery = []
//创建二维readyquery数组
// var ab = []
for(let i = 0;i<readylevel;i++){
	var a = []
	readyquery.push(a)
}

const runquery = []//单核
const blockquery = []
const newquery = []
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
		newquery.push(newpcb)
		let newquerydiv = "<div class = 'newprocess'" + "name='" + newpcb.id.toString +"' >"+ newpcb.id.toString() +"  state  "+newpcb.state.toString()+"</div>"
		$(".newquery").append(newquerydiv)
		console.log(newquery.length)
		pid = pid + 1
	}
	else{
		alert("队列已满，请等待")
	}
}
function run(){
	//将阻塞队列进行处理
	if(blockquery.length>0){
		for (blockprocess in blockquery){
			blockprocess.blocktime = blockprocess.blocktime - timeslice
			if(blockprocess.blocktime <= 0){
				for(let i = blockprocess.priority;i>0;i--){
					if(i == 1){
							if(readyquery[1].length >= readyquerysize){
								//应该加入阻塞队列，但这里直接非正常exit
								alert("内存不够大，非正常exit")
							}
						break
					}
					if(readyquery[i-1].length<readyquerysize){
						readyquery[i-1].push(blockprocess)
					}
				}
			}
		}
	//判断runquery
	if(runquery.length==1){
		let nowprocess = runquery.pop()
		nowprocess.runtime = nowprocess.runtime - timeslice
		nowprocess.blocktime = nowprocess.blocktime - timeslice
		if(nowprocess.blocktime <=0){
			if(blockquery.length<blockquerysize){
				blockquery.push(nowprocess)
			}
			else{
				alert("内存不够大，非正常exit")
			}
		}
		for(let i = nowprocess.priority;i>0;i--){
			if(i == 1){
				if(readyquery[1].length >= readyquerysize){
					//应该加入阻塞队列，但这里直接非正常exit
					alert("内存不够大，非正常exit")
				}
				break
			}
			if(readyquery[i-1].length<readyquerysize){
				readyquery[i-1].push(nowprocess)
			}
		}
	}

	}
	//重新将就绪队列的进程加入到运行队列
	for(let i = readylevel;i>0;i++){
		console.log(readyquery);
		if(typeof(readyquery[i]) != "undefined"){
			if(readyquery[i].length>0){
				runquery.push(readyquery[i].pop())
				break
			}
		}
		else break
	}
	//将创建队列加入到就绪队列
	if(newquery.length>0){
		let temppcb = newquery.pop()
		if(readyquery[temppcb.priority-1].length<readyquerysize){
			temppcb.state="ready"
			readyquery[temppcb.priority-1].push(temppcb)
			console.log(readyquery);
			let readyquerydiv = "<div class = 'readyprocess'>"+ temppcb.id.toString() +" state "+temppcb.state.toString()+"</div>"
			let tempstring = ".readyquerylevel"+temppcb.priority.toString()
			$(tempstring).append(readyquerydiv)
			let needdeletedpidstring = "[name='" + temppcb.id.toString + "']"
			$("div").remove(needdeletedpidstring)
		}
	}
}
