<template>
	<view class="container">
		<view class="instorageview" v-show="TabSelectedIndex == 0">	
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<BillStatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowPOOrderInfo('')">
			</BillStatus>
			
			<scroll-view class="instoragelistview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in POOrderListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo
					+ '\n' + '供应商：' + item.FSupplyName" clickable @click="GetQueryStorageInfo(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>			
		</view>
		
		<view class="instorageview" v-show="TabSelectedIndex == 1">
			<view class="pagehead">				
				<button class="addstoragein" v-on:click="AddStorageInBillNo()">新增</button>
				<button class="auditstoragein" v-on:click="AuditStorageIn()" v-show="IsAuditStorageIn">审核</button>
				<button class="unauditstoragein" v-on:click="UnAuditStorageIn()" v-show="!IsAuditStorageIn">反审</button>
				<button class="deletestoragein" v-on:click="DeleteStorageIn()">删除</button>
			</view>			
			
			<view class="billhead" v-show="IsBillHeadVisible">		
				<text class="title">单据编号：</text>
				<view class="data">{{StorageInBillNo}}</view>
				<view class="dataline"></view>	
				
				<text class="title">入库日期：</text>
				<picker mode="date" :value="StorageInDate" :start="StartDate" :end="EndDate"
					@change="StorageInDateChange">
					<view class="data">{{StorageInDate}}</view>
				</picker>
				<view class="dataline"></view>
			
				<text class="title">收料仓库：</text>
				<navigator url="/pages/basic/stock" hover-class="navigator-hover">
					<view class="data">{{SelectWareHouseArray[1]}}</view>
				</navigator>				
				<view class="dataline"></view>
				
				<text class="title">扫码进度：</text>
				<view class="data">{{ScanProgress}}</view>
				<view class="dataline"></view>
			</view>
			
			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<FillQty v-for="(item,index) in POOrderGroupData" :key="index" :title="item.FModel 
			 		+ '/' + item.FNumber + '\n' + item.FShouldSendQty + '只/' + (item.FShouldSendQty/item.FInPackPreQty)
					.toFixed(2)+ '件' + '\n' + item.FRealSendQty + '只/' + (item.FRealSendQty/item.FInPackPreQty)
					.toFixed(2) + '件' + '\n' + '仓库：' + item.FStockName" :rownumber="index + 1" :ishighlight="item.FHighLight"
					:isshowbutton="false" v-bind:percent="Math.round((item.FRealSendQty / item.FShouldSendQty) * 100, 0)"
					clickable v-on:click="GetPOOrderInfoExpand(item)">
					</FillQty>
				</uni-list>
			</scroll-view>
		</view>
		
		<view class="instorageview" v-show="TabSelectedIndex == 2">
			<view class="pagehead">
				 <text class="scanned">已扫描条码：</text>
				 <text class="queryall" clickable v-on:click="GetStorageInCartonDetail()">查看全部</text>
			</view>			
			
			<text class="detailtitle">物料编码：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FNumber : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料型号：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FModel : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料名称：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FItemName : '空'}}</text>
			<view class="listline"></view>	
					
			<text class="detailtitle">采购订单编号：</text>
			<text class="detaildata">{{this.StorageInSrcBillNo}}</text>
			<view class="listline"></view>			
		</view>
		
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">汇总</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">单据</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	import FillQty from '../../components/fill-qty/fill-qty.vue';	
	import BillStatus from '../../components/billstatus/billstatus.vue';
	export default {
		components: {
			Config,
			FillQty,			
			BillStatus
		},
		data() {
			return {
				StorageInterId: 0,
				StorageInBillNo: '空',
				StorageInSrcInterId: 0,
				StorageInSrcBillNo: '空',
				ScanProgress: '空',
				SelectPOOrderModel: null,
				SelectGroupModel: null,
				SelectItems: '',				
				SelectWareHouseArray: [0, '请选择收料仓库'],
				SearchValue: '',
				TabSelectedIndex: 1,
				StorageInDate: Config.DateFormat({
					format: true
				}),
				StartDate: Config.DateFormat('start'),
				EndDate: Config.DateFormat('end'),
				POOrderListData: [],				
				POOrderGroupData: [],
				SelectStatus: '未审核',
				StatusArray: ['未审核', '已审核','全部'],
				IsBillHeadVisible: true,
				IsAddStorageIn: true,
				IsAuditStorageIn: true,
				Main: '',
				Receiver: ''
			}
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		onShow() {
			this.ShowPOOrderGroupInfo();
		},
		onLoad() {
			this.AddListener();
			this.ShowPOOrderInfo('');
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
					if (me.TabSelectedIndex == 0) {
						me.ShowPOOrderInfo(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},	
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.StorageInSrcInterId = 0;
				me.StorageInSrcBillNo = '空';	
				me.ScanProgress = '空';			
				me.SelectWareHouseArray = [0, '请选择收料仓库'];				
				me.StorageInDate = Config.DateFormat({
					format: true
				});
				me.GroupListData = [];
				me.SelectGroupModel = null;
			},
			RefreshListByChecked: function(item){
			   for(let i = 0; i < this.POOrderListData.length; i++){
				   let DataModel = this.POOrderListData[i];
				   DataModel.FIsChecked = (DataModel.FBillNo == item.FBillNo) ? true : false;				   
			   }
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;					
				}
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//切换审核标志
			SwitchAuditFlag: function(IsAuditStorageIn){
				this.IsAuditStorageIn = IsAuditStorageIn;				
			},
			//扫描条码做入库
			ScanBarCode: function(Barcode) {
				if (this.StorageInterId == 0 && this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请新增入库单！');
					return;
				}				
				if (this.SelectWareHouseArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择收料仓库！');
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
						ModuleCode: 'Purch6_2',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,							
							FBillNo: this.StorageInBillNo,
							FDate: this.StorageInDate,
							FBillerID: uni.getStorageSync('FUserId'),
							FPackBarCode: Barcode,							
							FStorageId: this.SelectWareHouseArray[0],
							FStorageBinId: 0,
							FLabelQty: 0,
							FItemId: 0,
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
						let ResultData = result.data.ResultData.Purch6_2;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						//this.ShowPOOrderGroupInfo();
						this.ShowPOOrderGroupInfoByCache(ResultData.dataparam.FLabelQty, ResultData.dataparam.FItemId);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);						
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
			//显示采购订单信息
			ShowPOOrderInfo: function(Barcode) {				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Purch6_5',
						token: uni.getStorageSync('token'),
						ModuleParam: {						
							FBillNo: this.SearchValue,
							FStatus: this.SelectStatus == '全部' ? '0,1' : (this.SelectStatus == '已审核' ? '1' :
							'0'),
							FBillerID: uni.getStorageSync('FUserId'),
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
						this.POOrderListData = result.data.ResultData.Purch6_5
							.data0;							
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);							
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
			//新增入库单编号
			AddStorageInBillNo: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageInRptMaxId',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FClassType: 1,
							Result: 0,
							FId: 0,
							FBillNo: '',
							FStatus: 0,
							FStatusCN: '',
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
						
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.ShowStorageInBillHeadInfo(DataModel);
						this.SwitchAuditFlag(true);
						Config.ShowMessage('新增成功！');
						Config.PopAudioContext(true);	
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
			//统计单据数量
			StatBillQty: function() {
				let FShouldSendQty = 0;
				let FRealSendQty = 0;
				for (let i = 0; i < this.POOrderGroupData.length; i++) {
					let DataModel = this.POOrderGroupData[i];
					FShouldSendQty += parseFloat((DataModel.FShouldSendQty / DataModel.FInPackPreQty).toFixed(2));
					FRealSendQty += parseFloat((DataModel.FRealSendQty / DataModel.FInPackPreQty).toFixed(2));
				}
				this.ScanProgress = FRealSendQty.toFixed(2) + '件' + '/' + FShouldSendQty.toFixed(2) + '     件';
			},
			//获取选中单据的物料信息
			GetBillSelectItem: function() {
				this.SelectItems = '';
				for (var i = 0; i < this.POOrderGroupData.length; i++) {
					let DataModel = this.POOrderGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
			},
			GetQueryStorageInfo: function(item){				
				if(item.FStatus == "未审核"){
				   this.SwitchAuditFlag(true);
				}
				else{
				   this.SwitchAuditFlag(false);
				}
				this.GetStorageInfo(item);
				this.ShowPOOrderGroupInfo();
				this.SwitchTab(1);				
			},
			//获取入库单信息
			GetStorageInfo: function(item){
				this.StorageInterId = item.FId;
				this.StorageInBillNo = item.FBillNo;
				this.StorageInDate = item.FDate;
				this.StorageInSrcBillNo = item.FSrcBillNo
			},
			//显示采购订单分组信息
			ShowPOOrderGroupInfo: function() {	
				if(this.StorageInterId != 0 && this.StorageInBillNo != '空'){
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'Purch6_8',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.StorageInterId
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext();
								uni.hideLoading();
								return;
							}
							this.POOrderGroupData = result.data.ResultData.Purch6_8.data0;	
							this.StatBillQty();
							//this.GetBillSelectItem();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext();						
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
			},
			//显示采购订单分组信息
			ShowPOOrderGroupInfoByCache: function(FLabelQty, FItemId){
				for(let i = 0; i< this.POOrderGroupData.length; i++){
					if(this.POOrderGroupData[i].FItemID == FItemId){						
						this.POOrderGroupData[i].FHighLight = -1;
						this.POOrderGroupData[i].FRealSendQty += FLabelQty;						
					}
					else{
						this.POOrderGroupData[i].FHighLight = 0;
					}	
				}				
				this.POOrderGroupData.sort(x => x.FHighLight);
			},
			//显示入库单单据头信息
			ShowStorageInBillHeadInfo: function(DataModel){
				this.StorageInterId = DataModel.FId;
				this.StorageInBillNo = DataModel.FBillNo;
				this.StorageInDate = Config.DateFormat({
					format: true,
				});
				this.SelectWareHouseArray = [0, '请选择收料仓库'];
				this.StorageInListData = [];
				this.POOrderGroupData = [];
				this.SelectGroupModel = null;
			},
			GetPOOrderInfoExpand: function(item){
				this.SelectGroupModel = item;
			},
			//获取入库单外箱明细信息
			GetStorageInCartonDetail: function() {
				if(this.StorageInterId != 0 &&this.SelectGroupModel != null){				   
				   uni.navigateTo({
				   	    url: '/pages/purchaseinstorage/cartonlabeldetail?StorageInterId=' + this.StorageInterId +
				   		'&FItemId=' + this.SelectGroupModel.FItemId
				   });
				}					
			},			
			//审核入库单
			AuditStorageIn: function() {
			    if (this.StorageInterId == 0 && this.StorageInBillNo == '空') {
			    	Config.PopAudioContext(false);
			    	Config.ShowMessage('请新增或者选择入库单！');
			    	return 0;
			    }
				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Purch6_3',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							Result: 0,
							FStatus: 0,
							FStatusCN: '',
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
						let DataParam = result.data.ResultData.Purch6_3.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
						this.SwitchAuditFlag(false);												
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
			//反审核入库单
			UnAuditStorageIn: function() {
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择入库单！');
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
						ModuleCode: 'Purch6_4',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FID: this.StorageInterId,
							Result: 0,
							FStatus: 0,
							FStatusCN: '',
							Msg: ''
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
						let DataParam = result.data.ResultData.Purch6_4.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
						this.SwitchAuditFlag(true);						
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
			//删除外购入库单
			DeleteStorageIn: function() {
				if (this.StorageInterId == 0 && this.StorageInBillNo == '空') {
					Config.ShowMessage('请选择要删除的入库单！');
					Config.PopAudioContext(false);					
					return;
				}				
				let me = this;
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.StorageInBillNo + '的入库单？',
					success: function(result) {
					if (result.confirm) {
						uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								    ModuleCode: 'delPdaStockBillRptHead',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.StorageInterId,
										Result: 0,
										FStatus: 0,
										FStatusCN: '',
										Msg: ''
									}
						  },
						  success: (resdelete) => {
									let ResultCode = resdelete.data.ResultCode;
									let ResultMsg = resdelete.data.ResultMsg;
									if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
										Config.ShowMessage('账号登录异常，请重新登录！');
									    Config.PopAudioContext(false);											
									    return;
									}
									let DataParam = resdelete.data.ResultData.DelPdaStockBillRptHead
													.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);										
										return;
									}
									me.ClearBillHeadData(me);
									me.SwitchTab(0);
									Config.ShowMessage(DataParam.Msg);
									Config.PopAudioContext(true);									
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
			//选择入库日期
			StorageInDateChange(e) {
				this.StorageInDate = e.detail.value
			},
			//条件搜索采购订单列表
			ValueChanged: function() {
				this.ShowPOOrderInfo('');
			}
		}
	}
</script>

<style>
	.instorageview {
		width: 100%;
		height: 950upx;
	}
	
	.instoragelistview {
		width: 100%;
		height: 850upx;
		margin-top: 20upx;
	}
	
	.selectinfoscrollview {
		width: 100%;
		height: 620upx;
		margin-top: 50upx;
	}
	
	.unselectinfoscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 50upx;
	}
	
	.addstoragein {
		display: inline-block;
		width: 20%;
		color: #FFFFFF;	
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 30upx;
		margin-top: 20upx;	
	}
	
	.auditstoragein {
		width: 20%;
		color: #FFFFFF;	
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 310upx;
		margin-top: -97upx;	
	}
	
	.unauditstoragein {
		width: 20%;
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 310upx;
		margin-top: -97upx;
	}
	
	.deletestoragein {
		width: 20%;
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;
		text-align: center;
		margin-left: 580upx;
		margin-top: -85upx;
	}	
	
	.billhead {
		width: 100%;
		margin-top: 20upx;
	}
	
	.title {
		margin-left: 50upx;
		font-size: 40upx;
	}
	
	.billnoempty {
		width: 200upx;
		font-size: 38upx;
		margin-top: -60upx;
		margin-left: 100upx;
		text-align: center;
		color: #777777;
	}
	
	.data {
		width: 400upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 300upx;
		text-align: center;
	}
	
	.dataline {
		width: 60%;
		height: 5upx;
		background-color: #4CD964;
		margin-left: 250upx;
	}
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline {
		background-color: #007AFF;
	}
	
	.tabbackground {
		width: 100%;
		height: 90upx;
		margin-top: 150upx;
		background-color: #F4F4F4;
	}
	
	.tableft {		
		font-size: 45upx;
		margin-top: 20upx;
		margin-left: 50upx;
	}
	
	.tabmiddle {
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 340upx;
	}
	
	.tabright {		
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 630upx;
	}
	
	.tableftline {		
		width: 15%;
		height: 5upx;		
		margin-left: 40upx;
	}
	
	.tabmiddleline {		
		width: 15%;
		height: 5upx;		
		margin-left: 330upx;
	}
	
	.tabrightline {		
		width: 15%;
		height: 5upx;		
		margin-left: 620upx;
	}
	
	.scanned {
		display: inline-block;
		color: #FFFFFF;
		font-size: 40upx;
		margin-left: 30upx;
		margin-top: 30upx;
	}
	
	.queryall {
		display: flex;
		flex-direction: column;
		font-size: 40upx;
		color: #007AFF;
		margin-left: 570upx;
		margin-top: -60upx;
	}
	
	.detailtitle {
		display: flex;
		font-size: 35upx;
		margin-top: 30upx;
		margin-left: 30upx;
	}
	
	.detaildata {
		display: flex;
		font-size: 35upx;
		margin-top: -50upx;
		margin-left: 270upx;
		text-align: center;
	}
	
	.listline {
		width: 100%;
		height: 3upx;
		background-color: #000000;	
		margin-top: 20upx;
	}
</style>
