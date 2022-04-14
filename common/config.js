//弹出消息提示框
const ShowMessage=(Message)=>{
	uni.showToast({		
		title:Message,        
		icon:'none',
		duration:3000		
	});	
};
//播放操作提示音 
const PopAudioContext=(IsSuccess)=>{
	let AudioContext = uni.createInnerAudioContext();
	AudioContext.autoplay = true;   
	// if(IsSuccess)		
	// {
	// 	AudioContext.src = '/static/success.mp3';
	// }
	// else
	// {
	// 	AudioContext.src = '/static/warning.wav';
	// }	
	// AudioContext.onPlay(() => {
	//     //console.log('开始播放');
	// });
	// AudioContext.onPause(() =>{
	// 	//console.log('播放暂停');
	// });
	// AudioContext.onStop(() =>{
	// 	//console.log('播放停止');
	// });
	// AudioContext.onEnded(() =>{
	// 	AudioContext.destroy();
	// 	//console.log('播放结束');
	// });
	// AudioContext.onWaiting(() =>{
	// 	//console.log('播放加载中');
	// });
	// AudioContext.onError((result) => {
	//   AudioContext.destroy();
	//   //console.log(result.errMsg);
	//   //console.log(result.errCode);
 //    });
}; 
  
//获取选中的日期格式化
 const DateFormat=(type)=>{
 	const CurrentDate = new Date();
 	let Year = CurrentDate.getFullYear();
 	let Month = CurrentDate.getMonth() + 1;
 	let Day = CurrentDate.getDate();
 	let Hour = CurrentDate.getHours();
 	let Minute = CurrentDate.getMinutes();
 	let Second = CurrentDate.getSeconds();
 
 	if (type === 'start') {
 		Year = Year - 60;
 	} else if (type === 'end') {
 		Year = Year + 2;
 	}
 	Month = Month > 9 ? Month : '0' + Month;;
 	Day = Day > 9 ? Day : '0' + Day;
 	if (type != '') {
 		return `${Year}-${Month}-${Day}`;
 	}
 	return `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
 };
 
export default {		
	ShowMessage,
	PopAudioContext,
	DateFormat
}