<template>
	<view class="content">	
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
		data() {
			return {
				ProReportInterId: 0,
				ProReportSrcInterId: 0,
				DetailListData: [],
				SelectCartonLabel: '',
				IsSelectAllLabel: false				
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
						uni.hideLoading();
					},
					fail: () => {						
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');	
						uni.hideLoading();						
					},
					complete: (resultcomp) => {
					    let ResultMsg = resultcomp.data.ResultMsg;
					    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();							
					    }
					}
				});				
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
			//汇报单的选中外箱解绑
			UnBinding: function() {	
				let me = this;			
				if(me.SelectCartonLabel == '')					
				{					
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择要删除的内箱标签！');
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
										return;
									}										
									let DataModel = res.data.ResultData.ICMORpt2_10.dataparam;	
									let Result = DataModel.Result;
									if(Result == 0)
									{										
										Config.PopAudioContext(false);
										Config.ShowMessage(DataModel.Msg);										
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
										uni.hideLoading();										
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.scrollview{	
		margin-top: 20rpx;
		height: 1000rpx;		
	}
	
	.selectlabel{
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 150rpx;
		margin-top: 20rpx;
	}
	
	.deletelabel{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-right: 150rpx;
		margin-top: -95rpx;
	}
</style>
