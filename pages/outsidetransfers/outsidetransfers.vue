<template>
	<view class="container">
		<view class="transfersview" v-show="TabSelectedIndex == 0">
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<BillStatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowSEOutStockInfo('')">
			</BillStatus>

			<button class="addseoutstock" v-bind:disabled="!IsAddSEOutStock" v-on:click="AddSEOutStock()">新增</button>
			<button class="queryseoutstock" v-bind:disabled="IsAddSEOutStock" v-on:click="QuerySEOutStock()">查询</button>

			<scroll-view class="seoutstockscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOutStockListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '单据状态：' + item.FStatus" clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"
						@CheckBoxChange="RefreshListByChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>


		<view class="transfersview" v-show="TabSelectedIndex == 1">
			<view class="pagehead">
				  <text class="srcbillno">{{SelectSEOutStockModel != null ? SelectSEOutStockModel.FBillNo : '空'}}</text>
			      <button class="audittransfers" v-show="IsAuditTransfers" v-on:click="AuditTransfers()">审核</button>
			      <button class="unaudittransfers" v-show="!IsAuditTransfers" v-on:click="UnAuditTransfers()">反审</button>
			      <button class="deletetransfers" v-on:click="DeleteTransfers()">删除</button>
			</view>

			<view class="billhead" v-show="IsBillHeadVisible">
				<!-- <text class="title">单据编号：</text>
				<text class="billnoempty">{{TransfersBillNo}}</text>
				<view class="dataline"></view> -->

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
				<navigator url="/pages/basic/stock" hover-class="navigator-hover">
				     <view class="data" @click="SwitchScanType(1)">{{DCStockArray[1]}}</view>
				</navigator>
				<view class="dataline"></view>
				<!-- @click="SwitchScanType(1)" v-bind:class="{selectdata : ScanType == 1}">{{DCStockArray[1]}} -->

				<text class="title">调出仓库：</text>
				<navigator url="/pages/basic/stock" hover-class="navigator-hover">
				     <view class="data" @click="SwitchScanType(2)">{{SCStockArray[1]}}</view>
			    </navigator>
				<view class="dataline"></view>
				<!-- @click="SwitchScanType(2)" v-bind:class="{selectdata : ScanType == 2}">{{SCStockArray[1]}} -->
			</view>

			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<FillQty v-for="(item,index) in GroupListData" :key="index" :title="item.FModel 
			 		+ '/' + item.FNumber" :note="	+ '\n' + item.FShouldSendQty + '只/'
			        + (item.FShouldSendQty/item.FInPackPreQty).toFixed(2)
			        + '件' + '\n' + item.FRealSendQty + '只/' 
			        + (item.FRealSendQty/item.FInPackPreQty).toFixed(2) + '件'" :rownumber="index + 1"
						v-bind:percent="Math.round((item.FRealSendQty / item.FShouldSendQty) * 100, 0)" isshowprogress
						clickable v-on:click="GetSelectGroupModel(item)" @ButtonClick="OpenQtyPopupWindow(index)">
					</FillQty>
				</uni-list>
			</scroll-view>
		</view>


		<view class="transfersview" v-show="TabSelectedIndex == 2">
			<view class="pagehead">
			     <text class="scanned">已扫描条码：</text>
			     <text class="queryall" clickable v-on:click="GetTransCartonDetail()">查看全部</text>
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
			
			<text class="detailtitle">批号：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FBatchNo : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">发货仓库：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FStockName : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">即时库存：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FInventoryQty
			 + this.SelectGroupModel.FUnitName : '空'}}</text>
			<view class="listline"></view>
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
	import BillStatus from '../../components/billstatus/billstatus.vue';
	export default {
		components: {
			Config,
			FillQty,
			OutStorageKeyboard,
			BillStatus
		},
		data() {
			return {
				SearchValue: '',
				SelectStatus: '未调拨',
				StatusArray: ['未调拨', '已调拨'],
				TabSelectedIndex: 0,
				SelectSEOutStockModel: null,
				SelectGroupModel: null,
				SelectItems: '',
				SEOutStockListData: [],
				GroupListData: [],
				InfoListData: [],
				IsBillHeadVisible: true,
				IsAddSEOutStock: true,
				IsAuditTransfers: true,
				TransfersInterId: 0,
				TransfersBillNo: '空',
				TransfersDate: Config.DateFormat('now'),
				StartDate: Config.DateFormat('start'),
				EndDate: Config.DateFormat('end'),
				TransfersFManagerArray: [0, '请选择验收人'],
				TransfersSManagerArray: [0, '请选择保管人'],
				DCStockArray: [0, '请选择调入仓库'],
				SCStockArray: [0, '请选择调出仓库'],				
				IsSearchFManager: true,
				ScanType: 0, //0代表扫外箱，1代表扫调入仓库，2代表扫调出仓库
				IsOpenDigitKeyboard: false,
				Main: '',
				Receiver: ''
			}
		},
		onShow() {
			this.GetSEOutStockByList();
		},
		onLoad() {
			this.AddListener();
			this.ShowSEOutStockInfo('');
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
					if (me.TabSelectedIndex == 0) {
						me.ShowSEOutStockInfo(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						if (me.ScanType == 0) {
							me.ScanBarCode(Barcode);
						} else {
							me.ScanWareHouse(Barcode);
						}
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			RefreshListByChecked: function(item){
			   for(let i = 0; i < this.SEOutStockListData.length; i++){
				   let DataModel = this.SEOutStockListData[i];
				   DataModel.FIsChecked = (DataModel.FBillNo == item.FBillNo) ? true : false;				   
			   }
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
				}
			},
			//切换扫描模式
			SwitchScanType: function(ScanType) {
				this.ScanType = ScanType;
			},
			//切换搜索标识
			SwitchSearchFlag: function(IsSearchFManager) {
				this.IsSearchFManager = IsSearchFManager;
			},	
			//切换审核标志
			SwitchAuditFlag: function(IsAuditTransfers){
				this.IsAuditTransfers = IsAuditTransfers;
			},		
			GetTransCartonDetail: function(){
				if(this.TransfersInterId != 0){
					uni.showLoading({
						title: 'Loading'
					});
					uni.navigateTo({
						url: '/pages/outsidetransfers/cartonlabeldetail?TransfersInterId=' + this.TransfersInterId
					});
					uni.hideLoading();
				}				
			},
			//打开数量弹窗
			OpenQtyPopupWindow: function(index) {
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
					Config.ShowMessage('请选择调入仓库！');
					Config.PopAudioContext(false);
					return;
				}
								
				if(this.SCStockArray[0] == 0){
					Config.ShowMessage('请选择调出仓库！');
					Config.PopAudioContext(false);
					return;
				}
				
				if(this.DCStockArray[0] != 0 && this.SCStockArray[0] != 0 && this.DCStockArray[0] == this.SCStockArray[0]){
					Config.ShowMessage('调入仓库和调出仓库不能一致，请重新选择！');
					Config.PopAudioContext(false);
					return;
				}				
				this.SelectGroupModel = this.GroupListData[index];
				this.IsOpenDigitKeyboard = true;
			},
			CloseQtyPopupWindowDirect: function(e) {
				this.IsOpenDigitKeyboard = false;
			},
			//关闭数量弹窗
			CloseQtyPopupWindow: function(e) {
				if (e == null || e == '' || e == 0) {
					Config.ShowMessage('请填写要修改的实发数量！');
					Config.PopAudioContext(false);
					return;
				}

				this.IsOpenDigitKeyboard = false;
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
							FPackBarCode: '',
							FDCStockID: this.DCStockArray[0],
							FDCSPID: 0,
							FSCStockID: this.SCStockArray[0],
							FSCSPID: 0,
							FSrcInterId: this.IsAddSEOutStock ? this.SelectSEOutStockModel.FInterID : 
							this.SelectSEOutStockModel.FSrcInterId,
							FType: 10,							
							FICItems: this.SelectItems,
							FICItemByHand: this.SelectGroupModel.FItemID,
							FQtyByHand: e,
							FShouldSendQty: this.SelectGroupModel.FShouldSendQty,
							FRealSendQty: this.SelectGroupModel.FRealSendQty,
							FIsVirtual: true,
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
						this.GetSEOutStockByList();
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
			//获取选中单据的物料信息
			GetBillSelectItem: function() {
				this.SelectItems = '';
				for (var i = 0; i < this.GroupListData.length; i++) {
					let DataModel = this.GroupListData[i];
					this.SelectItems += DataModel.FItemID + ',';
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
			},
			GetSelectGroupModel: function(item) {
				this.SelectGroupModel = item;
			},
			//获取选中的单据
			GetSelectSEOutStockByAdd: function() {				
				let CheckCount = this.SEOutStockListData.filter(x => x.FIsChecked).length;
				if (CheckCount == 0) {
					Config.ShowMessage('请选择收料通知单进行新增！');
					Config.PopAudioContext(false);
					return 0;
				}
				if (CheckCount > 1) {
					Config.ShowMessage('只能选择一张收料通知单进行新增！');
					Config.PopAudioContext(false);
					return 0;
				}
				this.SelectSEOutStockModel = this.SEOutStockListData.find(x => x.FIsChecked);
			},
			//获取选中的单据
			GetSelectSEOutStockByQuery: function() {
				let CheckCount = this.SEOutStockListData.filter(x => x.FIsChecked).length;
				if (CheckCount == 0) {
					Config.ShowMessage('请选择调拨单进行查询！');
					Config.PopAudioContext(false);
					return 0;
				}
				if (CheckCount > 1) {
					Config.ShowMessage('只能选择一张调拨单进行查询！');
					Config.PopAudioContext(false);
					return 0;
				}
				this.SelectSEOutStockModel = this.SEOutStockListData.find(x => x.FIsChecked);
			},
			DealBillHeadData: function(IsLoad) {
				if (IsLoad) {
					this.TransfersInterId = this.SelectSEOutStockModel.FTransfersInterId;
					this.TransfersBillNo = this.SelectSEOutStockModel.FTransfersBillNo;
					this.TransfersDate = this.SelectSEOutStockModel.FTransfersDate;
					this.TransfersFManagerArray = [this.SelectSEOutStockModel.FFManagerID, this.SelectSEOutStockModel
						.FFManagerName
					];
					this.TransfersSManagerArray = [this.SelectSEOutStockModel.FSManagerID, this.SelectSEOutStockModel
						.FSManagerName
					];
				} else {
					this.TransfersInterId = 0;
					this.TransfersBillNo = '';
					this.TransfersDate = Config.DateFormat('now');
					this.TransfersFManagerArray = [0, '请选择验收人'];
					this.TransfersSManagerArray = [0, '请选择保管人'];
					this.GroupListData = [];
					this.SelectGroupModel = null;
				}
				this.DCStockArray = [0, '请选择调入仓库'];
				this.SCStockArray = [0, '请选择调出仓库'];
			},
			//扫描条码做调拨
			ScanBarCode: function(Barcode) {
				if(this.SelectSEOutStockModel != null){
					if (this.TransfersBillNo == '空') {
						Config.ShowMessage('请新增或选择调拨单！');
						Config.PopAudioContext(false);
						return;
					}
					if (this.TransfersFManagerArray[0] == 0) {
						Config.ShowMessage('请选择验收人！');
						Config.PopAudioContext(false);
						return;
					}
					if (this.TransfersSManagerArray[0] == 0) {
						Config.ShowMessage('请选择保管人！');
						Config.PopAudioContext(false);
						return;
					}
					if (this.DCStockArray[0] == 0) {
						Config.ShowMessage('请选择调入仓库！');
						Config.PopAudioContext(false);
						return;
					}
					if (this.SCStockArray[0] == 0) {
						Config.ShowMessage('请选择调出仓库！');
						Config.PopAudioContext(false);
						return;
					}
					if (this.DCStockArray[0] != 0 && this.SCStockArray[0] != 0 && this.DCStockArray[0] == this
						.SCStockArray[0]) {
						Config.ShowMessage('调入仓库和调出仓库不能一致，请重新选择！');
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
								FSrcInterId: this.IsAddSEOutStock ? this.SelectSEOutStockModel.FInterID : this
									.SelectSEOutStockModel.FSrcInterId,
								FType: 10,
								FICItems: this.SelectItems,									
								FICItemByHand: 0,
								FQtyByHand: 0,							
								FShouldSendQty: 0,
								FRealSendQty: 0,							
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
							this.GetSEOutStockByList();
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
				}				
			},
			//扫描仓库
			ScanWareHouse: function(BarCode) {
				if (this.TransfersBillNo == '空') {
					Config.ShowMessage('请新增或者选择调拨单！');
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
						if (DataModel.FItemID == undefined) {
							Config.ShowMessage('编码不属于仓库仓位！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						if (this.ScanType == 1) {
							this.DCStockArray = [DataModel.FItemID, DataModel.FName];
						} else {
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
			AddSEOutStock: function() {
				let IsSuccess = this.GetSelectSEOutStockByAdd();
				if (IsSuccess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.SwitchAuditFlag(true);
				this.AddTransfersBillNo();
				this.GetSEOutStockByList();
			},
			QuerySEOutStock: function() {
				let IsSuccess = this.GetSelectSEOutStockByQuery();
				if (IsSuccess == 0) {
					return;
				}
				this.SwitchTab(1);
				if(this.SelectSEOutStockModel.FStatus == '未审核'){
				   this.SwitchAuditFlag(true);
				}
				else{
				   this.SwitchAuditFlag(false);
				}
				this.DealBillHeadData(true);
				this.GetSEOutStockByList();
			},
			ShowSEOutStockInfo: function(Barcode) {
				if (this.SelectStatus == '未调拨') {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'GetPdaSEOutTransNoPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FScanBillNo: Barcode,
								FSearchBillNo: this.SearchValue
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
							this.SEOutStockListData = result.data.ResultData.GetPdaSEOutTransNoPutInList
								.data0;
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
				} else {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'GetPdaSEOutTransPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FScanBillNo: Barcode,
								FSearchBillNo: this.SearchValue
							}
						},
						success: (result) => {
							console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							this.SEOutStockListData = result.data.ResultData.GetPdaSEOutTransPutInList
								.data0;
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
				}
				this.IsAddSEOutStock = this.SelectStatus == '未调拨' ? true : false;
			},
			GetSEOutStockByList: function() {
				if(this.SelectSEOutStockModel != null){
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'GetPdaSEOutStockGroupByTrans',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FInterID: this.SelectSEOutStockModel.FInterID
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
							this.GroupListData = result.data.ResultData.GetPdaSEOutStockGroupByTrans
								.data0;
							this.GetBillSelectItem();
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
				}				
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
									me.DealBillHeadData(false);
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
							this.SwitchAuditFlag(true);
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
					Config.ShowMessage('请新增或者选择调拨单！');
					Config.PopAudioContext(false);
					return;
				}
				if (this.GroupListData.length == 0) {
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
						ModuleCode: 'Allot5_11',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FSrcInterId: this.IsAddSEOutStock ? this.SelectSEOutStockModel.FInterID : 
							this.SelectSEOutStockModel.FSrcInterId,
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
						let DataParam = result.data.ResultData.Allot5_11.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
						} else {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(true);
							this.SwitchAuditFlag(false);
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
			//选择出库日期
			TransfersDateChange(e) {
				this.TransfersDate = e.detail.value
			},
			//条件搜索发货通知单列表
			ValueChanged: function() {
				this.ShowSEOutStockInfo('');
			}
		}
	}
</script>

<style>
	.transfersview {
		width: 100%;
		height: 950upx;
	}

	.addseoutstock {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 30upx;
	}

	.queryseoutstock {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -91upx;
	}

	.audittransfers {
		width: 20%;
		color: #FFFFFF;	
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 420upx;
		margin-top: -70upx;
	}

	.unaudittransfers {
		width: 20%;
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 420upx;
		margin-top: -70upx;
	}

	.deletetransfers {
		width: 20%;
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;
		text-align: center;
		margin-left: 590upx;
		margin-top: -85upx;
	}
	
	.srcbillno {
		display: inline-block;
		color: #FFFFFF;
		font-size: 19px;
		margin-left: 20upx;
		margin-top: 30upx;
	}

	.seoutstockscrollview {
		width: 100%;
		height: 850upx;
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
	
	.selectdata{
		background-color: #007AFF;
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

	.selecttab {
		color: #007AFF;
	}

	.selecttabline {
		background-color: #007AFF;
	}
</style>
