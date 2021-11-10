<template>
	<view class="container">
	<button class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
	<button class="deletelabel" v-on:click="DeleteSelectLabel()">删除</button>
	
	<scroll-view class="scrollview" scroll-y="true">		
		<uni-list>
			<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'外箱标签：'+ item.FPackBarcode + '\n'
			+ '数量：' + item.FQty"  :checkboxvalue="item.FPackBarcode" :ischecked="item.FIsChecked" :isshowcheckbox="true" 
			@CheckBoxChange="ChangeIsChecked(item)" clickable></uni-list-item>
		</uni-list>	
	</scroll-view>
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
				StorageOutInterId: 0,				
				ItemId: 0,
				DetailListData: [],
				SelectCartonLabel: '',
				IsSelectAllLabel: false				
			}
		},		
		onLoad() {	
			this.GetStorageOutInterId();
			this.ShowStorageOutDetail();
		},				
		methods: {
			GetStorageOutInterId:function(){
				let Pages = getCurrentPages();
				let PrevPage = Pages[Pages.length - 2];  //上一个页面	
				//#ifdef APP-PLUS
				this.StorageOutInterId = PrevPage.$vm.StorageOutInterId;				
				this.ItemId = PrevPage.$vm.SelectGroupModel.FItemID;					
				//#endif				
			},
			//显示出库单外箱明细
			ShowStorageOutDetail:function(){	
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageOutRptCartonList',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FId: this.StorageOutInterId,							
							FItemId: this.ItemId 
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
						this.DetailListData = result.data.ResultData.GetPdaStorageOutRptCartonList.data0;						
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
									ModuleCode: 'delPdaStorageOutRptCartonList',
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
									let DataParam = res.data.ResultData.DelPdaStorageOutRptCartonList.dataparam;	
									let Result = DataParam.Result;
									if(Result == 0)
									{
										Config.ShowMessage(DataParam.Msg);	
										Config.PopAudioContext(false);																			
										return;
									}
									Config.ShowMessage(DataParam.Msg);	
									Config.PopAudioContext(true);									
									me.ShowStorageOutDetail();																																												
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
		margin-left: 150upx;
		margin-top: 20upx;
	}
	
	.deletelabel{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-right: 150upx;
		margin-top: -95upx;
	}
</style>
