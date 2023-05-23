import {GetRequest,PostRequest} from '@/request/request.js'
import config from '@/common/config.js'

//绑定条码1-1
export async function bindingCodeOne(data){
	var api = uni.getStorageSync('OtherUrl')
	try{
		var result = await PostRequest(api,data)
		return result
	}catch(e){
		// config.ShowMessage('网络错误')
		// Config.PopAudioContext(false);
		return -1
	}
}

export async function bindingCodeTwo(data){
	var api = uni.getStorageSync('OtherUrl')
	try{
		var result = await PostRequest(api,data)
		return result
	}catch(e){
		return -1
	}
}

//解绑条码
export async function unBindingCode(data){
	var api = uni.getStorageSync('OtherUrl')
	try{
		var result = await PostRequest(api,data)
		return result
	}catch(e){
		return -1
	}
}

export async function getRecently(data){
	var api = uni.getStorageSync('OtherUrl')
	try{
		var result = await PostRequest(api,data)
		return result
	}catch(e){
		return -1
	}
}

export async function searchQRCode(data){
	var api = uni.getStorageSync('OtherUrl')
	try{
		var result = await PostRequest(api,data)
		return result
	}catch(e){
		return -1
	}
}