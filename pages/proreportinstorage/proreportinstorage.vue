<template>
	<view class="container">
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowPdaIcmoInfo()">
			</billstatus>
			<button class="addstoragein" v-bind:disabled="!IsAddStorageIn" v-on:click="AddStorageIn()">新增</button>
			<button class="querystoragein" v-bind:disabled="IsAddStorageIn" v-on:click="QueryStorageIn()">查询</button>
			<scroll-view class="icmoscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in IcmoListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo" clickable
					:ischecked="item.FIsChecked" :isshowcheckbox="true" @CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="auditstoragein" v-on:click="AuditStorageIn()">审核</button>
			<button class="unauditstoragein" v-on:click="UnAuditStorageIn()">反审</button>
			<button class="deletestoragein" v-on:click="DeleteStorageIn()">删除</button>			
			<button class="scancartonbarcode" v-bind:class="{scanwarehousebarcode : IsScanCartonBarCode}" v-on:click="SwitchScanMode()">{{IsScanCartonBarCode ? '扫外箱' : '扫仓库'}}</button>

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty"
					v-bind:class="{billnofull : StorageInBillNo != '空'}">{{StorageInBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">交货单位：</text>				
					<view class="data">{{SelectWorkShopArray[1]}}</view>				
				<view class="dataline"></view>

				<text class="title">入库日期：</text>
				<picker mode="date" :value="InStorageDate" :start="StartDate" :end="EndDate"
					@change="InStorageDateChange">
					<view class="data">{{InStorageDate}}</view>
				</picker>
				<view class="dataline"></view>
				
				<text class="title">汇报仓库：</text>			
				<view class="data">{{SelectWareHouseArray[1]}}</view>				
				<view class="dataline"></view>
			</view>

			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
							scroll-y="true">
						<uni-list>
								<uni-list-item v-for="(item,index) in StorageInListData" :key="index" :title="item.FNumber 
								+ '/' + item.FModel + '\n' + '汇报单编号：' + item.FBillNo + '\n' + '源单编号：' + item.FSrcBillNo
								+ '\n' + '销售订单号：' + item.FSOBillNo + '\n' + '仓库：' + item.FStorageName + '/' + '仓位：' 
								+ item.FStorageBinName + '\n' + '入库进度：' + item.FStorageInCount + '/' + item.FSumQty" 
								isshowprogress v-bind:percent="Math.round((item.FStorageInCount / item.FSumQty) * 100, 0)"
								clickable v-on:click="GetProReportInfoExpand(item)">
								</uni-list-item>
						</uni-list>
			</scroll-view>
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<text class="scanned">已扫描条码：</text>
			<text class="queryall" clickable v-on:click="GetStorageInCartonDetail()">查看全部</text>

			<scroll-view class="detailscrollview" scroll-y="true">
				<text class="detailtitle">物料编码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FNumber : '空'}}</text>
				<text class="detailtitle">物料名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FName : '空'}}</text>
				<text class="detailtitle">标签类型：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FBarCodeType : '空'}}</text>
				<text class="detailtitle">订单号：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FSOBillNo != null) ? this.ProreportInfoItem.FSOBillNo : '空'}}</text>				
			</scroll-view>
		</view>


