export function GetRequest(url,data){
	var promise = new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl +url,
			data:data,
			method:'GET',
			timeout:5000,
			success: (res) => {
				resolve(res);
			},
			fail: (e) => {
				reject(e)
			}
		})
	});
	return promise;
}

export function PostRequest(url,data){
	var promise = new Promise((resolve,reject)=>{
		uni.request({
			url:baseUrl+url,
			data:data,
			method:"POST",
			timeout:10000,
			success: (res) => {
				resolve(res);
			},
			fail: (e) => {
				reject(e)
			}
		})
	});
	return promise
}