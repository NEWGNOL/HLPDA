<template>
	<view class="content">	
	     <view class="tabbackground">
	       <text class="tableft" v-bind:class="{selecttab : IsShowBindingView}" v-on:click="SwitchTab(true)">汇总</text>
	       <view class="tableftline" v-bind:class="{selecttabline : IsShowBindingView}"></view>
	      
	       <text class="tabright" v-bind:class="{selecttab : !IsShowBindingView}" v-on:click="SwitchTab(false)">明细</text>
	       <view class="tabrightline" v-bind:class="{selecttabline : !IsShowBindingView}"></view>	
	    </view>
	
		<view class="summary" v-show="IsShowBindingView">		
		<cmd-progress style="display: flex; width: 80%; margin-top: -50rpx; margin-left: 90rpx;" v-bind:percent="Math.round((this.ScannerLabelCount / this.InnerCartonLabelCount) * 100, 0)"></cmd-progress>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 40rpx;">外箱标签：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 350rpx; margin-top: -58rpx;">{{CartonLabel}}</text>		
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">已扫内箱数：</text>
		<text style="display: flex; width: 500rpx; font-size: 50rpx; margin-left: 350rpx; margin-top: -70rpx;">{{ScannerLabelCount}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">装满内箱数：</text>
		<text style="display: flex; width: 500rpx; font-size: 50rpx; margin-left: 350rpx; margin-top: -70rpx;">{{InnerCartonLabelCount}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">物料编码：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 310rpx; margin-top: -60rpx;">{{FNumber}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">物料名称：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 310rpx; margin-top: -60rpx;">{{FName}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">物料规格：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 310rpx; margin-top: -60rpx;">{{FModel}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">批次：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 310rpx; margin-top: -60rpx;">{{FGMPBatchNo != '' ? FGMPBatchNo : '空'}}</text>
		<text style="display: flex; font-size: 40rpx; margin-left: 90rpx; margin-top: 60rpx;">扫描模式：</text>
		<text style="display: flex; width: 500rpx; font-size: 40rpx; margin-left: 310rpx; margin-top: -60rpx;">{{IsPack ? '扫描内箱' : '扫描外箱'}}</text>
		</view>
		
		
	
	    <button v-show="!IsShowBindingView" class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
	    <button v-show="!IsShowBindingView" class="deletelabel" v-on:click="DeleteSelectLabel()">删除</button>	  
		<scroll-view class="scrollview" v-show="!IsShowBindingView" scroll-y="true">
			  <uni-list class="detaillist">
				<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'内箱标签：' + item.FBarCode + '\n' + '数量：' + item.FQty"
				:checkboxvalue="item.FBarCode" :ischecked="item.FIsChecked" :isshowcheckbox="true" @CheckBoxChange="ChangeIsChecked(item)" 
				clickable></uni-list-item>
			  </uni-list>		
		</scroll-view>			
	</view>
</template>


<script src="vue.js" type="text/javascript" charset="UTF-8"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				Label: '',
				InnerCartonLabel: '*',
				CartonLabel: '空',
				InnerCartonLabelCount:0,
				ScannerLabelCount:0,
				FNumber:'空',
				FName:'空',
				FModel:'空',
				FGMPBatchNo:'空',				
				IsPack: false,//0代表扫描外箱，1代表扫描内箱
				IsShowBindingView: true,
				IsSelectAllLabel: false,
				Type:'top',
				DetailListData:[],
				SelectLabel:'',
				Main:'',
				Receiver:''				
			}
		},
		onLoad() {	
			    this.AddListener();
				},
		onUnload() {
			     this.RemoveListener();
				},
		onNavigationBarButtonTap() {
				 this.SwitchCartonMode();
				},
		methods: {	
			//切换内箱标签是否选中
			ChangeIsChecked:function(item){
				item.FIsChecked = !item.FIsChecked;				
			},
			//切换变量
			SwitchVariable:function(){				
				this.IsShowBindingView = !this.IsShowBindingView;				
			},
			//切换页面
			SwitchTab: function(IsShowBindingViewParam) {				
				if(this.IsShowBindingView != IsShowBindingViewParam)
				{					
					this.SwitchVariable();
					this.GetLabelByPackBarCode();					
				}
			},			
			//删除选中的内箱列表项
			DeleteSelectLabel:function(){
				this.GetSelectLabel();
				this.UnBinding();	
			},			
			//添加广播监听
			AddListener:function() {
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
				this.Main = main;	
				this.Receiver = receiver;
					
				function doReceive(context, intent) { 			
				    plus.android.importClass(intent);  		
				    var Barcode = intent.getStringExtra("barcode_string");  
				    me.Label = Barcode;					
					me.ScanBarCode();									 
				} 
		    },
			//移除广播监听
			RemoveListener:function(){
				this.Main.unregisterReceiver(this.Receiver);//取消监听
			},
			//根据标签获取条码信息
			GetLabelByBarCode: function() {					
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getLabelByBarcode',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FBarCode: this.Label
						}
					},
					success: (result) => {	
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext();
							return;
						}						
						let DataArray = result.data.ResultData.LabelInfo.data0;							
			            if(DataArray.length == 0)
						{
							Config.ShowMessage('此外箱不存在，请重新扫描外箱条码！');	
							Config.PopAudioContext();
							return;
						}																	
					    if(!DataArray[0].FIsPack)
						{
							Config.ShowMessage(this.Label + '不是外箱条码，请重新扫描外箱条码！');
							Config.PopAudioContext();
							return;
						}											
						if(this.IsPack && this.InnerCartonLabelCount !=0 && this.ScannerLabelCount !=0 && this.InnerCartonLabelCount == this.ScannerLabelCount)							
						{							
							Config.ShowMessage('内箱已满，请扫描其它外箱！');	
							Config.PopAudioContext();
							return;
						}
						this.IsPack = DataArray[0].FIsPack;						
						this.CartonLabel = this.Label;
						this.InnerCartonLabelCount = DataArray[0].FMaxlabelCount;
						this.ScannerLabelCount = DataArray[0].FlabelCount;							
						this.FNumber = DataArray[0].FNumber;
						this.FName = DataArray[0].FName;
						this.FModel = DataArray[0].FModel;
						this.FGMPBatchNo = DataArray[0].FGMPBatchNo;					
					},
					fail: () => {	
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
					}
				});			
			},
			//多内箱解绑
			UnBinding:function(){
				let me = this;				
				if(me.SelectLabel == '')					
				{
					Config.ShowMessage('请选择要删除的内箱标签！');
					Config.PopAudioContext();
					return; 
				}		
				uni.showModal({					
					title: '提示',
					content: '是否要对选中的内箱标签进行解绑？',
					success: function (result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'Binding1_5',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FPackBarCode: me.CartonLabel,
										FBarCodeList: me.SelectLabel
									}
								},
								success: (res) => {										
									uni.request({
										url: uni.getStorageSync('OtherUrl'),
										method: 'POST',
										data: {
											ModuleCode: 'getLabelByPackBarcode',
											token: uni.getStorageSync('token'),						
											ModuleParam: {
												FPackBarCode: me.CartonLabel
											}
										},
										success: (resdetail) => {
											let ResultCode = resdetail.data.ResultCode;
											let ResultMsg = resdetail.data.ResultMsg;
											if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
											{						
												Config.ShowMessage('账号登录异常，请重新登录！');	
												Config.PopAudioContext();
												return;
											}											
											me.DetailListData = resdetail.data.ResultData.LabelInfo.data0;						                           
										},
										fail: () => {
											Config.ShowMessage('请求数据失败！');	
											Config.PopAudioContext();
										}
									});			
									let DataModel = res.data.ResultData.Binding1_5.data0;									
									me.ScannerLabelCount = DataModel.FlabelCount;
									me.IsPack = true;
									Config.ShowMessage(DataModel.Msg);																																				
								},
								fail: () => {	
									Config.ShowMessage('请求数据失败！');	
									Config.PopAudioContext();
								}
							});	
						} 
					}
				});
			},
			//装箱绑定内外箱
			Binding:function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'binding10_2',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FPackBarCode: this.CartonLabel,
							FBarCode: this.Label
						}
					},
					success: (result) => {	
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext();
							return;
						}							
						let DataModel = result.data.ResultData.Binding10_2Info.data0;
						let Result = DataModel.Result;
						if(Result == 0)
						{
							Config.ShowMessage(DataModel.Msg);
							Config.PopAudioContext();
							return;
						}						
						this.InnerCartonLabelCount = DataModel.FMaxlabelCount;
						this.ScannerLabelCount = DataModel.FlabelCount;						
						if(this.InnerCartonLabelCount != 0 && this.ScannerLabelCount != 0
						&& this.InnerCartonLabelCount == this.ScannerLabelCount)
						{
							this.IsPack = false;
						}						
						Config.ShowMessage(DataModel.Msg);				
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
					}
				});				
			},
			//根据外箱获取内盒列表
			GetLabelByPackBarCode: function() {	
				if(!this.IsShowBindingView)
			    {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getLabelByPackBarcode',
						token: uni.getStorageSync('token'),						
						ModuleParam: {
							FPackBarCode: this.CartonLabel
						}
					},
					success: (result) => {		
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext();
							return;
						}	
					    this.DetailListData = result.data.ResultData.LabelInfo.data0;						                           
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
					}
				});	
			    }
			},	
			//扫描条码
			ScanBarCode:function(){					
				if(this.IsPack)
				{					
					this.Binding();	
					this.GetLabelByPackBarCode();
				}
				else
				{				
					this.GetLabelByBarCode();					
				}	
			},
			//切换扫描外箱模式
		    SwitchCartonMode:function(){	
				let me = this;
				uni.showModal({					
					title: '提示',
					content: '是否要切换外箱扫描模式？',
					success: function (result) {
						if (result.confirm) {
							me.ClearPageData();
							Config.ShowMessage('切换外箱扫描模式成功！')
						} 
					}
				});	
			},
			//清空界面数据
			ClearPageData:function(){	
				this.IsPack = false;
				this.InnerCartonLabel = '*';
				this.CartonLabel = '空';
				this.InnerCartonLabelCount = 0;
				this.ScannerLabelCount = 0;
				this.FNumber = '空';
				this.FName = '空';
				this.FModel = '空';
				this.FGMPBatchNo = '空';
				this.DetailListData = [];				
			},
			//获取选中的标签
			GetSelectLabel:function(){
				this.SelectLabel = '';
				for (var i = 0; i < this.DetailListData.length; i++) {
					if(this.DetailListData[i].FIsChecked)
				    {						
						this.SelectLabel += '\'' + this.DetailListData[i].FBarCode + '\'' + ',';													
					}					
				}	
				if(this.SelectLabel != '')					
				{
					this.SelectLabel = this.SelectLabel.substr(0, this.SelectLabel.length - 1);
				}			
		    }, 
			//全选/反选内箱列表项
			SelectAllLabel:function(){
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;				
				}		
			    this.IsSelectAllLabel = !this.IsSelectAllLabel;
			}			
		}
	}
