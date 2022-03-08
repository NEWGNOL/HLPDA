<template>
	<view class="container">
	<button class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
	<button class="deletelabel" v-on:click="DeleteSelectLabel()">删除</button>
	<button class="modifyqty" v-on:click="ModifyQty()">修改数量</button>
	<button class="modifybatchno" v-on:click="OpenBatPopupWindow()">修改批号</button>
	
	<scroll-view class="scrollview" scroll-y="true">		
		<uni-list>
			<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'外箱标签：'+ item.FPackBarcode + '\n'
			+ '数量：' + item.FQty"  :checkboxvalue="item.FPackBarcode" :ischecked="item.FIsChecked" :isshowcheckbox="true" 
			@CheckBoxChange="ChangeIsChecked(item)" clickable></uni-list-item>
		</uni-list>	
	</scroll-view>
	
	<OutStorageKeyboard @confirm="UpdateLabelQty" @exit="CloseQtyPopupWindowDirect"
	v-show="IsOpenDigitKeyboard"></OutStorageKeyboard>
	
	<uni-popup ref="batchno" type="center" :mask-click="false">
		<mod-fty mode="input" title="修改批号" placeholder="请输入产品批号" :duration="2000"
			:before-close="true" @close="CloseBatPopupWindowDirect" @confirm="UpdateLabelBatchNo"></mod-fty>
	</uni-popup>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	import OutStorageKeyboard from '../../components/outstorage-keyboard/outstorage-keyboard.vue';
	export default {
		components: {
			Config,
			OutStorageKeyboard
		},
		data() {
			return {
				ProcessID: 0,				
				ItemId: 0,
				InventoryAreaId: 0,
				DetailListData: [],
				SelectCartonLabel: '',
				IsSelectAllLabel: false,
				IsOpenDigitKeyboard: false,
				PrevPage: null
			}
		},		
		onLoad() {	
			this.GetProcessID();
			this.ShowInventoryDetail();
		},				
		methods: {
			GetProcessID:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面					
				//#ifdef APP-PLUS
				this.PrevPage = PrevPage;
				this.ProcessID = PrevPage.$vm.ProcessModel.FID;				
				this.ItemId = PrevPage.$vm.ProcessRecordModel.FItemID;	
				this.InventoryAreaId = PrevPage.$vm.InventoryAreaModel.FId;
				//#endif				
			},
			//显示盘点外箱明细
			ShowInventoryDetail:function(){	
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetInventoryCartonList',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FProcessID: this.ProcessID,							
							FItemId: this.ItemId,
							FUserId: uni.getStorageSync('FUserId'),
							FInventoryAreaId: this.InventoryAreaId
						}
					},
					success: (result) => {	
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{	
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						this.DetailListData = result.data.ResultData.GetInventoryCartonList.data0;						
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
					setTimeout(function () {
					    uni.hideLoading();
					}, 2000);
				}
				});	
			},
			//切换内箱标签是否选中
			ChangeIsChecked:function(item){
				item.FIsChecked = !item.FIsChecked;				
			},
			//获取选中的外箱标签
			GetSelectLabel:function(){
				this.SelectCartonLabel = '';
				for (var i = 0; i < this.DetailListData.length; i++) {
					if(this.DetailListData[i].FIsChecked)
				    {						
						this.SelectCartonLabel += this.DetailListData[i].FId + ',';													
					}					
				}	
				if(this.SelectCartonLabel != '')					
				{
					this.SelectCartonLabel = this.SelectCartonLabel.substr(0, this.SelectCartonLabel.length - 1);
				}			
			}, 
			//全选/反选外箱列表项
			SelectAllLabel:function(){
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;				
				}		
			    this.IsSelectAllLabel = !this.IsSelectAllLabel;
			},
			//删除选中的外箱列表项
			DeleteSelectLabel:function(){
				this.GetSelectLabel();	
				this.UnBinding();				
			},
			//修改标签数量
			ModifyQty: function(){
				let ModifyCount = this.DetailListData.filter(x => x.FIsChecked).length;
				if(ModifyCount == 0){
				   Config.ShowMessage('请选择标签进行修改数量！');
				   Config.PopAudioContext(false);	
				   return;
				}
				this.IsOpenDigitKeyboard = true;
			},			
			//入库单选中的外箱解绑
			UnBinding: function() {	
				let me = this;
				if(me.SelectCartonLabel == '')					
				{
					Config.ShowMessage('请选择要删除的外箱标签！');	
					Config.PopAudioContext(false);									
					return; 
				}				
				uni.showModal({
					title: '提示',
					content: '是否要对选中的外箱标签进行解绑？',
					success: function (result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'DelInventoryCartonList',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FIndexIdList: me.SelectCartonLabel,
										Result:0,
										Msg:''
									}
								},
								success: (res) => {											
									let ResultCode = res.data.ResultCode;
									let ResultMsg = res.data.ResultMsg;
									if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
									{	
										Config.ShowMessage('账号登录异常，请重新登录！');		
										Config.PopAudioContext(false);																			
										return;
									}										
									let DataParam = res.data.ResultData.DelInventoryCartonList.dataparam;	
									let Result = DataParam.Result;
									if(Result == 0)
									{
										Config.ShowMessage(DataParam.Msg);	
										Config.PopAudioContext(false);																			
										return;
									}
									Config.ShowMessage(DataParam.Msg);	
									Config.PopAudioContext(true);									
									me.ShowInventoryDetail();	
									me.PrevPage.$vm.GenInventoryList();																																											
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
						} 
					}
				});	
			},
			CloseQtyPopupWindowDirect: function(e) {				
				this.IsOpenDigitKeyboard = false;
			},
			UpdateLabelQty: function(e){
				this.GetSelectLabel();
				this.CloseQtyPopupWindow(e);
			},
			UpdateLabelBatchNo: function(e){
				this.GetSelectLabel();
				this.CloseBatPopupWindow(e);
			},
			//打开批号弹窗
			OpenBatPopupWindow: function() {
				let ModifyCount = this.DetailListData.filter(x => x.FIsChecked).length;
				if(ModifyCount == 0){
				   Config.ShowMessage('请选择标签进行修改批号！');
				   Config.PopAudioContext(false);	
				   return;
				}
				this.$refs.batchno.open();
			},
			CloseBatPopupWindowDirect: function(e) {
				this.$refs.batchno.close();
			},
			//关闭批号弹窗
			CloseBatPopupWindow: function(e) {
				//console.log(e);				
				if (e == null || e == '') {
					Config.ShowMessage('请填写要修改的产品批号！');
					Config.PopAudioContext(false);
					return;
				}				
			    this.$refs.batchno.close();
				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'UpdateLabelInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FType: 2,
							FIndexIdList: this.SelectCartonLabel,
							FUpdateInfo: e,	
						    FIsInWorkShop: false,
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
						let ResultData = result.data.ResultData.UpdateLabelInfo;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.ShowInventoryDetail();
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
			//关闭数量弹窗
			CloseQtyPopupWindow: function(e) {				
				//console.log(e);
				if (e == null || e == '' || e == 0) {
					Config.ShowMessage('请填写要修改的标签数量！');
					Config.PopAudioContext(false);
					return;
				}
			
				this.IsOpenDigitKeyboard = false;
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'UpdateLabelInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FType: 1,
							FIndexIdList: this.SelectCartonLabel,
							FUpdateInfo: e,	
						    FIsInWorkShop: false,
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
						let ResultData = result.data.ResultData.UpdateLabelInfo;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.ShowInventoryDetail();
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
		    }
		}
	}
</script>

<style>	
	.scrollview{	
		margin-top: 20upx;
		height: 1000upx;		
	}
	
	.selectlabel{
		width: 27%;		
		color: #FFFFFF;
		background-color: #007AFF;	
		font-size: 15px;
		border-radius: 50upx;
		margin-left: 5upx;
		margin-top: 20upx;
	}
	
	.deletelabel{	
		width: 18%;
		color: #FFFFFF;
		background-color: #007AFF;
		font-size: 15px;
		border-radius: 50upx;
		margin-right: 5upx;
		margin-top: -80upx;
	}
	
	.modifyqty{
		width: 25%;
		color: #FFFFFF;
		background-color: #007AFF;	
		font-size: 15px;
		border-radius: 50upx;
		margin-left: 220upx;
		margin-top: -80upx;
	}
	
	.modifybatchno{
		width: 25%;
		color: #FFFFFF;
		background-color: #007AFF;	
		font-size: 15px;	
		border-radius: 50upx;
		margin-left: 420upx;
		margin-top: -80upx;
	}
</style>
