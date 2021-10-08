<template>
	<view class="container">
		<view class="transfersview" v-show="TabSelectedIndex == 0">
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowTransfersInfo()">
			</billstatus>

			<scroll-view class="billscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in TransfersListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '单据状态：' + item.FStatus" clickable v-on:click="GetTransfersByList(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>


		<view class="transfersview" v-show="TabSelectedIndex == 1">
			<button class="addtransfers" v-on:click="AddTransfers()">新增</button>
			<button class="audittransfers" v-on:click="AuditTransfers()">审核</button>
			<button class="unaudittransfers" v-on:click="UnAuditTransfers()">反审</button>
			<button class="deletetransfers" v-on:click="DeleteTransfers()">删除</button>
			<!-- <button class="scancartonbarcode" v-bind:class="{scanwarehousebarcode : IsScanCartonBarCode}" v-on:click="SwitchScanMode()">{{IsScanCartonBarCode ? '扫外箱' : '扫仓库'}}</button> -->

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty">{{TransfersBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">出库日期：</text>
				<picker mode="date" :value="TransfersDate" :start="StartDate" :end="EndDate"
					@change="TransfersDateChange">
					<view class="data">{{TransfersDate}}</view>
				</picker>
				<view class="dataline"></view>
				
				<text class="title">验收人：</text>
				<navigator url="/pages/basic/empquery" hover-class="navigator-hover">
					<view class="data" @click="SwitchSearchFlag(true)">{{TransfersFManagerArray[1]}}</view>
				</navigator>
				<view class="dataline"></view>
				
				<text class="title">保管人：</text>
				<navigator url="/pages/basic/empquery" hover-class="navigator-hover">
					<view class="data" @click="SwitchSearchFlag(false)">{{TransfersSManagerArray[1]}}</view>
				</navigator>				
				<view class="dataline"></view>
				
				<text class="title">调入仓库：</text>
				<view class="data" @click="SwitchScanType(1)">{{DCStockArray[1]}}</view>				
				<view class="dataline"></view>
				
				<text class="title">调出仓库：</text>
				<view class="data" @click="SwitchScanType(2)">{{SCStockArray[1]}}</view>				
				<view class="dataline"></view>
			</view>

			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="item.FNumber + '/' + item.FModel
					 + '\n' + '数量：' + item.FSumQty" clickable>
					</uni-list-item>
				</uni-list>
			</scroll-view>
			
			<!-- <uni-fab horizontal="left" vertical="bottom" direction="vertical" :content="FabArray" @trigger="FabTrigger">
			</uni-fab> -->
		</view>


		<view class="transfersview" v-show="TabSelectedIndex == 2">
			<button class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
			<button class="deletelabel" v-on:click="SelectLabel()">删除</button>

			<scroll-view class="detailscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'物料：' + item.FNumber + '/' 
					+ item.FModel + '\n' + '外箱标签：'+ item.FPackBarcode + '\n' 
			  		+ '数量：' + item.FQty" :checkboxvalue="item.FPackBarcode" :ischecked="item.FIsChecked" :isshowcheckbox="true"
						@CheckBoxChange="ChangeIsChecked(item)" clickable></uni-list-item>
				</uni-list>
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
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				SearchValue: '',
				SelectStatus: '未审核',
				StatusArray: ['未审核', '已审核', '全部'],
				FabArray: [
					{
						iconPath: '/static/addnew.png',
						selectedIconPath: '/static/addnewhl.png',
						text: '新增',
						active: false
					},
					{
						iconPath: '/static/audit.png',
						selectedIconPath: '/static/audithl.png',
						text: '审核',
						active: false
					},
					{
						iconPath: '/static/unaudit.png',
						selectedIconPath: '/static/unaudithl.png',
						text: '反审',
						active: false
					},
					{
						iconPath: '/static/delete.png',
						selectedIconPath: '/static/deletehl.png',
						text: '删除',
						active: false
					}
				],
				SelectBillModel: null,
				SelectGroupModel: null,
				TabSelectedIndex: 1,
				TransfersInterId: 0,
				TransfersBillNo: '空',
				SelectSrcInterId: '',
				SelectItems: '',
				SelectCartonLabel: '',
				IsSelectAllLabel: false,
				TransfersDate: Config.DateFormat('now'),
				StartDate: Config.DateFormat('start'),
				EndDate: Config.DateFormat('end'),
				TransfersListData: [],
				InfoListData: [],
				DetailListData: [],
				TransfersFManagerArray: [0,'请选择验收人'],
				TransfersSManagerArray: [0,'请选择保管人'],
				DCStockArray: [0,'请扫描调入仓库'],
				SCStockArray: [0,'请扫描调出仓库'],
				IsBillHeadVisible: true,
				IsSearchFManager: true,
				IsScanCartonBarCode: false,
				ScanType: 0,  //0代表扫外箱，1代表扫调入仓库，2代表扫调出仓库
				Main: '',
				Receiver: ''
			}
		},
		onLoad() {
			this.AddListener();
			this.ShowTransfersInfo();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods: {
			//悬浮按钮触发
			FabTrigger: function(e){
				//console.log(e);				
				for(let i = 0; i < this.FabArray.length; i++){
					if(e.index == i){
					   this.FabArray[i].active = true;
					}
					else{
					   this.FabArray[i].active = false;
					}
				}
				
				if(e.index == 0){
				   this.AddTransfers();
				}
				else if(e.index == 1){
				   this.AuditTransfers();
				}
				else if(e.index == 2){
				   this.UnAuditTransfers();
				}
				else{
				   this.DeleteTransfers();
				}
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//切换扫描模式
			SwitchScanMode:function(){
				this.IsScanCartonBarCode = !this.IsScanCartonBarCode;
			},
			//切换扫描模式
			SwitchScanType: function(ScanType){
				//console.log(ScanType);
				this.ScanType = ScanType;
			},
			//切换搜索标识
			SwitchSearchFlag: function(IsSearchFManager) {
				this.IsSearchFManager = IsSearchFManager;				
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
					if (this.TabSelectedIndex == 0) {

					} else if (this.TabSelectedIndex == 1) {
                        this.GetTransfersGroupInfo(null);
					} else {
						this.GetTransfersCartonDetail(null);
					}
				}
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
					if (me.TabSelectedIndex == 1) {
						// if(me.IsScanCartonBarCode){
						// 	me.ScanBarCode(Barcode);
						// }
						// else{
						// 	me.ScanWareHouse(Barcode);
						// }
						if(me.ScanType == 0){
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
			//清除单据数据
			ClearBillData: function() {
				this.TransfersInterId = 0
				this.TransfersBillNo = '空';
				this.TransfersDate = Config.DateFormat('now');
				this.TransfersFManagerArray = [0,'请选择验收人'];
				this.TransfersSManagerArray = [0,'请选择保管人'];
				this.DCStockArray = [0,'请扫描调入仓库'];
				this.SCStockArray = [0,'请扫描调出仓库'];
				this.InfoListData = [];
				this.DetailListData = [];
			},
			//扫描条码做调拨
			ScanBarCode: function(Barcode) {
				if (this.TransfersBillNo == '空') {
					Config.ShowMessage('请新增或选择调拨单！');
					Config.PopAudioContext(false);
					return;
				}	
				
				if(this.TransfersFManagerArray[0] == 0){
					Config.ShowMessage('请选择验收人！');
					Config.PopAudioContext(false);
					return;
				}
				
				if(this.TransfersSManagerArray[0] == 0){
					Config.ShowMessage('请选择保管人！');
					Config.PopAudioContext(false);
					return;
				}
							
				if(this.DCStockArray[0] == 0){
					Config.ShowMessage('请扫描调入仓库！');
					Config.PopAudioContext(false);
					return;
				}
								
				if(this.SCStockArray[0] == 0){
					Config.ShowMessage('请扫描调出仓库！');
					Config.PopAudioContext(false);
					return;
				}
				
				if(this.DCStockArray[0] != 0 && this.SCStockArray[0] != 0 && this.DCStockArray[0] == this.SCStockArray[0]){
					Config.ShowMessage('调入仓库和调出仓库不能一致，请重新扫描！');
					Config.PopAudioContext(false);
					return;
				}
				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Allot5_2',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.TransfersInterId,
							FBillNo: this.TransfersBillNo,
							FFManagerID: this.TransfersFManagerArray[0],
							FSManagerID: this.TransfersSManagerArray[0],							
							FDate: this.TransfersDate,	
							FBillerID: uni.getStorageSync('FUserId'),					
							FPackBarCode: Barcode,
							FDCStockID: this.DCStockArray[0],
							FDCSPID: 0,
							FSCStockID: this.SCStockArray[0],
							FSCSPID: 0,
							FSrcInterId: 0,
							FType: 10,							
							FItemId: 0,
							FQty: 0,
							FIsVirtual: false,
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
						let ResultData = result.data.ResultData.Allot5_2;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.GetTransfersGroupInfo(null);
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
			
						let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
						if(DataModel.FItemID == 0 || DataModel.FName == ''){
							Config.ShowMessage('编码不属于仓库仓位！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
					    }
						if(this.ScanType == 1){
							this.DCStockArray = [DataModel.FItemID, DataModel.FName];	
						}
						else{
							this.SCStockArray = [DataModel.FItemID, DataModel.FName];	
						}	
						this.ScanType = 0;
						Config.ShowMessage('扫描仓库仓位成功！');
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
						uni.hideLoading();
					}
				});
			},		
			//新增调拨单
			AddTransfers: function() {
				this.AddTransfersBillNo();
				this.ClearBillData();
			},					
			//新增调拨单编号
			AddTransfersBillNo: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Allot5_1',
						token: uni.getStorageSync('token'),
						ModuleParam: {
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
						let DataModel = result.data.ResultData.Allot5_1.dataparam;
						this.TransfersInterId = DataModel.FId;
						this.TransfersBillNo = DataModel.FBillNo;
						this.TransfersDate = Config.DateFormat('now');
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
			//显示调拨单列表
			ShowTransfersInfo: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Allot5_4',
						token: uni.getStorageSync('token'),
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
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						this.TransfersListData = result.data.ResultData.Allot5_4.data0;
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
			//根据列表选中的调拨单获取最新调拨单分组信息
			GetTransfersGroupInfo: function(item) {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Allot5_5',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: item != null ? item.FId : this.TransfersInterId
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
						if(item != null){
							this.TransfersInterId = item.FId;
							this.TransfersBillNo = item.FBillNo;
							this.TransfersDate = item.FDate;
							this.TransfersFManagerArray = [item.FFManagerID, item.FFManagerName];
							this.TransfersSManagerArray = [item.FSManagerID, item.FSManagerName];
							this.DCStockArray = [0,'请扫描调入仓库'];
							this.SCStockArray = [0,'请扫描调出仓库'];
						}						
						this.InfoListData = result.data.ResultData.Allot5_5.data0;
						this.TabSelectedIndex = 1;
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
			//根据列表选中的调拨单获取最新调拨单信息
			GetTransfersByList: function(item) {
				this.GetTransfersGroupInfo(item);
				this.GetTransfersCartonDetail(item);
			},			
			//获取选中单据的物料信息
			GetBillSelectItem: function() {
				this.SelectItems = '';
				for (var i = 0; i < this.BillGroupData.length; i++) {
					let DataModel = this.BillGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
			},
			//获取单据的扩展信息
			GetBillInfoExpand: function(item) {
				this.SwitchTab(2);
				this.GetSelectGroupModel(item);
			},
			//删除调拨单
			DeleteTransfers: function() {
				let me = this;
				if (me.TransfersBillNo == '空') {
					Config.ShowMessage('请选择要删除的调拨单！');
					Config.PopAudioContext(false);
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.TransfersBillNo + '的调拨单？',
					success: function(result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'Allot5_9',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.TransfersInterId,
										Result: 0,
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
									let DataParam = resdelete.data.ResultData
										.Allot5_9
										.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);
										return;
									}
									me.ClearBillData();
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
									if (ResultMsg != 'undefined' && ResultMsg.indexOf(
											'执行成功') == -1) {
										Config.ShowMessage(ResultMsg);
									}
								}
							});
						}
					}
				});
			},
			//反审核调拨单
			UnAuditTransfers: function() {
				if (this.TransfersBillNo == '空') {
					Config.ShowMessage('请选择要反审核的调拨单！');
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
						ModuleCode: 'Allot5_7',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.TransfersInterId,
							Result: 0,
							FStatus: 0,
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
						let DataParam = result.data.ResultData.Allot5_7.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
						} else {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(true);
						}
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
			//审核调拨单
			AuditTransfers: function() {
				if (this.TransfersBillNo == '空') {
					Config.ShowMessage('请新增调拨单！');
					Config.PopAudioContext(false);
					return;
				}
				if (this.InfoListData.length == 0) {
					Config.ShowMessage('调拨单无扫描数据！');
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
						ModuleCode: 'Allot5_3',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.TransfersInterId,
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
						let DataParam = result.data.ResultData.Allot5_3.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
						} else {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(true);
						}
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
			//获取调拨单外箱明细信息
			GetTransfersCartonDetail: function(item) {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'Allot5_6',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: item != null ? item.FId : this.TransfersInterId
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
						this.DetailListData = result.data.ResultData.Allot5_6.data0;
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
			//获取选中的分组信息
			GetSelectGroupModel: function(item) {
				this.SelectGroupModel = item;
			},
			//切换内箱标签是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//全选/反选外箱列表项
			SelectAllLabel: function() {
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;
				}
				this.IsSelectAllLabel = !this.IsSelectAllLabel;
			},
			//删除选中的外箱列表项
			DeleteSelectLabel: function() {
				this.GetSelectLabel();
				this.UnBinding();
			},
			//获取选中的外箱标签
			GetSelectLabel: function() {
				this.SelectCartonLabel = '';
				for (var i = 0; i < this.DetailListData.length; i++) {
					if (this.DetailListData[i].FIsChecked) {
						this.SelectCartonLabel += this.DetailListData[i].FIndexId + ',';
					}
				}
				if (this.SelectCartonLabel != '') {
					this.SelectCartonLabel = this.SelectCartonLabel.substr(0, this.SelectCartonLabel.length - 1);
				}
			},
			//入库单选中的外箱解绑
			UnBinding: function() {
				let me = this;
				if (me.SelectCartonLabel == '') {
					Config.ShowMessage('请选择要删除的外箱标签！');
					Config.PopAudioContext(false);
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否要对选中的外箱标签进行解绑？',
					success: function(result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'Allot5_8',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FIndexIdList: me.SelectCartonLabel,
										Result: 0,
										Msg: ''
									}
								},
								success: (res) => {
									//console.log(res.data);
									let ResultCode = res.data.ResultCode;
									let ResultMsg = res.data.ResultMsg;
									if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
										Config.ShowMessage('账号登录异常，请重新登录！');
										Config.PopAudioContext(false);
										return;
									}
									let DataParam = res.data.ResultData.Allot5_8.dataparam;
									let Result = DataParam.Result;
									if (Result == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);
										return;
									}
									Config.ShowMessage(DataParam.Msg);
									Config.PopAudioContext(true);
									me.GetTransfersCartonDetail(null);
								},
								fail: () => {
									Config.ShowMessage('请求数据失败！');
									Config.PopAudioContext(false);
								},
								complete: (resultcomp) => {
									let ResultMsg = resultcomp.data.ResultMsg;
									if (ResultMsg != 'undefined' && ResultMsg.indexOf(
										'执行成功') == -1) {
										Config.ShowMessage(ResultMsg);
										Config.PopAudioContext(false);
									}
								}
							});
						}
					}
				});
			},
			//选择出库日期
			TransfersDateChange(e) {
				this.TransfersDate = e.detail.value
			},
			//条件搜索销售订单（发货通知单）列表
			ValueChanged: function() {
				this.ShowTransfersInfo();
			}
		}
	}
