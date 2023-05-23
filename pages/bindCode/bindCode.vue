<template>
	<view class="content">
		<view class="code-info">
			<view class="row">
				<view>内&nbsp;&nbsp;盒：</view>
				<view class="border-info">
					<view>{{wrapCode}}</view>
					<view v-show="wrapCode == ''?false:true " @click="clearBtn(1)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
				
			</view>
			<view class="row">
				<view>产品1：</view>
				<view class="border-info">
					<view>{{goodsCode1}}</view>
					<view v-show="goodsCode1 == ''?false:true " @click="clearBtn(2)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
			</view>
			<view class="row" v-show="radio == 0 ?true:false">
				<view>产品2：</view>
				<view class="border-info">
					<view>{{goodsCode2}}</view>
					<view v-show="goodsCode2 == ''?false:true " @click="clearBtn(3)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
				
			</view>
		</view>
		<view style="align-items: center;text-align: center;display: flex;flex-direction: column;">
			<view>
				<uni-data-checkbox v-model="radio" :localdata="selectType" @change="SelectTypeChange"></uni-data-checkbox>
			</view>
		</view>
		<view class="active clear">
			<button type="primary" @click="bindingCodeBtn()">绑定</button>
		</view>
		<view class="clear">
			<button type="warn" @click="clear()">全部清空</button>
		</view>
	</view>
</template>

