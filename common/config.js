const ShowMessage=(Message)=>{
	uni.showToast({		
		title:Message,        
		icon:'none',
		duration:3000		
	});	
};//弹出消息提示框
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
	  //console.log('开始播放');
	});
	AudioContext.onError((result) => {
	  console.log(result.errMsg);
	  console.log(result.errCode);
    });
};//播放操作成功失败提示音    
export default {		
	ShowMessage,
	PopAudioContext
}