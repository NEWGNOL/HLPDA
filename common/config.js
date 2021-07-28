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
	if(IsSuccess)		
	{
		AudioContext.src = '/static/success.mp3';
	}
	else
	{
		AudioContext.src = '/static/warning.wav';
	}	
	AudioContext.onPlay(() => {
	    console.log('开始播放');
	});
	AudioContext.onPause(() =>{
		console.log('播放暂停');
	});
	AudioContext.onStop(() =>{
		console.log('播放停止');
	});
	AudioContext.onEnded(() =>{
		AudioContext.destroy();
		console.log('播放结束');
	});
	AudioContext.onWaiting(() =>{
		console.log('播放加载中');
	});
	AudioContext.onError((result) => {
	  AudioContext.destroy();
	  console.log(result.errMsg);
	  console.log(result.errCode);
    });
};   
export default {		
	ShowMessage,
	PopAudioContext
}