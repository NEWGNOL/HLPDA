<template>
	<view class="container">
		<view class="summary">
			<text class="detailtitle">单据编号：</text>
			<text class="detaildata">{{this.BillArray[0]}}</text>
			
			<text class="detailtitle">制单日期：</text>
			<text class="detaildata">{{this.BillArray[1]}}</text>
			
			<text class="detailtitle">制单人：</text>
			<text class="detaildata">{{this.BillArray[2]}}</text>			
		</view>
		
		
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">开始备货</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>		
		    <text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">备货完成</text>
			<view class="tabrightline" v-bind:class="{selecttabline: TabSelectedIndex == 1}"></view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';	
	export default {
		components: {
			Config		
		},
		data() {
			return {		
				TabSelectedIndex: 0,
				BillArray: ['空','空','空'],
				BillDealStatus: 20,
				Main: '',
				Receiver: ''
			}
		},		
		onLoad() {
			this.AddListener();		        
		},
		onUnload() {
			this.RemoveListener();
			
		},		
		methods: {				
			//添加广播监听
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
					me.ScanOrder(Barcode);					
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},	
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.BillDealStatus = (TabSelectedIndex == 0) ? 20: 30;					
					this.TabSelectedIndex = TabSelectedIndex;
				}
			},			
			//扫描单据
			ScanOrder: function(Barcode) {				
				uni.request({
				   	url: uni.getStorageSync('OtherUrl'),
				   	method: 'POST',
				   	data: {
				   		ModuleCode: 'SOutRBStatus',
				   		token: uni.getStorageSync('token'),
				   		ModuleParam: {				   			
				   			FRBType: this.BillDealStatus,
				   			FBillNo: Barcode,
							FDate: '',
							FBillerName: uni.getStorageSync('FUserName'),						
				   			Result: 0,							
				   			Msg: ''
				   		}
				   	},
				   	success: (result) => {
				   		//console.log(result.data);
				   		let ResultCode = result.data.ResultCode;
				   		let ResultMsg = result.data.ResultMsg;
				   		if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				   			Config.ShowMessage('账号登录异常，请重新登录！');
				   			Config.PopAudioContext(false);
				   			return;
				   		}
				   		
				   		let DataParam = result.data.ResultData.SOutRBStatus.dataparam;
				   		let Result = DataParam.Result;
				   		if(Result == 0){
				   			Config.ShowMessage(DataParam.Msg);
				   			Config.PopAudioContext(false);
				   			return;
				   		}							
				   		
				   		Config.ShowMessage(DataParam.Msg);
				   		Config.PopAudioContext(true);
						this.ShowScanBillInfo(DataParam);
				   	},
				   	fail: () => {
				   		Config.ShowMessage('请求数据失败！');
				   		Config.PopAudioContext(false);
				   		return;
				   	},
				   	complete: (resultcomp) => {
				   		let ResultMsg = resultcomp.data.ResultMsg;
				   		if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
				   			Config.ShowMessage(ResultMsg);
				   			Config.PopAudioContext(false);
				   		}
				   	}
				});				
			},
			//显示扫描单据信息
			ShowScanBillInfo: function(DataParam){
				this.BillArray = [DataParam.FBillNo,DataParam.FDate,DataParam.FBillerName];
			}
		}
	}	
</script>

<style>	
	.tabbackground {
		width: 100%;
		height: 90upx;
		margin-top: 100upx;
		background-color: #F4F4F4;
	}

	.tableft {
		font-size: 45upx;
		margin-top: 20upx;
		margin-left: 110upx;
	}

	.tabright {
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 485upx;
	}

	.tableftline {
		width: 25%;
		height: 5upx;
		margin-left: 100upx;
	}

	.tabrightline {
		width: 25%;
		height: 5upx;
		margin-left: 475upx;
	}
	
	.summary {		
		height: 1000upx;	
		width: 100%;
	}
	
	.detailtitle {	
		display: flex;
		flex-direction: column;
		font-size: 25px;
		margin-top: 30upx;
		margin-left: 10upx;
		text-align: left;	
	}
	
	.detaildata {	
		display: flex;
		flex-direction: column;
		font-size: 25px;
		margin-top: -78upx;	
		margin-left: 250upx;
		text-align: left;
	}
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline {
		background-color: #007AFF;
	}
</style>