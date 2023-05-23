
export function GetRequest(url,data){
	var baseUrl = uni.getStorageSync('OtherUrl')
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

// export function MyShowModel(){
// 	var promise = new Promise((resolve,reject)=>{
// 		uni.showModal({
// 			title:'提示',
// 			content:'当前页面数据已改变，但未保存，是否退出？',
// 			success: function (res) {
// 				if (res.confirm) {
// 					// console.log('用户点击确定');
// 					resolve('确认')
// 				} else if (res.cancel) {
// 					// console.log('用户点击取消');
// 					resolve('取消')
// 				}
// 			}
// 		})
// 	})
// 	return promise
// }

export function PostRequest(url,data){
	var promise = new Promise((resolve,reject)=>{
		uni.request({
			url:url,
			data:data,
			method:"POST",
			timeout:5000,
			success: (res) => {
				console.log(res)
				resolve(res);
			},
			fail: (e) => {
				reject(e)
			}
		})
	});
	return promise
}