·
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">汇报单</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">入库单</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				TabSelectedIndex: 0,
				SearchValue: '',
				SelectStatus: '未入库',
				StorageInterId: 0,
				StorageInBillNo: '空',
				ProReportInterId: 0,
				ProReportSrcInterId: 0,
				ProReportSelectIndex: -1,
				IsScanCartonBarCode: false,
				IsBillHeadVisible: true,
				IsAddStorageIn: true,
				StorageBinIsActive: false,
				SelectWorkShopArray: [0, '请选择交货单位'],
				SelectWareHouseArray: [0, '请选择汇报仓库'],
				StatusArray: ['未入库', '已入库'],
				StorageInAndBinArray: [],
				InStorageDate: DateFormat({
					format: true
				}),
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				IcmoListData: [],
				StorageInListData: [],
				SelectedProreport: '0',
				SelectedIcmo: '',
				ProreportInfoItem: null,
				TouchStartX: 0,
				SlidingValue: 100,
				Main: '',
				Receiver: ''
			}
		},
		onShow() {
			if(this.IsAddStorageIn){
			   this.ShowProReportGroupInfoByAdd();
			}
			else{
			   this.ShowProReportGroupInfoByQuery();	
			}
		},
		onLoad() {
			this.AddListener();
			this.GetGblSetting();
			this.ShowPdaIcmoInfo();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods: {
			//切换扫描模式
			SwitchScanMode:function(){
				this.IsScanCartonBarCode = !this.IsScanCartonBarCode;
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
					if (me.TabSelectedIndex == 0) {
						me.CheckedProreport(Barcode);
					} 
					else if (me.TabSelectedIndex == 1) {
						if(me.IsScanCartonBarCode){
							me.ScanBarCode(Barcode);
						}
						else{
							me.ScanWareHouse(Barcode);
						}
					} 
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},			
			//检测汇报单是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//选中汇报单
			CheckedProreport: function(BarCode) {				
				for (var i = 0; i < this.IcmoListData.length; i++) {
					let DataModel = this.IcmoListData[i];					
					if (DataModel.FBillNo == BarCode) {
						DataModel.FIsChecked = true;
					}
				}			
			},
			//获取系统参数
			GetGblSetting: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getStorageBinIsActive',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FSignalKey: 'StorageBinIsActive'
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						this.StorageBinIsActive = result.data.ResultData.getStorageBinIsActiveInfo.data0
							.FValue;
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
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
					if (this.TabSelectedIndex == 0) {
						if(this.IsAddStorageIn){
						   this.ShowProReportGroupInfoByAdd();
						}
						else{
						   this.ShowProReportGroupInfoByQuery();
						}
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
					if(this.IsAddStorageIn){
					   this.ShowProReportGroupInfoByAdd();
					}
					else{
					   this.ShowProReportGroupInfoByQuery();
					}
				} 				
			},
			//显示汇报单
			ShowPdaIcmoInfo: function() {				
				if (this.SelectStatus == '未入库') {					
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaIcmoRptNoPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue								
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
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptNoPutInListInfo.data0;
							uni.hideLoading();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
							}
						}
					});
				} 
				else {					
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaIcmoRptPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue							
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
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptPutInListInfo.data0;
							uni.hideLoading();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
							}
						}
					});
				}
				this.IsAddStorageIn = this.SelectStatus == '未入库' ? true : false;
			},						
			//获取选中的汇报单
			GetSelectProreportByQuery: function() {				
				this.StorageInBillNo = '';
				this.StorageInterId = 0;
				this.InStorageDate = '';
				this.SelectWorkShopArray = [0, '请选择交货单位']
				this.SelectWareHouseArray = [0, '请选择汇报仓库'];				
				for (var i = 0; i < this.IcmoListData.length; i++) {
					let DataModel = this.IcmoListData[i];
					if (DataModel.FIsChecked) {
						this.SelectedProreport += DataModel.FId + ',';
						this.SelectedIcmo += DataModel.FSrcInterId + ',';
						this.StorageInBillNo = DataModel.FBillNoStorageIn;
						this.StorageInterId = DataModel.FStorageInId;
						this.InStorageDate = DataModel.FDateStorageIn;	
						if(this.SelectWorkShopArray[0] == 0 && this.SelectWareHouseArray[0] == 0){										
					    this.SelectWorkShopArray = [DataModel.FDeptId, DataModel.FDeptName];
						this.SelectWareHouseArray = [DataModel.FStockId, DataModel.FStockName];	
						}
					}
				}
				if (this.SelectedProreport != '') {
					this.SelectedProreport = this.SelectedProreport.substr(0, this.SelectedProreport.length - 1);
					this.SelectedIcmo = this.SelectedIcmo.substr(0, this.SelectedIcmo.length - 1);
				} else {
					this.SelectedProreport = '0';
					this.SelectedIcmo = '0';
				}

				if (this.SelectedProreport == '0' || this.SelectedIcmo == '0') {
					Config.ShowMessage('请选择需要查询入库的汇报单！');
					Config.PopAudioContext(false);
					return 0;
				}
				if (this.SelectedProreport.indexOf(',') != -1) {
					Config.ShowMessage('一次只能选择一张汇报单进行入库查询！');
					Config.PopAudioContext(false);
					return 0;
				}
			},
			//获取选中的汇报单
			GetSelectProreportByAdd: function() {
				this.SelectedProreport = '';
				this.SelectedIcmo = '';
				this.StorageInBillNo = '';
				this.InStorageDate = '';
				this.SelectWorkShopArray = [0, '请选择交货单位'];
				for (var i = 0; i < this.IcmoListData.length; i++) {
					let DataModel = this.IcmoListData[i];
					if (DataModel.FIsChecked) {
						this.SelectedProreport += DataModel.FId + ',';
						this.SelectedIcmo += DataModel.FSrcInterId + ',';
						if(this.SelectWorkShopArray[0] == 0){
						   this.SelectWorkShopArray = [DataModel.FDeptId, DataModel.FDeptName];
						}
						else{
							  if(this.SelectWorkShopArray[0] != DataModel.FDeptId){
							     Config.PopAudioContext(false);
							     Config.ShowMessage('交货单位不一致！');
							     return 0;
							}
						}
					}
				}
				if (this.SelectedProreport != '' && this.SelectedIcmo != '') {
					this.SelectedProreport = this.SelectedProreport.substr(0, this.SelectedProreport.length - 1);
					this.SelectedIcmo = this.SelectedIcmo.substr(0, this.SelectedIcmo.length - 1);
				} else {
					this.SelectedProreport = '0';
					this.SelectedIcmo = '0';
				}

				if (this.SelectedProreport == '0' && this.SelectedIcmo == '0') {
					Config.ShowMessage('请选择需要新增入库的汇报单！');
					Config.PopAudioContext(false);					
					return 0;
				}
			},			
			//扫描条码做入库
			ScanBarCode: function(Barcode) {
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请新增入库单！');
					Config.PopAudioContext(false);					
					return;
				}
				if (this.SelectWorkShopArray[0] == 0) {
					Config.ShowMessage('请填写交货单位！');
					Config.PopAudioContext(false);					
					return;
				}	
				if(this.SelectWareHouseArray[0] == 0){
					Config.ShowMessage('请填写汇报仓库！');
					Config.PopAudioContext(false);					
					return;
				}							
			    uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'addPdaStorageInRpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							FBillNo: this.StorageInBillNo,
							FWorkShopId: this.SelectWorkShopArray[0],
							FDate: this.InStorageDate,
							FBillerID: uni.getStorageSync('FUserId'),
							FPackBarCode: Barcode,							
							FIcmoRptIds: this.SelectedProreport,
							FIcmoRptId: '',
							FStorageId: this.SelectWareHouseArray[0],
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
						let ResultData = result.data.ResultData.AddPdaStorageInRpt;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						if(this.IsAddStorageIn){
						   this.ShowProReportGroupInfoByAdd();
						}
						else{
						   this.ShowProReportGroupInfoByQuery();
						}	
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
			//扫描仓库
			ScanWareHouse: function(BarCode) {				
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请新增或者选择入库单！');
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
						ModuleCode: 'getStockByNumber',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FNumber: BarCode
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
			
						if (this.StorageBinIsActive == 'true') {
			
						} else {
							let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
							if(DataModel.FItemID == 0 || DataModel.FName == ''){
							   Config.ShowMessage('编码不属于仓库仓位！');
							   Config.PopAudioContext(false);
							   uni.hideLoading();
							   return;
							}
							this.SelectWareHouseArray = [DataModel.FItemID, DataModel.FName];
							//me.StorageInAndBinArray[me.ProReportSelectIndex] = [DataModel.FItemID, DataModel.FNumber, DataModel.FName, 0, '空', '空'];	
							//console.log(me.StorageInAndBinArray);
						}
						Config.ShowMessage('扫描仓库仓位成功！');
						Config.PopAudioContext(true);
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
			},
			//新增入库单
			AddStorageIn: function() {
				let IsSucess = this.GetSelectProreportByAdd();
				if (IsSucess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.AddStorageInBillNo();
				this.ShowProReportGroupInfoByAdd();				
			},
			//新增入库单编号
			AddStorageInBillNo: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageInRptMaxId',
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
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.StorageInterId = DataModel.FId;
						this.StorageInBillNo = DataModel.FBillNo;
						this.InStorageDate = DateFormat({
							format: true,
						});
						this.StorageInListData = [];
						this.SelectWareHouseArray = [0, '请选择汇报仓库'];
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByAdd: function() {			
				uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaICMORptGroupInfo',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FIndexIdList: this.SelectedProreport
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
							this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;							
							this.StorageInAndBinArray = [];						
							for (let i = 0; i < this.StorageInListData.length; i++) {
								let StorageInAndBinInfo = [0, '空', '空', 0, '空', '空'];
								this.StorageInAndBinArray.push(StorageInAndBinInfo);
							}	
							uni.hideLoading();							
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext();
							uni.hideLoading();
							return;
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
							}							
						}
					});				
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByQuery: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptGroupInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectedProreport
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
						this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
						this.StorageInAndBinArray = [];
						for (let i = 0; i < this.StorageInListData.length; i++) {
							let DataModel = this.StorageInListData[i];
							let StorageInAndBinInfo = [DataModel.FStorageId, DataModel.FStorageNumber, DataModel.FStorageName
							, DataModel.FStorageBinId, DataModel.FStorageBinNumber, DataModel.FStorageBinName];
							this.StorageInAndBinArray.push(StorageInAndBinInfo);
						}
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
			},
			//查询入库单
			QueryStorageIn: function() {
				let IsSuccess = this.GetSelectProreportByQuery();
				if (IsSuccess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.ShowProReportGroupInfoByQuery();
			},
			//审核入库单验证
			CheckAuditStorageIn:function(){
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择入库单！');
					return 0;
				}
				if (this.SelectWorkShopArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择交货单位！');
					return 0;
				}
				for (var i = 0; i < this.StorageInListData.length; i++) {
					let DataModel = this.StorageInListData[i];	
					if(DataModel.FStorageInCount < DataModel.FSumQty)
					{
						Config.PopAudioContext(false);
						Config.ShowMessage('汇报单编号为' + DataModel.FBillNo + '汇报没有完成！');
						return 0;
					}
				}				
			},
			//审核入库单
			AuditStorageIn: function() {
				let IsSuccess = this.CheckAuditStorageIn();
				if(IsSuccess == 0){
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
						ModuleCode: 'pdaICMORptToStorageInRpt',
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
						let DataParam = result.data.ResultData.PdaICMORptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
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
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();							
						}
					}
				});
			},
			//反审核入库单
			UnAuditStorageIn: function() {
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请选择入库单！');
					Config.PopAudioContext(false);					
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
						ModuleCode: 'unPdaICMORptToStorageInRpt',
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
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						let DataParam = result.data.ResultData.UnPdaICMORptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
			},
			//删除汇报入库单
			DeleteStorageIn: function() {
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
								    ModuleCode: 'delPdaStorageInRptHead',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.ProReportInterId,
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
									let DataParam = resdelete.data.ResultData.DelPdaStorageInRptHead
													.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);										
										return;
									}
									me.ClearBillHeadData(me);
									me.GetProReportInfoExpand(null);
									Config.ShowMessage(DataParam.Msg);
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
									    uni.hideLoading();											       
								    }
							}
							});
							}
							}
					});
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.ProReportSrcInterId = 0;
				me.SelectWorkShopArray = [0, '请选择交货单位'];
				me.InStorageDate = DateFormat({
					format: true
				});
			},
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpand: function(item) {
				if (item != null) {						
					this.TabSelectedIndex = 2;
					this.ProReportSelectIndex = item.FIndex;
					this.ProreportInfoItem = item;
					this.ProReportInterId = item.FId;
					this.ProReportSrcInterId = item.FSrcInterId;
				} 
				else {
					this.ProreportInfoItem = null;
				}
			},
			//获取入库单外箱明细信息
			GetStorageInCartonDetail: function() {
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/proreportinstorage/cartonlabeldetail?StorageInterId=' + this.StorageInterId +
						'&ProReportSrcInterId=' + this.ProReportSrcInterId
				});
				uni.hideLoading();
			},			
			//汇总页面选中的Item
			SummaryItemSelected: function(item) {
				this.GetProReportInfoBySum(item);
			},			
			//选择入库日期
			InStorageDateChange(e) {
				this.InStorageDate = e.detail.value
			},
			//条件搜索汇报单列表
			ValueChanged: function() {
				this.ShowPdaIcmoInfo();
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
	.addstoragein {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}

	.querystoragein {
		width: 20%;
		height: 90rpx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -90upx;
	}

	.icmoscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 20upx;
	}

	.auditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 10upx;
		margin-top: 30upx;
	}

	.unauditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 200upx;
		margin-top: -96upx;
	}

	.deletestoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 380upx;
		margin-top: -96upx;
	}
	
	.scancartonbarcode {
		width: 25%;
		color: #FFFFFF;
		background-color: #F0AD4E;
		border-radius: 50upx;
		margin-left: 560upx;
		margin-top: -96upx;
	}
	
	.scanwarehousebarcode{
		width: 25%;
		color: #FFFFFF;
		background-color: #1AAD19;
		border-radius: 50upx;
		margin-left: 560upx;
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
		font-size: 35upx;
		margin-top: -50upx;
		margin-left: 270upx;
		text-align: center;
	}

	.data {
		display: flex;
		width: 300upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 320upx;
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
		height: 920upx;
		margin-top: 30upx;
	}

	.cartonlabelscrollview {
		width: 100%;
		height: 550upx;
		margin-top: 20upx;
	}

	.selectinfoscrollview {		
		width: 100%;
		height: 620upx;
		margin-top: 50upx;
	}

	.unselectinfoscrollview {		
		width: 100%;
		height: 900upx;
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
		width: 100%;
		height: 90upx;
		margin-top: 100upx;
		background-color: #F4F4F4;
	}

	.tableft {		
		font-size: 45upx;
		margin-top: 30upx;
		margin-left: 40upx;
	}

	.tabmiddle {
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 330upx;
	}

	.tabright {	
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 630upx;
	}

	.tableftline {		
		width: 18%;
		height: 5upx;		
		margin-left: 40upx;
	}

	.tabmiddleline {	
		width: 18%;
		height: 5upx;		
		margin-left: 330upx;
	}

	.tabrightline {		
		width: 15%;
		height: 5upx;		
		margin-left: 620upx;
	}
	
	.productdetail {		
		margin-top: 50upx;
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

	.modeltitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 180upx;
	}

	.modeldata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 180upx;
	}

	.numbertitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 280upx;
	}

	.numberdata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 280upx;
	}

	.nametitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 380upx;
	}

	.namedata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 380upx;
	}

	.labelcounttitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 480upx;
	}

	.labelcountdata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 480upx;
	}

	.selectlabel {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}

	.deletelabel {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-right: 150upx;
		margin-top: -95upx;
	}	
</style>
