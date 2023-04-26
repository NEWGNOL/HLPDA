import {GetRequest,PostRequest} from '@/request/request.js'
import config from '@/common/config.js'

//绑定条码
export async function bindingCode(data){
	var api = ''
	try{
		var result = await PostRequest(api,data)
	}catch(e){
		config.ShowMessage(e.message)
	}
}

//解绑条码
export async function unBindingCode(data){
	var api = ''
	try{
		var result = await PostRequest(api,data)
	}catch(e){
		config.ShowMessage(e.message)
	}
}