</script>


<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.tableftline {		
		width: 15%;
		height: 5rpx;		
		margin-left: 145rpx;
	}
	
	.tabrightline {			
		width: 15%;
		height: 5rpx;		
		margin-left: 500rpx;
	}	
	
	.tableft {		
		display: flex;
		font-size: 50rpx;		
		margin-left: 150rpx;
	}
	
	.tabright {	
		display: flex;
		font-size: 50rpx;
		margin-top: -80rpx;
		margin-left: 500rpx;
	}
	
	.summary {
		height: 650rpx;
		margin-top: -1100rpx;
		display: grid;
		flex-direction: row;
	}
	
	.summarytitle {
		font-size: 40rpx;
		margin-left: 0rpx;
		margin-top: -80rpx;
	}
	
	.summarydata {
		font-size: 40rpx;
		margin-left: 50rpx;
		margin-top: -50rpx;
	}
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline{
		background-color: #007AFF;
	}
	
	.unselectitem {
		color: #FFFFFF;
	}
	
	.selectitem {
		background-color: #808080;
	}
	
	.detaillist {		
		width: 100%;
	}
	
	.scrollview {		
		height: 870rpx;
		margin-top: 30rpx;
	}
	
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	
	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.selectlabel{
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-top: -1150rpx;
		margin-left: 200rpx;	
	}
	
	.deletelabel{		
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-top: -95rpx;
		margin-right: 150rpx;		
	}
	
	.tabbackground{		
		width: 100%;
		height: 100rpx;
		margin-top: 1090rpx;
		background-color: #F4F4F4;		
	}
</style>
