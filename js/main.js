const memory = 10000
const timeslice = 100
const readylevel = 4//一共多少个优先级
const readyquerysize = 4
const everyreadyquerysize =4
const newquerysize = 4
const blockquerysize = 4
//init后
const readyquery = [readylevel][readyquerysize]
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
function pcb(priority,runtime,isblock,blocktime,blocklasttime){
	let o ={
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
	if(nownewquery<newquerysize){
		let newpcb = pcb(priority,runtime,isblock,blocktime,blocklasttime)
		newquery.push(newpcb)
	}
	else{
		alert("创建失败")
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
			break;
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
		if(readyquery[i].length>0){
			runquery = readyquery[i].pop()
			break
		}
	}
}
