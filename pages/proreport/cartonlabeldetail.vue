<template>
<view class="container">	
	<button class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
	<button class="deletelabel" v-on:click="DeleteSelectLabel()">删除</button>
	<button class="modifyqty" v-on:click="ModifyQty()">修改数量</button>
	
	<scroll-view class="scrollview" scroll-y="true">		
		<uni-list>
			<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'外箱标签：'+ item.FPackBarcode + '\n' 
			+ '数量：' + item.FQty"  :checkboxvalue="item.FPackBarcode" :ischecked="item.FIsChecked" :isshowcheckbox="true" 
			@CheckBoxChange="ChangeIsChecked(item)" clickable></uni-list-item>
		</uni-list>	
	</scroll-view>
	
	<OutStorageKeyboard @confirm="UpdateLabelQty" @exit="CloseQtyPopupWindowDirect"
		v-show="IsOpenDigitKeyboard"></OutStorageKeyboard>
	</view>
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
				ProReportInterId: 0,
				ProReportSrcInterId: 0,
				DetailListData: [],
				SelectCartonLabel: '',
				IsSelectAllLabel: false,
				IsOpenDigitKeyboard: false
			}
		},		
		onLoad() {	
			this.GetProReportId();
			this.ShowProReportDetail();
		},
		methods: {			
			GetProReportId:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS
				this.ProReportInterId = PrevPage.$vm.ProReportInterId;
				this.ProReportSrcInterId = PrevPage.$vm.ProReportSrcInterId;								
				//#endif
			},
			//显示汇报单外箱明细
			ShowProReportDetail:function(){					
				uni.showLoading({
					title: 'Loading',
					mask: true					
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptInfo',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FId: this.ProReportInterId,
							FSrcInterId: this.ProReportSrcInterId
						}
					},
					success: (result) => {	
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{					
							Config.PopAudioContext(false);
							Config.ShowMessage('账号登录异常，请重新登录！');	
							uni.hideLoading();						
							return;
						}						
						this.DetailListData = result.data.ResultData.PdaICMORptInfo.data0;						
					},
					fail: () => {						
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');	
						
					},
					complete: (resultcomp) => {
					    let ResultMsg = resultcomp.data.ResultMsg;
					    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);													
					    }
						uni.hideLoading();	
					}
				});				
			},
			CloseQtyPopupWindowDirect: function(e) {
				this.IsOpenDigitKeyboard = false;
			},
			//删除选中的外箱列表项
			DeleteSelectLabel:function(){
				this.GetSelectLabel();	
				this.UnBinding();				
			},
			//全选/反选外箱列表项
			SelectAllLabel:function(){
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;				
				}		
			    this.IsSelectAllLabel = !this.IsSelectAllLabel;
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
						this.SelectCartonLabel += this.DetailListData[i].FIndexId + ',';													
					}					
				}	
				if(this.SelectCartonLabel != '')					
				{
					this.SelectCartonLabel = this.SelectCartonLabel.substr(0, this.SelectCartonLabel.length - 1);
				}			
			}, 
			UpdateLabelQty: function(e){
				this.GetSelectLabel();
				this.CloseQtyPopupWindow(e);
			},
			//汇报单的选中外箱解绑
			UnBinding: function() {	
				let me = this;			
				if(me.SelectCartonLabel == '')					
				{					
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择要删除的外箱标签！');
					return; 
				}	
							
				uni.showLoading({
					title: 'Loading',
					mask: true					
				});			
				uni.showModal({
					title: '提示',
					content: '是否要对选中的外箱标签进行解绑？',
					success: function (result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'ICMORpt2_10',
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
										Config.PopAudioContext(false);
										Config.ShowMessage('账号登录异常，请重新登录！');	
										uni.hideLoading();																			
										return;
									}										
									let DataModel = res.data.ResultData.ICMORpt2_10.dataparam;	
									let Result = DataModel.Result;
									if(Result == 0)
									{										
										Config.PopAudioContext(false);
										Config.ShowMessage(DataModel.Msg);
										uni.hideLoading();											
										return;
									}										
									Config.PopAudioContext(true);	
									Config.ShowMessage(DataModel.Msg);
									me.ShowProReportDetail();																																																										
								},
								fail: () => {
									Config.PopAudioContext(false);
									Config.ShowMessage('请求数据失败！');																							
								},
								complete: (resultcomp) => {
								    let ResultMsg = resultcomp.data.ResultMsg;
								    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
										Config.PopAudioContext(false);
										Config.ShowMessage(ResultMsg);																			
								    }
									uni.hideLoading();	
								}
							});	
						} 
					}
				});					
			},
			ModifyQty: function(){
				let ModifyCount = this.DetailListData.filter(x => x.FIsChecked).length;
				if(ModifyCount == 0){
				   Config.ShowMessage('请选择标签进行修改数量！');
				   Config.PopAudioContext(false);	
				   return;
				}
				this.IsOpenDigitKeyboard = true;
			},
			CloseQtyPopupWindowDirect: function(e) {
				this.IsOpenDigitKeyboard = false;
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
						    FIsInWorkShop: true,
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
					    this.ShowProReportDetail();
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
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 20upx;
	}
	
	.deletelabel{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}
	
	.modifyqty{
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 300upx;
		margin-top: -96upx;
	}
</style>
