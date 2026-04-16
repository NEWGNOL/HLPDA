<template>
	<view class="container">		
		<!-- 内容区域（调整为置顶显示） -->
		<view class="content-wrapper">
			<!-- 汇总模块 -->
			<view class="summary" v-show="IsShowBindingView">
				<!-- 进度条：移除原宽80%和居中，改为整行 -->
				<cmd-progress class="summary-progress"
					v-bind:percent="Math.round((this.ScannerLabelCount / this.InnerCartonLabelCount) * 100, 0)">
				</cmd-progress>
				
				<!-- 汇总表单（网格布局，标题+字段对齐） -->
				<view class="summary-form">
					<view class="form-row">
						<text class="form-label">外箱标签：</text>
						<text class="form-value">{{CartonLabel}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">已扫内箱数：</text>
						<text class="form-value scannedcount">{{ScannerLabelCount}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">装满内箱数：</text>
						<text class="form-value">{{InnerCartonLabelCount}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">物料编码：</text>
						<text class="form-value">{{FNumber}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">物料名称：</text>
						<text class="form-value">{{FName}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">物料规格：</text>
						<text class="form-value">{{FModel}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">批次：</text>
						<text class="form-value">{{FGMPBatchNo != '' ? FGMPBatchNo : '空'}}</text>
					</view>
					<view class="form-row">
						<text class="form-label">扫描模式：</text>
						<text class="form-value">{{IsPack ? '扫码装箱' : '查询外箱'}}</text>
					</view>
				</view>
			</view>

			<!-- 明细模块 -->
			<view class="detail" v-show="!IsShowBindingView">
				<!-- 操作按钮 -->
				<view class="detail-btns">
					<button class="btn selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
					<button class="btn deletelabel" v-on:click="DeleteSelectLabel()">删除</button>
				</view>
				<!-- 明细列表（滚动） -->
				<scroll-view class="scrollview" scroll-y="true">
					<uni-list class="detaillist">
						<uni-list-item 
							v-for="(item,index) in DetailListData" 
							:key="index"
							:title="`内箱标签：${item.FBarCode}`"
							:note="`数量：${item.FQty}`"
							:checkboxvalue="item.FBarCode"
							:ischecked="item.FIsChecked" 
							:isshowcheckbox="true" 
							@CheckBoxChange="ChangeIsChecked(item)"
							clickable>
						</uni-list-item>
					</uni-list>
				</scroll-view>
			</view>
		</view>
		
		<!-- 底部Tab栏 -->
		<view class="tab-container">			
				<text class="tab-item left" 
					v-bind:class="{selecttab : IsShowBindingView}" 
					v-on:click="SwitchTab(true)">装箱汇总</text>
				<view class="tab-line left-line" 
					v-bind:class="{selecttabline : IsShowBindingView}"></view>

				<text class="tab-item right" 
					v-bind:class="{selecttab : !IsShowBindingView}"
					v-on:click="SwitchTab(false)">内箱明细</text>
				<view class="tab-line right-line" 
					v-bind:class="{selecttabline : !IsShowBindingView}"></view>			
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
				Label: '',
				InnerCartonLabel: '*',
				CartonLabel: '空',
				InnerCartonLabelCount: 0,
				ScannerLabelCount: 0,
				FNumber: '空',
				FName: '空',
				FModel: '空',
				FGMPBatchNo: '空',
				IsPack: false, //0代表查询外箱，1代表扫码装箱
				IsShowBindingView: true,
				IsSelectAllLabel: false,
				IsRequesting: false,
				Type: 'top',
				DetailListData: [],
				SelectLabel: '',
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
		onNavigationBarButtonTap() {
			this.SwitchCartonMode();
		},
		methods: {
			//检测内箱标签是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//设置请求标志
			SetRequestingFlag: function(IsRequesting) {
				this.IsRequesting = IsRequesting;
			},
			//切换可视变量
			SwitchVariable: function() {
				this.IsShowBindingView = !this.IsShowBindingView;
			},
			//切换页面
			SwitchTab: function(IsShowBindingViewParam) {
				if (this.IsShowBindingView != IsShowBindingViewParam) {
					this.SwitchVariable();
					this.GetLabelByPackBarCode();
				}
			},
			//删除选中的内箱列表项
			DeleteSelectLabel: function() {
				this.GetSelectLabel();
				this.UnBinding();
			},
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
					me.Label = Barcode;
					me.ScanBarCode();
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
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
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {							
							Config.PopAudioContext(false);
							Config.ShowMessage('账号登录异常，请重新登录！');
							return;
						}
						let DataArray = result.data.ResultData.LabelInfo.data0;
						if (DataArray.length == 0) {							
							Config.PopAudioContext(false);
							Config.ShowMessage('此外箱不存在，请重新扫描外箱条码！');
							return;
						}
						if (!DataArray[0].FIsPack) {
							Config.PopAudioContext(false);
							Config.ShowMessage(this.Label + '不是外箱条码，请重新扫描外箱条码！');							
							return;
						}
						if (this.IsPack && this.InnerCartonLabelCount != 0 && this.ScannerLabelCount !=
							0 && this.InnerCartonLabelCount == this.ScannerLabelCount) {							
							Config.PopAudioContext(false);
							Config.ShowMessage('内箱已满，请扫描其它外箱！');
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
						Config.PopAudioContext(false);
						Config.ShowMessage('请求数据失败！');
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);							
						}
					}
				});
			},
			//多内箱解绑
			UnBinding: function() {
				let me = this;
				if (me.SelectLabel == '') {					
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择要删除的内箱标签！');
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否要对选中的内箱标签进行解绑？',
					success: function(result) {
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
											let ResultCode = resdetail.data
												.ResultCode;
											let ResultMsg = resdetail.data
												.ResultMsg;
											if (ResultCode == 'FAIL' &&
												ResultMsg == '不存在的Token') {
												Config.PopAudioContext(false);
												Config.ShowMessage(
												'账号登录异常，请重新登录！');												
												return;
											}
											me.DetailListData = resdetail.data
												.ResultData.LabelInfo.data0;
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
					                }
									});
									let DataModel = res.data.ResultData.Binding1_5.data0;
									me.ScannerLabelCount = DataModel.FlabelCount;
									me.IsPack = true;									
									Config.PopAudioContext(true);
									Config.ShowMessage(DataModel.Msg);
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
					        }
							});
						}
					}
				});
			},
			//装箱绑定内外箱
			Binding: function() {
				if (!this.IsRequesting) {
					this.SetRequestingFlag(true);
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
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								this.SetRequestingFlag(false);
								return;
							}
							let DataModel = result.data.ResultData.Binding10_2Info.data0;
							let Result = DataModel.Result;
							if (Result == 0) {
								Config.ShowMessage(DataModel.Msg);
								Config.PopAudioContext(false);
								this.SetRequestingFlag(false);
								return;
							}
							this.InnerCartonLabelCount = DataModel.FMaxlabelCount;
							this.ScannerLabelCount = DataModel.FlabelCount;
							if (this.InnerCartonLabelCount != 0 && this.ScannerLabelCount != 0 &&
								this.InnerCartonLabelCount == this.ScannerLabelCount) {
								this.IsPack = false;
							}
							Config.ShowMessage(DataModel.Msg);
							Config.PopAudioContext(true);
							this.SetRequestingFlag(false);
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							this.SetRequestingFlag(false);
						},
					    complete: (resultcomp) => {
						    let ResultMsg = resultcomp.data.ResultMsg;
						    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);							
					    }
				    }
					});
				}
			},
			//根据外箱获取内盒列表
			GetLabelByPackBarCode: function() {
				if (!this.IsShowBindingView) {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
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
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							this.DetailListData = result.data.ResultData.LabelInfo.data0;
							uni.hideLoading();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
						},
					    complete: (resultcomp) => {
						    let ResultMsg = resultcomp.data.ResultMsg;
						    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);							
					    }
					}
					});
				}
			},
			//扫描条码
			ScanBarCode: function() {
				if (this.IsPack) {
					this.Binding();
					this.GetLabelByPackBarCode();
				} else {
					this.GetLabelByBarCode();
				}
			},
			//切换扫描外箱模式
			SwitchCartonMode: function() {
				let me = this;
				uni.showModal({
					title: '提示',
					content: '是否要切换外箱扫描模式？',
					success: function(result) {
						if (result.confirm) {
							me.ClearPageData();
							Config.ShowMessage('切换外箱扫描模式成功！')
							Config.PopAudioContext(true);
						}
					}
				});
			},
			//清空界面数据
			ClearPageData: function() {
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
			GetSelectLabel: function() {
				this.SelectLabel = '';
				for (var i = 0; i < this.DetailListData.length; i++) {
					if (this.DetailListData[i].FIsChecked) {
						this.SelectLabel += '\'' + this.DetailListData[i].FBarCode + '\'' + ',';
					}
				}
				if (this.SelectLabel != '') {
					this.SelectLabel = this.SelectLabel.substr(0, this.SelectLabel.length - 1);
				}
			},
			//全选/反选内箱列表项
			SelectAllLabel: function() {
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;
				}
				this.IsSelectAllLabel = !this.IsSelectAllLabel;
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
		width: 100%;
	}
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		box-sizing: border-box;		
	}

	/* Tab栏样式 */
	.tab-container {		
		/* height: 0rpx; */
		background-color: #F4F4F4;
		/* padding-bottom: 20rpx; */
		position: relative;
		width: 100vw; /* 基于视口宽度 */
		height: 12vh; /* 基于视口高度的百分比，适配竖屏 */
		max-height: 80px; /* 720高度兜底 */
		min-height: 60px; /* 640高度兜底 */
		display: flex;
		justify-content: space-between;
		align-items: center;		
		box-sizing: border-box;
	}	
	
	.tab-item {
		font-size: 40rpx; /* 固定字体大小，适配360宽 */
		position: relative;
		width: 50%;
		text-align: center;		
		box-sizing: border-box;	
		line-height: 90rpx; /* 行高匹配Tab栏高度，避免文字溢出 */
	}
	
	.tab-item.left, .tab-item.right {
		margin: 0;
	}
	
	.tab-line {
		position: absolute;
		width: 15vw; /* 基于视口宽度的线条宽度 */
		height: 2px; /* 固定细线条，适配不同分辨率 */
		bottom: 1vh; /* 基于视口高度的底部间距 */
		transition: background-color 0.3s ease;
	}
	
	.left-line {
		left: 25vw;
		transform: translateX(-50%);
	}
	
	.right-line {
		right: 25vw;
		transform: translateX(50%);
	}

	/* 内容区域 - 弹性适配 */
	.content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start; 
		align-items: stretch; 		
		padding: 1% 2%; /* 百分比内边距 */
		box-sizing: border-box;
	}

	/* 汇总模块样式 */
	.summary {
		width: 100%;
	}
	
	/* 进度条样式：填充整行 + 底部间距（调大间距） */
	.summary-progress {
	  width: 100% !important; /* 强制覆盖组件内置宽度 */
	  max-width: 100% !important; /* 防止组件限制最大宽度 */
	  margin: 0 0 50rpx 0 !important; /* 进度条底部间距从30rpx调大到50rpx */
	  display: block !important; /* 确保以块级元素占满整行 */
	  padding: 0 !important; /* 清空内置内边距 */
	}
	
	.summary-form {
		width: 100%;
	}
	
	.form-row {
		display: flex;
		align-items: center;
		justify-content: flex-start; 
		/* 核心：表单行之间的间距从30rpx调大到40rpx（可自行调整） */
		margin-bottom: 80rpx;
		width: 100%;
		/* 可选：增加行高，让单行内容更舒展 */
		line-height: 40rpx;
	}
	
	.form-label {
		font-size: 40rpx;
		text-align: left; 
		flex-shrink: 0; 
		margin-right: 250rpx;
	}
	
	.form-value {
		font-size: 45rpx;
		text-align: right;
		flex-shrink: 1;
	}
	
	.scannedcount {
		font-size: 50rpx;
		color: #1AAD19;
	}

	/* 明细模块样式 */
	.detail {
		width: 100%;
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	
	.detail-btns {
		display: flex;
		justify-content: space-between;
		/* 按钮区与列表间距适配 */
		margin-bottom: 4vw; 
		/* 按钮之间的基础间距 */
		gap: 12vw; 
		padding: 0 2vw;
		box-sizing: border-box;
	}
	
	.btn {
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		/* 内边距适配 */
		padding: 2.5vw 4vw;
		/* 字体大小适配 */
		font-size: 3.8vw;
		/* 按钮宽度适配 */
		flex: 1;
		/* 最小宽度限制，防止挤压 */
		min-width: 200rpx;
		/* 最大宽度限制，适配宽屏 */
		max-width: 250rpx;
		/* 居中显示文字 */
		text-align: center;
		border: none;
	}
	
	.selectlabel {
		margin: 0;
	}
	
	.deletelabel {
		margin: 0;
	}
	
	.scrollview {
		/* 高度适配：基于视口高度计算 */
		height: calc(100vh - 20vh - 12vh);
		min-height: 520rpx; /* 360*640兜底 */
		max-height: 600rpx; /* 360*720兜底 */
		width: 100%;
		box-sizing: border-box;
	}
	
	.detaillist {
		width: 100%;
		/* 可选：明细列表项之间增加间距 */
		--uni-list-item-padding: 20rpx 0;
	}

	/* 通用选中样式 */
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline {
		background-color: #007AFF;
	}
</style>