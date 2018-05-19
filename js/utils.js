function process(pid,priority,runtime,isblock,blocktime,blocklasttime){
	let o ={
		id: pid, 
		size:10,
		isblock:isblock,
		blocktime:blocktime,
		blocklasttime:blocklasttime,
		runtime:runtime,
		numberofruntime:0,
		priority:priority,
		state:0,
	}
	return o;
}
function init(){
	//创建就绪队列
	console.log("sss");
}
function createprocess(pcb){
    let newpcb = process(pcb.id,pcb.priority,pcb.runtime,pcb.isblock,pcb.blocktime,pcb.blocklasttime)
    return newpcb
}
function disposeblockquery(blockquery,readyquery,readyquerysize,exitquery,timeslice,blockquerysize){
	//将阻塞队列进行处理
	if(blockquery.length>0){
		for (let j = 0;j<blockquery.length;j++){
			blockprocess  = blockquery[j]
			blockprocess.blocklasttime = blockprocess.blocklasttime - timeslice[blockprocess.priority-1]
			if(blockprocess.blocklasttime <= 0){
				//阻塞完成
				for(let i = blockprocess.priority;i>0;i--){
					if(i == 1){
						if(readyquery[0].length >= readyquerysize){
							//应该加入阻塞队列，但这里直接非正常exit
							if(blockquery.length<blockquerysize){
								blockquery.shift()
								blockprocess.state = 4
								blockquery.push(blockprocess)
								break
							}
							else{
								alert("阻塞队列不够大，非正常exit")
							}
						}
						else {
							blockquery.shift()
							blockprocess.state=1
							blockprocess.isblock = false
							readyquery[0].push(blockprocess)
							break
						}
					}
					else if(readyquery[i-2].length<readyquerysize){
						blockquery.shift()
						blockprocess.state=1
						blockprocess.isblock = false
						readyquery[i-2].push(blockprocess)
						break
					}
				}
			}
		}
    }
    return {blockquery:blockquery,readyquery:readyquery,exitquery:exitquery}
}
function disposerunquery(runquery,runquerysize,runquerysize,readyquery,readyquerysize,blockquery,blockquerysize,exitquery,timeslice){
		//判断runquery
	if(runquery.length <= runquerysize && runquery.length > 0){
		let nowprocess = runquery.pop()
		nowprocess.runtime = nowprocess.runtime - timeslice[nowprocess.priority-1]
		nowprocess.numberofruntime = nowprocess.numberofruntime + 1
		if(nowprocess.isblock == true && nowprocess.runtime > 0){
			nowprocess.blocktime = nowprocess.blocktime - timeslice[nowprocess.priority-1]
		}
		if(nowprocess.blocktime <=0 && nowprocess.isblock == true){
			if(blockquery.length<blockquerysize){
				nowprocess.state = 3
				blockquery.push(nowprocess)
			}
			else{
				alert("加入不到阻塞队列，阻塞队列不够长，非正常exit")
				nowprocess.state = 4
				exitquery.push(nowprocess)
			}
		}
		else{
			if(nowprocess.runtime<=0){
				//运行结束
				nowprocess.state = 4
				exitquery.push(nowprocess)
			}
			else{
					//时间片轮转结束，回到就绪队列
					for(let i = nowprocess.priority;i>0;i--){
						if(i == 1){
							if(readyquery[0].length >= readyquerysize){
								//应该加入阻塞队列，但这里直接非正常exit
								alert("内存不够大，非正常exit")
								nowprocess.state = 4
								exitquery.push(nowprocess)
							}
							else{
								readyquery[0].push(nowprocess)
								break
							}
						}
						else if(readyquery[i-2].length<readyquerysize){
							nowprocess.priority = nowprocess.priority -1
							readyquery[i-2].push(nowprocess)
							break
						}
					}
			}
		}
    }
    return {runquery:runquery,readyquery:readyquery,blockquery:blockquery,exitquery:exitquery}
}
function readyTorun(readyquery,runquery,readylevel){
	//重新将就绪队列的进程加入到运行队列
	for(let i = readylevel-1;i>=0;i--){
		if(typeof(readyquery[i][0]) == "object" ){
			if(readyquery[i].length>0){
				let temprunpcb = readyquery[i].shift()
				temprunpcb.state = 2
                runquery.push(temprunpcb)
				break
			}
		}
    }
    return {readyquery:readyquery,runquery:runquery}
}
function createtoready(newquery,readyquery,readyquerysize){
	if(newquery.length>0){
		let temppcb = newquery.pop()
		if(readyquery[temppcb.priority-1].length<readyquerysize){
			// readyquery[temppcb.priority-1]
			temppcb.state=1
			readyquery[temppcb.priority-1].push(temppcb)
		}
		else newquery.push(temppcb)
    }
    return {newquery:newquery,readyquery:readyquery}
}