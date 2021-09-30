<template>
	<view class="container">
		<text class="title">盘点方案编号：</text>
		<text class="data">{{ProcessModel.FProcessID}}</text>
		
		<text class="title">盘点仓库：</text>
		<text class="data">{{WareHouseModel.FName}}</text>
		
		<text class="title">仓库物料：</text>
		<navigator url="/pages/basic/icitem" hover-class="navigator-hover">
			<view class="data">{{MaterialArray[1]}}</view>
		</navigator>
		<view class="dataline"></view>
		
		<!-- <text class="title">盘点数量：</text>0
		<input class="qty" v-model="InventoryQty"/> -->
		
		<text class="title">盘点数量：</text>
		<view class="data" @click="OpenPopupWindow">{{InventoryQty}}</view>
		<view class="dataline"></view>		
		
		<addmaterial-keyboard @confirm="ClosePopupWindow" @exit="ClosePopupWindowDirect" v-show="IsOpenDigitKeyboard"></addmaterial-keyboard>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {	
				ProcessModel: [],
				WareHouseModel: [],						
				MaterialArray: [0,'请选择物料','',''],				
				InventoryQty: 0,
				IsOpenDigitKeyboard: false
			}
		},
		onLoad() {			
			this.GetLastPageInfo();		       
		},		
		onNavigationBarButtonTap() {
			this.AddInventoryList();
		},
		methods: {	
			//打开弹窗
			OpenPopupWindow: function(){			
				this.IsOpenDigitKeyboard = true;
			},
			//关闭弹窗
			ClosePopupWindowDirect: function(e){				
				this.SwitchIsOpenDigitKeyboard(false);			
			},
			//关闭弹窗
			ClosePopupWindow: function(e){				
				let IsSuccess = this.GetInventoryQty(e);
				if(IsSuccess == 0){
					return;
				}
				this.SwitchIsOpenDigitKeyboard(false);		
			},
			SwitchIsOpenDigitKeyboard: function(IsOpenDigitKeyboard){
				this.IsOpenDigitKeyboard = IsOpenDigitKeyboard;
			},
			GetInventoryQty: function(e){
				if(e == null || e == '' || e == 0){
				   Config.ShowMessage('请填写要修改的物料数量！');
				   Config.PopAudioContext(false);					
				   return 0;
				}	
				this.InventoryQty = e;
			},
			//获取上个页面信息
			GetLastPageInfo:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS			
				this.ProcessModel = PrevPage.$vm.ProcessModel;				
				this.WareHouseModel = PrevPage.$vm.WareHouseModel;					
				//#endif
			},					
			//新增盘点清单
			AddInventoryList: function(){
				if (this.MaterialArray[0] == 0) {
					Config.ShowMessage('请选择物料！');
					Config.PopAudioContext(false);
					return;
				}	
				
				if(this.InventoryQty == 0){
					Config.ShowMessage('请填写盘点数量！');
					Config.PopAudioContext(false);
					return;
				}
				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddPdaVirtualLabByInventory',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProcessModel.FID,							
							FStockId: this.WareHouseModel.FItemID,
							FStockPlaceId: 0,	
							FItemId: this.MaterialArray[0],
							FInventoryQty: 0,
							FQty: this.InventoryQty,
							FBillerID: uni.getStorageSync('FUserId'),
							FIsAddMaterial: true,
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
							uni.hideLoading();
							return;
						}						
						let ResultData = result.data.ResultData.AddPdaVirtualLabByInventory;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);	
						this.RefreshLastPageData();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);						
						}
						uni.hideLoading();
					}
				});
			},
			//刷新上个页面数据
			RefreshLastPageData:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS			
				PrevPage.$vm.GenInventoryList();			
				//#endif
				uni.navigateBack();
			}			
		}		
	}
</script>

<style>
	.title {
		display: flex;
		margin-left: -400upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.data {	
		display: flex;
		width: 400upx;
		font-size: 20px;
		margin-top: -60upx;
		margin-left: 400upx;
		text-align: center;		
	}
	
	.dataline {
		width: 50%;
		height: 5upx;
		background-color: #4CD964;
		margin-left: 250upx;
	}
	
	.material {
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.qty {
		width: 400upx;
		border: 5upx solid;
		font-size: 20px;
		border-color: #888888;
		margin-left: 250upx;
		margin-top: -60upx;
	}
</style>
