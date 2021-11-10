<template>
	<view class="container">
		<text class="inventoryplantitle">盘点方案：</text>
		<InventoryPlan class="inventoryplan" :candidates="ProcessList"  v-model="SelectProcess" @input="SwitchInventoryPlan()"></InventoryPlan>
		
		<text class="warehousetitle">盘点仓库：</text>
		<InventoryStock class="warehouse" :candidates="WareHouseList"  v-model="SelectWareHouse" @input="SwitchWareHouse()"></InventoryStock>
		
		<text class="inventoryareatitle">盘点区域：</text>
		<InventoryArea class="inventoryarea" :candidates="InventoryAreaList"  v-model="SelectInventoryArea" @input="GetSelectInventoryArea()"></InventoryArea>
		
		<button class="enterinventory" v-on:click="EnterInventory()">进入盘点界面</button>
		<button class="updateinventoryreport" v-on:click="UpdateInventoryReport()">更新盘点报告单</button>	
	</view>
</template>

<script>	
	import Config from '../../common/config.js';
	import InventoryPlan from '../../components/inventory-plan/inventory-plan.vue';
	import InventoryStock from '../../components/inventory-stock/inventory-stock.vue';
	import InventoryArea from '../../components/inventory-area/inventory-area.vue';
	export default {
		components: {
			Config,
			InventoryPlan,
			InventoryStock,
			InventoryArea
		},
		data() {
			return {
				ProcessList: [],
				WareHouseList: [],
				InventoryAreaList: [],
				SelectProcess: '',
				SelectWareHouse: '',
				SelectInventoryArea: '',
				ProcessModel: [],
				WareHouseModel: [],
				InventoryAreaModel: [],
				PopTitle: '',			
				IsOpenDigitKeyboard: false
			}
		},
		onLoad() {			
			this.GetAllInventoryPlan();			
		},	
		methods: {		
			//进入盘点界面
			EnterInventory: function(){
				if (this.SelectProcess == '') {
					Config.ShowMessage('请选择盘点方案！');
					Config.PopAudioContext(false);
					return;
				}								
				if(this.SelectWareHouse == ''){
					Config.ShowMessage('请选择盘点仓库！');
					Config.PopAudioContext(false);
					return;
				}
				if(this.SelectInventoryArea == ''){
					Config.ShowMessage('请选择盘点区域！');
					Config.PopAudioContext(false);
					return;
				}
				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.navigateTo({
					url: '/pages/inventory/scaninventory?WareHouseModel=' + this.WareHouseModel +
					'&ProcessModel=' + this.ProcessModel + '&InventoryAreaModel=' + this.InventoryAreaModel
				});
				uni.hideLoading();
			},	
			//更新盘点报告单
			UpdateInventoryReport: function(){
				if (this.SelectProcess == '') {
					Config.ShowMessage('请选择盘点方案！');
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
						ModuleCode: 'UpdateInventoryReport',
						token: uni.getStorageSync('token'),
						ModuleParam: {	
							FProcessId: this.ProcessModel.FID,
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
						let ResultData = result.data.ResultData.UpdateInventoryReport;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
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
						uni.hideLoading();
					}
				});
			},
			//切换盘点方案
			SwitchInventoryPlan:function(){
				this.GetSelectInventoryPlan();
				this.GetAllWareHouse();
				this.ClearWareHouse();
				this.ClearInventoryArea();
			},
			//获取选中的盘点方案
			GetSelectInventoryPlan:function(){
				this.ProcessModel = this.ProcessList.find(item => item.FProcessID == this.SelectProcess);
			},
			//获取所有盘点方案
			GetAllInventoryPlan:function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetProcessListInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							
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
						this.ProcessList = result.data.ResultData.GetProcessListInfo.data0;
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
			//清空仓库信息
			ClearWareHouse: function(){
				this.WareHouseModel = null;
				this.SelectWareHouse = '';				
			},
			ClearInventoryArea: function(){
				this.InventoryAreaModel = null;
				this.SelectInventoryArea = '';				
			},
			//切换仓库信息
			SwitchWareHouse: function(){
				this.GetSelectWareHouse();
				this.GetAllInventoryArea();
				this.ClearInventoryArea();
			},
			//获取选中仓库信息
			GetSelectWareHouse: function(){
				this.WareHouseModel = this.WareHouseList.find(item => item.FName == this.SelectWareHouse);
			},
			//获取所有仓库信息
			GetAllWareHouse: function() {				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetStockByInvPlan',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInvPlanId: this.ProcessModel.FID
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
						this.WareHouseList = result.data.ResultData.GetStockByInvPlan.data0;		
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
					}
				});
			},
			GetAllInventoryArea: function(){				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetInventoryAreaByStock',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FStockId: this.WareHouseModel.FItemID
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
						this.InventoryAreaList = result.data.ResultData.GetInventoryAreaByStock.data0;		
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
					}
				});
			},
			//获取选中仓库信息
			GetSelectInventoryArea: function(){
				this.InventoryAreaModel = this.InventoryAreaList.find(item => item.FName == this.SelectInventoryArea);
			}
		}
	}
</script>

<style>
	.inventoryplantitle {					
		margin-left: -450upx;
		margin-top: 30upx;
		font-size: 20px;
	}
	
	.inventoryplan {		
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.warehousetitle {
		margin-left: -450upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.warehouse {
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.inventoryareatitle {
		margin-left: -450upx;
		margin-top: 50upx;
		font-size: 20px;
	}
	
	.inventoryarea {
		margin-left: 250upx;
		margin-top: -65upx;
		font-size: 20px;
	}
	
	.scrollviewinfo {
		width: 100%;
		height: 800upx;
	}
	
	.tablebill{
		width: 100%;
		height: 790upx;
		margin-top: 50upx;
	}
	
	.enterinventory{
		width: 40%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 30upx;
		margin-top: 150upx;
		font-size: 18px;
	}	
	
	.updateinventoryreport{
		width: 45%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 370upx;
		margin-top: -95upx;
		font-size: 18px;
	}	
</style>
