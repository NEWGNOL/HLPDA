const ShowMessage=(Message)=>{
	uni.showToast({		
		title:Message,        
		icon:'none',
		duration:3000		
	});	
};//弹出消息提示框
const PopAudioContext=()=>{
	let AudioContext = uni.createInnerAudioContext();
	AudioContext.autoplay = true;
	AudioContext.src = '/static/warning.wav';
	AudioContext.onPlay(() => {
	  //console.log('开始播放');
	});
	AudioContext.onError((res) => {
	  console.log(res.errMsg);
	  console.log(res.errCode);
    });
};//播放错误提示音    
export default {		
	ShowMessage,
	PopAudioContext
}