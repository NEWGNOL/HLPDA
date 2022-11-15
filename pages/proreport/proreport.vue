<template>
	<view class="container">
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowProReportSum()">
			</billstatus>
			<scroll-view class="sumscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in SummaryListData" :key="index" :title="'车间名称：'+ item.FDeptName + '\n' + '班组名称：' + item.FTeamName
			       + '\n' + '制单人：' + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo"
						:note="'单据状态：' + item.FStatus" clickable :isshowicon="item.FIsScanned"
						v-on:click="GetProReportByList(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
			<!-- @TouchStart="ItemTouchStart" @TouchEnd="ItemTouchEnd" @LongPress="ItemLongPress(item)" -->
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="addproreport" v-on:click="AddProReport()">新增</button>
			<button class="auditproreport" v-on:click="AuditProReport()">审核</button>
			<button class="unauditproreport" v-on:click="UnAuditProReport()">反审</button>
			<button class="deletebill" v-on:click="DeleteProreportBill()">删除</button>

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty"
					v-bind:class="{billnofull : ProReportBillNo != '空'}">{{ProReportBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">车间名称：</text>
				<navigator url="/pages/basic/workshopquery" hover-class="navigator-hover">
					<view class="data">{{SelectWorkShopArray[1]}}</view>
				</navigator>
				<view class="dataline"></view>

				<text class="title">班组名称：</text>
				<navigator url="/pages/basic/teamquery" hover-class="navigator-hover">
					<view class="data">{{SelectTeamArray[1]}}</view>
				</navigator>
				<view class="dataline"></view>

				<text class="title">完工日期：</text>
				<picker mode="date" :value="FinishDate" :start="StartDate" :end="EndDate" @change="FinishDateChange">
					<view class="data">{{FinishDate}}</view>
				</picker>
				<view class="dataline"></view>
			</view>

			<scroll-view class="unselectinfoscrollview" v-bind:class="{selectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true" v-show="IsMotorDepartment">
				<uni-list>
					<FillQty v-for="(item,index) in InfoListData" :key="index" :title="item.FNumber + '/' + item.FModel
					 + '\n' + '源单编号：' + item.FSrcBillNo + '\n' + '批号：' + item.FGMPBatchNo + '\n' + '进度：' + item.FSumQty
					 + '/' + item.FICMOQty + item.FUnitName + '\xa0\xa0\xa0\xa0\xa0' + (item.FSumQty/item.FOutPackPreQty/item.FInPackPreQty).toFixed(2) + '件'" :rownumber="index + 1"
					 isshowprogress v-bind:percent="Math.round((item.FSumQty / item.FICMOQty) * 100, 0)" clickable
					 v-on:click="GetProReportInfoExpandByFillQty(item)" @ButtonClick="OpenQtyPopupWindow()">
					</FillQty>
				</uni-list>
			</scroll-view>
			
			<scroll-view class="unselectinfoscrollview" v-bind:class="{selectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true" v-show="!IsMotorDepartment">
				<uni-list>
					<uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="item.FNumber + '/' + item.FModel
					 + '\n' + '源单编号：' + item.FSrcBillNo + '\n' + '批号：' + item.FGMPBatchNo + '\n' + '进度：' + item.FSumQty
					 + '/' + item.FICMOQty + item.FUnitName + '\xa0\xa0\xa0\xa0\xa0' + (item.FSumQty/item.FOutPackPreQty/item.FInPackPreQty).toFixed(2) + '件'" isshowprogress
					 v-bind:percent="Math.round((item.FSumQty / item.FICMOQty) * 100, 0)" clickable
					 v-on:click="GetProReportInfoExpand(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>




		<view class="proreportview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<text class="scanned">已扫描条码：</text>
			<text class="queryall" clickable v-on:click="GetProReportDetail()">查看全部</text>

			<scroll-view class="detailscrollview" scroll-y="true">
				<text class="detailtitle">物料编码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FNumber : '空'}}</text>
				<text class="detailtitle">物料名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FName : '空'}}</text>
				<text class="detailtitle">标签类型：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FBarCodeType : '空'}}</text>
				<text class="detailtitle">订单号：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FSOBillNo != null) ? this.ProreportInfoItem.FSOBillNo : '空'}}</text>
				<text class="detailtitle">批号：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FGMPBatchNo != null) ? this.ProreportInfoItem.FGMPBatchNo : '空'}}</text>
				<text class="detailtitle">计划生产数量：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FAuxQty != null) ? this.ProreportInfoItem.FAuxQty : '空'}}</text>
				<text class="detailtitle">计划开工日期：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FPlanCommitDate != null) ? this.ProreportInfoItem.FPlanCommitDate : '空'}}</text>
				<text class="detailtitle">实际完工日期：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FFinishDate != null) ? this.ProreportInfoItem.FFinishDate : '空'}}</text>
				<text class="detailtitle">生产预测单号：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FPPOrderBillNo != null) ? this.ProreportInfoItem.FPPOrderBillNo : '空'}}</text>
				<text class="detailtitle">班组代码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FTeamNumber : '空'}}</text>
				<text class="detailtitle">班组名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FTeamName : '空'}}</text>
				<text class="detailtitle">车间代码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FDeptNumber : '空'}}</text>
				<text class="detailtitle">车间名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FDeptName : '空'}}</text>
				<text class="detailtitle">计量单位代码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FUnitNumber : '空'}}</text>
				<text class="detailtitle">计量单位名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FUnitName : '空'}}</text>
				<text class="detailtitle">箱数：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FInPackPreQty : '空'}}</text>
				<text class="detailtitle">每箱数量：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FOutPackPreQty : '空'}}</text>
			</scroll-view>
		</view>



		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}" v-on:click="SwitchTab(0)">汇总</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">单据</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>
		
		<OutStorageKeyboard class="keyboard" @confirm="CloseQtyPopupWindow" @exit="CloseQtyPopupWindowDirect"
			v-show="IsOpenDigitKeyboard"></OutStorageKeyboard>
	</view>