<script>
	
	import Config from '@/common/config.js'
	import { bindingCodeOne,bindingCodeTwo,unBindingCode } from '@/request/CodeBindingAPI/api.js'
	export default{
		name:"bindCode",
		data(){
			return{
				wrapCode:'',
				goodsCode1:'',
				goodsCode2:'',
				Main: '',
				Receiver: '',
				radio:0,
				selectType:[
					{
						text:"一绑二",
						value:0
					},
					{
						text:"一绑一",
						value:1
					}
				]
			}
		},
		methods:{
			AddListener: function() {
				var me = this;
				var main = plus.android.runtimeMainActivity(); //获取activity    
				var context = plus.android.importClass('android.content.Context'); //上下文    
				var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: doReceive
				});
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				var Intent = plus.android.importClass('android.content.Intent');
				var filter = new IntentFilter();
			
				//针对优博讯安卓PDA-i6300添加监听，其它优博讯的型号应该一样或类似
				filter.addAction("android.intent.ACTION_DECODE_DATA"); //监听扫描 		
				main.registerReceiver(receiver, filter); //注册监听 	
			
				//记录窗体和接收者用于关闭窗体的同时也关闭监听	
				me.Main = main;
				me.Receiver = receiver;
			
				function doReceive(context, intent) {
					plus.android.importClass(intent);
					var Barcode = intent.getStringExtra("barcode_string");
					me.ScanBarCode(Barcode);
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			//扫描条码
			async ScanBarCode(Barcode){
				try{
					let prefix = Barcode.slice(0,2)
				
					//判断是一绑一还是一绑二
					if(this.radio == 0){ //一绑二
						if(prefix == "SL"){
							// console.log(prefix)
							this.wrapCode = Barcode
						}else if(this.goodsCode1 == "" && this.goodsCode2 != Barcode){
							this.goodsCode1 = Barcode
						}else if(this.goodsCode2 == "" && this.goodsCode1 != Barcode){
							this.goodsCode2 = Barcode
						}else if(this.goodsCode1 == Barcode){
							this.goodsCode1 = Barcode
						}else if(this.goodsCode2 == Barcode){
							this.goodsCode2 = Barcode
						}
						else{
							uni.showModal({
								title:"请先删除已有产品标签"
							})
							return
						}
						//已经扫完三个码
						if(this.wrapCode!=''&&this.goodsCode1!=''&&this.goodsCode2!=''){
							uni.showLoading({
								title: '上传中'
							});
							var data ={
								ModuleCode:"TM_QRCodeBindingTwo",
								token:uni.getStorageSync('token'),
								ModuleParam:{
									BoxLabel:this.wrapCode,
									Label1:this.goodsCode1,
									label2:this.goodsCode2,
									userName:uni.getStorageSync('FUserName')
								}
							}
							var result = await bindingCodeTwo(data)
							if(result == -1){
								uni.hideLoading();
								config.ShowMessage('网络错误')
								Config.PopAudioContext(false);
								return
							}
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								uni.hideLoading();
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								return;
							}
							if(ResultCode == 'FAIL'){
								uni.hideLoading();
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);
								return
							}
							let ResultData = result.data.ResultData.data.data0
							console.log(ResultData)
							if(ResultData.code != 0){
								uni.hideLoading();
								Config.ShowMessage(ResultData.Msg);
								Config.PopAudioContext(false);
								return
							}
							
							this.clear()
							uni.hideLoading();
							Config.ShowMessage(ResultData.Msg);
						}
					}else if(this.radio == 1){ //一绑一
						if(prefix == "SL"){
							// console.log(prefix)
							this.wrapCode = Barcode
						}else{
							this.goodsCode1 = Barcode
						}
						
						if(this.wrapCode!=''&&this.goodsCode1!=''){
							uni.showLoading({
								title: '上传中'
							});
							let data = {
								ModuleCode:"TM_QRCodeBindingOne",
								token:uni.getStorageSync('token'),
								ModuleParam:{
									BoxLabel:this.wrapCode,
									Label1:this.goodsCode1,
									userName:uni.getStorageSync('FUserName')
								}
							}
							let result =await bindingCodeOne(data)
							// console.log(uni.getStorageSync('OtherUrl'))
							// console.log(uni.getStorageSync('token'))
							console.log(result)
							if(result == -1){
								uni.hideLoading();
								config.ShowMessage('网络错误')
								Config.PopAudioContext(false);
								return
							}
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								uni.hideLoading();
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								return;
							}
							if(ResultCode == 'FAIL'){
								uni.hideLoading();
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);
								return
							}
							let ResultData = result.data.ResultData.data.data0
							console.log(ResultData)
							if(ResultData.code != 0){
								uni.hideLoading();
								Config.ShowMessage(ResultData.Msg);
								Config.PopAudioContext(false);
								return
							}
							
							this.clear()
							uni.hideLoading();
							Config.ShowMessage(ResultData.Msg);
						}
					}
				}catch(e){
					console.log(e)
					uni.hideLoading();
					Config.ShowMessage();
					Config.PopAudioContext(false);
				}
			},
			async bindingCodeBtn(){
				try{
					if(this.radio == 0){ //一绑二
						//已经扫完三个码
						if(this.wrapCode!=''&&this.goodsCode1!=''&&this.goodsCode2!=''){
							var data ={
								ModuleCode:"TM_QRCodeBindingTwo",
								token:uni.getStorageSync('token'),
								ModuleParam:{
									BoxLabel:this.wrapCode,
									Label1:this.goodsCode1,
									label2:this.goodsCode2,
									userName:uni.getStorageSync('FUserName')
								}
							}
							var result = await bindingCodeTwo(data)
							if(result == -1){
								uni.hideLoading();
								config.ShowMessage('网络错误')
								Config.PopAudioContext(false);
								return
							}
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								uni.hideLoading();
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								return;
							}
							if(ResultCode == 'FAIL'){
								uni.hideLoading();
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);
								return
							}
							let ResultData = result.data.ResultData.data.data0
							console.log(ResultData)
							if(ResultData.code != 0){
								uni.hideLoading();
								Config.ShowMessage(ResultData.Msg);
								Config.PopAudioContext(false);
								return
							}
							
							this.clear()
							uni.hideLoading();
							Config.ShowMessage(ResultData.Msg);
						}else{
							Config.ShowMessage('条码不能为空');
							Config.PopAudioContext(false);
						}
					}else if(this.radio == 1){ //一绑一
						if(this.wrapCode!=''&&this.goodsCode1!=''){
							uni.showLoading({
								title: '上传中'
							});
							let data = {
								ModuleCode:"TM_QRCodeBindingOne",
								token:uni.getStorageSync('token'),
								ModuleParam:{
									BoxLabel:this.wrapCode,
									Label1:this.goodsCode1,
									userName:uni.getStorageSync('FUserName')
								}
							}
							let result =await bindingCodeOne(data)
							if(result == -1){
								uni.hideLoading();
								config.ShowMessage('网络错误')
								Config.PopAudioContext(false);
								return
							}
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							if(ResultCode == 'FAIL'){
								uni.hideLoading();
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);
								return
							}
							let ResultData = result.data.ResultData.data.data0
							console.log(ResultData)
							if(ResultData.code != 0){
								Config.ShowMessage(ResultData.Msg);
								Config.PopAudioContext(false);
								uni.hideLoading();
								return
							}
							this.clear()
							uni.hideLoading();
							Config.ShowMessage(ResultData.Msg);	
						}else{
							Config.ShowMessage('条码不能为空');
							Config.PopAudioContext(false);
						}
					}
				}catch(e){
					console.log(e)
					uni.hideLoading();
					Config.ShowMessage(e);
					Config.PopAudioContext(false);
				}
				
			},
			//存储本机上一次的绑定选择
			SelectTypeChange(e){
				// console.log(e)
				uni.setStorageSync("selectType",e.detail.value)
				this.clear()
			},
			clearBtn(type){
				if(type == 1){
					this.wrapCode = ''
				}else if(type == 2){
					this.goodsCode1 = ''
				}else if(type == 3){
					this.goodsCode2 = ''
				}
			},
			clear(){
				this.wrapCode =''
				this.goodsCode1 = ''
				this.goodsCode2 = ''
			}
		},
		beforeMount() {
			this.radio = uni.getStorageSync("selectType")||0
		},
		onLoad() {
			this.AddListener();
			this.radio = uni.getStorageSync("selectType")||0
		},
		onUnload() {
			this.RemoveListener();
		},
		
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'/pages/bindCode/bindingCodeHistory'
			})
		}
	}
</script>

<style scoped>
	.content{
		
	}
	.row{
		display: flex;
		flex-direction: row;
		margin-bottom: 20upx;
		font-size: 40upx;
		/* align-items: center; */
		/* justify-content: center; */
	}
	.code-info{
		padding: 20upx;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		justify-content: center;
	}
	.border-info{
		border-bottom: 4upx solid #aaaa00;
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.clear{
		padding: 20upx;
	}
	
	
</style>