</script>

<style>
	.transfersview {
		width: 100%;
		height: 950upx;
	}

	.billscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 20upx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 500upx;
		margin-top: 50upx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 800upx;
		margin-top: 50upx;
	}

	.scanseorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #F0AD4E;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 30upx;
	}

	.scanseoutstockorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #1AAD19;		
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 30upx;
	}

	.addtransfers {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 23upx;
		margin-top: 20upx;
	}

	.audittransfers {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 206upx;
		margin-top: -96upx;
	}

	.unaudittransfers {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 389upx;
		margin-top: -96upx;
	}

	.deletetransfers {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 572upx;
		margin-top: -96upx;
	}
	
	.scancartonbarcode {
		width: 25%;
		color: #FFFFFF;
		background-color: #F0AD4E;
		border-radius: 50upx;
		margin-left: 23upx;
		margin-top: 20upx;
	}
	
	.scanwarehousebarcode{
		width: 25%;
		color: #FFFFFF;
		background-color: #1AAD19;
		border-radius: 50upx;
		margin-left: 23upx;
		margin-top: 20upx;
	}

	.billhead {
		width: 100%;
		margin-top: 30upx;
	}

	.billnoempty {
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 50upx;
		text-align: center;
		color: #777777;
	}

	.title {
		margin-left: 50upx;
		font-size: 40upx;
	}

	.data {
		width: 450upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 250upx;
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

	.detailscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 20upx;
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

	.tabbackground {
		width: 100%;
		height: 90upx;
		margin-top: 150upx;
		background-color: #F4F4F4;
	}

	.tableft {
		font-size: 45upx;
		margin-top: 20upx;
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
		width: 12%;
		height: 5upx;
		margin-left: 40upx;
	}

	.tabmiddleline {
		width: 12%;
		height: 5upx;
		margin-left: 330upx;
	}

	.tabrightline {
		width: 12%;
		height: 5upx;
		margin-left: 630upx;
	}

	.inputsectiontitle {
		font-size: 16px;
		color: #000000;
		margin-top: 20upx;
	}

	.inputsection {
		font-size: 16px;
		color: #000000;
		border: 5upx solid;
		border-color: #888888;
		margin-left: 170upx;
		margin-top: -55upx;
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