</template>


<script>
	import Config from '../../common/config.js';
	import FillQty from '../../components/fill-qty/fill-qty.vue';
	import OutStorageKeyboard from '../../components/outstorage-keyboard/outstorage-keyboard.vue';
	export default {
		components: {
			Config,
			FillQty,
			OutStorageKeyboard			
		},
		data() {
			return {
				TabSelectedIndex: 1,
				SearchValue: '',
				SelectStatus: '未审核',
				ProReportInterId: 0,
				ProReportBillNo: '空',
				ProReportSrcInterId: 0,				
				IsBillHeadVisible: true,
				IsRequesting: false,
				SelectWorkShopArray: [0, '请选择车间'],
				SelectTeamArray: [0, '请选择班组'],
				StatusArray: ['未审核', '已审核', '全部'],
				FinishDate: DateFormat({
					format: true
				}),
				ItemTouchStartDate: null,
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				SummaryListData: [],
				InfoListData: [],				
				ProreportInfoItem: null,
				ProreportItem: null,
				TouchStartX: 0,
				ItemTouchStartX: 0,
				LongPressTime: 2,
				SlidingValue: 100,
				Animation: null,
				AnimationData: [],
				IsStopAnimation: false,
				IsMotorDepartment: false,
				IsOpenDigitKeyboard: false,
				UserDepartment: '',
				Main: '',
				Receiver: ''
			}
		},
		onLoad() {
			//this.InitAnimation();
			this.AddListener();
			this.GetDepartmentByUserId();
			this.GetGblSettingBySignalKey();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
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
					me.ScanBarCode(Barcode);
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			//初始化动画
			InitAnimation: function() {
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
				this.Animation = animation;
			},
			//开启动画
			StartAnimation: function() {
				if (!this.IsStopAnimation) {
					// 定义动画内容
					this.Animation.translateX(80).step();
					// 导出动画数据传递给data层
					this.AnimationData = this.Animation.export();
					//三秒内不滚动时触发
					var timer = setTimeout(() => {
						this.IsStopAnimation = false;
						this.Animation.translateX(0).step()
						this.AnimationData = this.Animation.export()
					}, 1000);
					this.IsStopAnimation = true;
				}
			},
			//获取手指滑动页面的起点
			TouchStart: function(e) {
				this.TouchStartX = e.changedTouches[0].clientX;
			},
			//获取手指滑动页面的终点
			TouchEnd: function(e) {
				let TouchEndX = e.changedTouches[0].clientX;
				if (this.TouchStartX - TouchEndX >= this.SlidingValue && this.TabSelectedIndex < 2) {
					this.SlidingPage(true);
				}
				if (TouchEndX - this.TouchStartX >= this.SlidingValue && this.TabSelectedIndex > 0) {
					this.SlidingPage(false);
				}
			},
			//获取手指滑动的起点
			ItemTouchStart: function(e) {
				this.ItemTouchStartDate = new Date();
				this.ItemTouchStartX = e.changedTouches[0].clientX;
			},
			//获取手指滑动的终点
			ItemTouchEnd: function(e) {
				let me = this;
				let ItemTouchEndDate = new Date();
				let ItemTouchEndX = e.changedTouches[0].clientX;
				let LongPressTime = CalDateDiff(ItemTouchEndDate, me.ItemTouchStartDate);
				if (LongPressTime >= me.LongPressTime && me.ItemTouchStartX == ItemTouchEndX) {
					uni.showModal({
						title: '提示',
						content: '是否需要删除单据编号为' + me.ProreportItem.FBillNo + '的汇报单？',
						success: function(result) {
							if (result.confirm) {
								uni.request({
									url: uni.getStorageSync('OtherUrl'),
									method: 'POST',
									data: {
										ModuleCode: 'ICMORpt2_9',
										token: uni.getStorageSync('token'),
										ModuleParam: {
											FId: me.ProreportItem.FId,
											Result: 0,
											Msg: ''
										}
									},
									success: (resdelete) => {
										let ResultCode = resdelete.data.ResultCode;
										let ResultMsg = resdelete.data.ResultMsg;
										if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
											Config.PopAudioContext(false);
											Config.ShowMessage('账号登录异常，请重新登录！');
											return;
										}
										let DataParam = resdelete.data.ResultData.ICMORpt2_9
											.dataparam;
										ResultCode = DataParam.Result;
										if (ResultCode == 0) {
											Config.PopAudioContext(false);
											Config.ShowMessage(DataParam.Msg);
											return;
										}

										uni.request({
											url: uni.getStorageSync('OtherUrl'),
											method: 'POST',
											data: {
												ModuleCode: 'getPdaICMORptList',
												token: uni.getStorageSync('token'),
												PageIndex: 0,
												PageSize: 50,
												PageRefresh: 0,
												ModuleParam: {
													FBillNo: this.SearchValue,
												}
											},
											success: (res) => {
												let ResultCode = res.data
													.ResultCode;
												let ResultMsg = res.data.ResultMsg;
												if (ResultCode == 'FAIL' &&
													ResultMsg == '不存在的Token') {
													Config.PopAudioContext(false);
													Config.ShowMessage(
														'账号登录异常，请重新登录！');
													return;
												}
												this.SummaryListData = res.data
													.ResultData.PdaICMORptListInfo
													.data0;
											},
											fail: () => {
												Config.PopAudioContext(false);
												Config.ShowMessage('请求数据失败！');
											}
										});
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
									this.SetRequestingFlag(false);
						        }
								});
							}
						}
					});
				}
			},
			//记录选中的单据编号
			ItemLongPress: function(item) {
				this.ProreportItem = item;
			},
			//切换外箱标签是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//切换页签
			SwitchTab: function(Index) {
				this.TabSelectedIndex = Index;
				if (this.TabSelectedIndex == 0) {
					this.ShowProReportSum();
				} else if (this.TabSelectedIndex == 1) {
					this.ShowProReportInfo()
				} else {
					if(this.IsMotorDepartment){
						//this.GetProReportInfoExpandByFillQty(null);
					}
					else{
						this.GetProReportInfoExpand(null);
					}					
				}
			},
			//滑动页面
			SlidingPage: function(IsSlidingLeftPage) {
				if (IsSlidingLeftPage) {
					this.TabSelectedIndex++;
				} else {
					this.TabSelectedIndex--;
				}

				if (this.TabSelectedIndex == 0) {
					this.ShowProReportSum();
				} else if (this.TabSelectedIndex == 1) {
					this.ShowProReportInfo()
				} else {
					this.GetProReportInfoExpand(null);
				}
			},
			//设置请求标志
			SetRequestingFlag: function(IsRequesting) {
				this.IsRequesting = IsRequesting;
			},
			//打开数量弹窗
			OpenQtyPopupWindow: function() {				
				this.IsOpenDigitKeyboard = true;
			},
			CloseQtyPopupWindowDirect: function(e) {
				this.IsOpenDigitKeyboard = false;
			},
			//关闭数量弹窗
			CloseQtyPopupWindow: function(e) {
				if (e == null || e == '' || e == 0) {
					Config.ShowMessage('请填写要修改的散件数量！');
					Config.PopAudioContext(false);
					return;
				}
			
				this.IsOpenDigitKeyboard = false;
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'addPdaICMORptByHand',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProReportInterId,							
							FBillerID: uni.getStorageSync('FUserId'),			
							FICItemByHand: this.ProreportInfoItem.FItemId,
							FQtyByHand: e,
							FShouldSendQty: this.ProreportInfoItem.FICMOQty,
							FRealSendQty: this.ProreportInfoItem.FSumQty,							
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
						let ResultData = result.data.ResultData.AddPdaICMORptByHand;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.GetProReportByScan();
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
			//根据系统参数键获取对应的值
			GetGblSettingBySignalKey: function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetGblSettingBySignalKey',
						token: uni.getStorageSync('token'),						
						ModuleParam: {
							FSignalKey: 'DepartByProFillQty'							
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
						let FValue = result.data.ResultData.GetGblSettingBySignalKey.data0.FValue;
						this.IsMotorDepartment = (this.UserDepartment.indexOf(FValue) != -1 ? true : false);
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
			//根据用户内码查询部门信息
			GetDepartmentByUserId: function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getDepartmentByUserId',
						token: uni.getStorageSync('token'),						
						ModuleParam: {
							FUserId: uni.getStorageSync('FUserId')							
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
						this.UserDepartment = result.data.ResultData.GetDepartmentByUserId.data0.FName;
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
			//显示生产汇报汇总
			ShowProReportSum: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptList',
						token: uni.getStorageSync('token'),
						PageIndex: 0,
						PageRefresh: 0,
						ModuleParam: {
							FBillNo: this.SearchValue,
							FBillerID: uni.getStorageSync('FUserId'),
							FStatus: this.SelectStatus == '全部' ? '0,1' : (this.SelectStatus == '已审核' ? '1' :
								'0')
						}
					},
					success: (result) => {						
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.PopAudioContext(false);
							Config.ShowMessage('账号登录异常，请重新登录！');
							uni.hideLoading();
							return;
						}						
						this.SummaryListData = result.data.ResultData.PdaICMORptListInfo.data0;
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
			//扫描条码
			ScanBarCode: function(Barcode) {
				if (this.ProReportBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请新增汇报单！');
					return;
				}
				if (this.SelectWorkShopArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请填写车间！');
					return;
				}
				if (this.SelectTeamArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请填写班组！');
					return;
				}

				if (!this.IsRequesting) {
					this.SetRequestingFlag(true);
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'addPdaICMORpt',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.ProReportInterId,
								FBillNo: this.ProReportBillNo,
								FDeptId: this.SelectWorkShopArray[0],
								FTeamId: this.SelectTeamArray[0],
								FDate: this.FinishDate,
								FBillerID: uni.getStorageSync('FUserId'),
								FPackBarCode: Barcode,
								Result: 0,
								Msg: ''
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.PopAudioContext(false);
								Config.ShowMessage('账号登录异常，请重新登录！');
								uni.hideLoading();
								this.SetRequestingFlag(false);
								return;
							}
							let ResultData = result.data.ResultData.AddPdaICMORpt;
							let Result = ResultData.dataparam.Result;
							if (Result == 0) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultData.dataparam.Msg);
								uni.hideLoading();
								this.SetRequestingFlag(false);
								return;
							}
							Config.PopAudioContext(true);
							Config.ShowMessage(ResultData.dataparam.Msg);
							uni.hideLoading();
							this.SetRequestingFlag(false);
							this.GetProReportByScan();							
						},
						fail: () => {
							Config.PopAudioContext(false);
							Config.ShowMessage('请求数据失败！');
							uni.hideLoading();
							this.SetRequestingFlag(false);
							return;
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultMsg);
								uni.hideLoading();
								this.SetRequestingFlag(false);								
							}
						}
					});
				}
			},
			//新增生产汇报单
			AddProReport: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptMaxId',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							Result: 0,
							FId: 0,
							FBillNo: '',
							Msg: ''
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
						let DataModel = result.data.ResultData.PdaICMORpt.dataparam;
						this.ProReportInterId = DataModel.FId;
						this.ProReportBillNo = DataModel.FBillNo;
						this.ProReportSrcInterId = 0
						this.SelectWorkShopArray = [0, '请选择车间'];
						this.SelectTeamArray = [0, '请选择班组'];
						this.FinishDate = DateFormat({
							format: true
						});
						this.InfoListData = [];
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
			//审核生产汇报单
			AuditProReport() {
				if (this.SelectWorkShopArray[0] == 0) {
					Config.ShowMessage('请填写车间！');
					Config.PopAudioContext(false);					
					return;
				}
				if (this.SelectTeamArray[0] == 0) {
					Config.ShowMessage('请填写班组！');
					Config.PopAudioContext(false);					
					return;
				}
				if (this.InfoListData.length == 0) {
					Config.ShowMessage('汇报单无扫描数据！');
					Config.PopAudioContext(false);					
					return;
				}
				
				for(let i = 0; i < this.InfoListData.length; i++){
					let DataModel = this.InfoListData[i];					
					if(DataModel.FSumQty > DataModel.FICMOQty){
					   Config.ShowMessage('物料编码为' + DataModel.FNumber + '扫描数量大于订单数量，请检查！');
					   Config.PopAudioContext(false);
					   return;
					}
				}

				if (!this.IsRequesting) {
					this.SetRequestingFlag(true);
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'pdaICMORptToICMORpt',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.ProReportInterId,
								FBillNo: this.ProReportBillNo,
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
								this.SetRequestingFlag(false);
								return;
							}
							let DataParam = result.data.ResultData.PdaICMORptToICMORpt.dataparam;
							let Result = DataParam.Result;
							if (Result == 0) {
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
								this.SetRequestingFlag(false);
								return;
							}
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(true);							
							uni.hideLoading();
							this.SetRequestingFlag(false);
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);							
							uni.hideLoading();
							this.SetRequestingFlag(false);
							return;
						},
						complete: (resultcomp) => {							
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
								this.SetRequestingFlag(false);
							}
						}
					});
				}
			},
			//反审核生产汇报单
			UnAuditProReport: function() {
				if (this.ProReportBillNo == '空' || this.SelectWorkShopArray[0] == 0 || this.SelectTeamArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择需要反审核的汇报单！');
					return;
				}
				
				if (!this.IsRequesting) {
					this.SetRequestingFlag(true);
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'unPdaICMORptToICMORpt',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.ProReportInterId,
								Result: 0,
								Msg: ''
							}
						},
						success: (result) => {
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.PopAudioContext(false);
								Config.ShowMessage('账号登录异常，请重新登录！');
								uni.hideLoading();
								this.SetRequestingFlag(false);
								return;
							}
							let DataParam = result.data.ResultData.unPdaICMORptToICMORpt.dataparam;
							let Result = DataParam.Result;
							if (Result == 0) {
								Config.PopAudioContext(false);
								Config.ShowMessage(DataParam.Msg);
								uni.hideLoading();
								this.SetRequestingFlag(false);
								return;
							}
							Config.PopAudioContext(true);
							Config.ShowMessage(DataParam.Msg);
							uni.hideLoading();
							this.SetRequestingFlag(false);
						},
						fail: () => {
							Config.PopAudioContext(false);
							Config.ShowMessage('请求数据失败！');
							uni.hideLoading();
							this.SetRequestingFlag(false);
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultMsg);
								uni.hideLoading();
								this.SetRequestingFlag(false);
							}
						}
					});
				}
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.ProReportInterId = 0;
				me.ProReportBillNo = '空';
				me.ProReportSrcInterId = 0;				
				me.SelectWorkShopArray = [0, '请选择车间'];
				me.SelectTeamArray = [0, '请选择班组'];
				me.FinishDate = DateFormat({
					format: true
				});
			},
			//删除汇报单
			DeleteProreportBill: function() {
				if (this.ProReportBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择要删除的汇报单！');
					return;
				}
				
				let me = this;
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.ProReportBillNo + '的汇报单？',
					success: function(result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'ICMORpt2_9',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.ProReportInterId,
										Result: 0,
										Msg: ''
									}
								},
								success: (resdelete) => {
									let ResultCode = resdelete.data.ResultCode;
									let ResultMsg = resdelete.data.ResultMsg;
									if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
										Config.PopAudioContext(false);
										Config.ShowMessage('账号登录异常，请重新登录！');
										return;
									}
									let DataParam = resdelete.data.ResultData.ICMORpt2_9
										.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.PopAudioContext(false);
										Config.ShowMessage(DataParam.Msg);
										return;
									}
									me.ClearBillHeadData(me);
									if(me.IsMotorDepartment){
										me.GetProReportInfoExpandByFillQty(null);
									}
									else{
										me.GetProReportInfoExpand(null);
									}									
									Config.PopAudioContext(true);
									Config.ShowMessage(DataParam.Msg);
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
			//扫码汇报成功后获取最新汇报单信息
			GetProReportByScan: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptSumInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProReportInterId
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
						this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
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
			//根据列表选中的汇报单获取最新汇报单信息
			GetProReportByList: function(item) {
				if (!this.IsRequesting) {
					this.SetRequestingFlag(true);
					uni.showLoading({
						title: 'Loading',
						mask: true
					});					
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaICMORptSumInfo',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: item.FId
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								this.SetRequestingFlag(false);
								Config.PopAudioContext(false);
								Config.ShowMessage('账号登录异常，请重新登录！');
								uni.hideLoading();
								return;
							}
							this.SetRequestingFlag(false);
							this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
							uni.hideLoading();
						},
						fail: () => {
							this.SetRequestingFlag(false);
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
								this.SetRequestingFlag(false);
						    }
						}
					});					
					this.TabSelectedIndex = 1;
					this.ProReportInterId = item.FId;
					this.ProReportBillNo = item.FBillNo;
					this.SelectWorkShopArray = [item.FDeptId, item.FDeptName];
					this.SelectTeamArray = [item.FTeamId, item.FTeamName];
					this.FinishDate = item.FDate;
				}
			},
			//显示生产汇报单信息
			ShowProReportInfo: function() {
				if (this.ProReportInterId != 0) {
					if (!this.IsRequesting) {
						this.SetRequestingFlag(true);
						uni.showLoading({
							title: 'Loading',
							mask: true
						});
						uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								ModuleCode: 'getPdaICMORptSumInfo',
								token: uni.getStorageSync('token'),
								ModuleParam: {
									FId: this.ProReportInterId
								}
							},
							success: (result) => {
								let ResultCode = result.data.ResultCode;
								let ResultMsg = result.data.ResultMsg;
								if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
									Config.PopAudioContext(false);
									Config.ShowMessage('账号登录异常，请重新登录！');
									uni.hideLoading();
									this.SetRequestingFlag(false);
									return;
								}								
								this.SetRequestingFlag(false);
								this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
							},
							fail: () => {
								Config.PopAudioContext(false);
								Config.ShowMessage('请求数据失败！');								
								this.SetRequestingFlag(false);
							},
							complete: (resultcomp) => {
							    let ResultMsg = resultcomp.data.ResultMsg;
							    if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
									Config.PopAudioContext(false);
									Config.ShowMessage(ResultMsg);									
							    }
								uni.hideLoading();
								this.SetRequestingFlag(false);
							}
						});
					}
				}
			},
			//根据汇报单信息获取明细
			GetProReportDetail: function() {
				if(this.ProReportInterId != 0 && this.ProReportSrcInterId != 0){
				   uni.navigateTo({
				   url: '/pages/proreport/cartonlabeldetail?ProReportInterId=' + this.ProReportInterId +
				   		'&ProReportSrcInterId=' + this.ProReportSrcInterId
				   });
				}				
			},
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpandByFillQty: function(item) {
				if (item != null) {					
					this.ProreportInfoItem = item;
					this.ProReportSrcInterId = item.FSrcInterId;
				} else {
					this.ProreportInfoItem = null;
				}
			},			
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpand: function(item) {
				if (item != null) {					
					this.TabSelectedIndex = 2;
					this.ProreportInfoItem = item;
					this.ProReportSrcInterId = item.FSrcInterId;
				} else {
					this.ProreportInfoItem = null;
				}
			},
			//选择完工日期
			FinishDateChange(e) {
				this.FinishDate = e.detail.value
			},
			//条件搜索汇报单列表
			ValueChanged: function() {
				this.ShowProReportSum();
			}
		}
	}
	//获取选中的日期格式化
	function DateFormat(type) {
		const CurrentDate = new Date();
		let Year = CurrentDate.getFullYear();
		let Month = CurrentDate.getMonth() + 1;
		let Day = CurrentDate.getDate();
		let Hour = CurrentDate.getHours();
		let Minute = CurrentDate.getMinutes();
		let Second = CurrentDate.getSeconds();

		if (type === 'start') {
			Year = Year - 60;
		} else if (type === 'end') {
			Year = Year + 2;
		}
		Month = Month > 9 ? Month : '0' + Month;;
		Day = Day > 9 ? Day : '0' + Day;
		if (type != '') {
			return `${Year}-${Month}-${Day}`;
		}
		return `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
	}
	//计算两个时间的时间差
	function CalDateDiff(StartDate, EndDate) {
		var DateDiff = StartDate.getTime() - EndDate.getTime(); //时间差的毫秒数
		var Leave1 = DateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
		var Hour = Math.floor(Leave1 / (3600 * 1000)) //计算出小时数	
		var Leave2 = Leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
		var Minutes = Math.floor(Leave2 / (60 * 1000)) //计算相差分钟数
		var Leave3 = Leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
		var Seconds = Math.round(Leave3 / 1000) //计算相差秒数
		return Seconds;
	}
</script>

<style>	
	.addproreport {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 23upx;
		margin-top: 20upx;
	}

	.deletebill {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 206upx;
		margin-top: -96upx;
	}

	.auditproreport {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 389upx;
		margin-top: -96upx;
	}

	.unauditproreport {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 572upx;
		margin-top: -96upx;
	}

	.billhead {
		width: 100%;
		margin-top: 50upx;
	}

	.title {
		display: flex;
		margin-left: 50upx;
		font-size: 40upx;
	}

	.billnoempty {
		display: flex;
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 300upx;
		text-align: center;
		color: #777777;
	}

	.billnofull {
		display: flex;
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 300upx;
		text-align: center;
		color: #000000;
	}

	.detailtitle {
		display: flex;
		font-size: 35upx;
		margin-top: 30upx;
		margin-left: 30upx;
	}

	.detaildata {
		display: flex;
		text-align: center;
		font-size: 35upx;
		margin-top: -50upx;
		margin-left: 270upx;
	}

	.data {
		display: flex;
		width: 250upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 370upx;
		text-align: center;
	}

	.dataline {
		width: 60%;
		height: 5upx;
		background-color: #4CD964;
		margin-left: 250upx;
	}

	.proreportview {
		width: 100%;
		height: 950upx;
	}

	.sumscrollview {
		width: 100%;
		height: 950upx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 550upx;
		margin-top: 50upx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 50upx;
	}

	.detailscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 20upx;
	}

	.selecttab {
		color: #007AFF;
	}

	.selecttabline {
		background-color: #007AFF;
	}

	.tabbackground {
		position: absolute;
		width: 100%;
		height: 100upx;
		margin-top: 660upx;
		background-color: #F4F4F4;
	}

	.tableft {
		position: absolute;
		font-size: 45upx;
		margin-top: 20upx;
		margin-left: 40upx;
	}

	.tabmiddle {
		position: absolute;
		font-size: 45upx;
		margin-top: 20upx;
		margin-left: 330upx;
	}

	.tabright {
		position: absolute;
		font-size: 45upx;
		margin-top: 20upx;
		margin-left: 630upx;
	}

	.tableftline {
		position: absolute;
		width: 15%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 30upx;
	}

	.tabmiddleline {
		position: absolute;
		width: 15%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 320upx;
	}

	.tabrightline {
		position: absolute;
		width: 15%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 620upx;
	}

	.search {
		position: absolute;
		width: 70%;
		margin-left: 5upx;
	}

	.billstatus {
		position: absolute;
		margin-top: -90upx;
		margin-left: 570upx;
	}

	.scanned {
		display: flex;
		font-size: 40upx;
		margin-left: 30upx;
		margin-top: 20upx;
	}

	.queryall {
		display: flex;
		font-size: 40upx;
		color: #007AFF;
		margin-left: 570upx;
		margin-top: -60upx;
	}
</style>
