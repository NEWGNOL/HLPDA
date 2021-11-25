<template>
	<view class="container">
		<view class="outstorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<view class="pagehead">
			      <button class="addstorageout" v-bind:disabled="!IsAddStorageOut" v-on:click="AddSOutGroup()">新增</button>
			      <button class="confirmsoutgroup" v-bind:disabled="!IsAddStorageOut" v-on:click="ConfirmSOutGroup()">确认</button>		
			      <BillStatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowBillInfo('')">
			      </BillStatus>
			</view>

			
			<scroll-view class="billscrollview" scroll-y="true" v-show="IsAddStorageOut">
				<uni-list>
					<DelItem v-for="(item,index) in BillListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '购货单位：' + item.FCustName" clickable @ButtonClick="DelOriginItem(item)">
					</DelItem>
				</uni-list>
			</scroll-view>

			<scroll-view class="billscrollview" scroll-y="true" v-show="!IsAddStorageOut">
				<uni-list>
					<uni-list-item v-for="(item,index) in BillListData" :key="index" :title="'合并单制单人：'
				    + item.FBillerName + '\n'+ '合并单日期：' + item.FDate + '\n' + '合并单编号：' + item.FBillNo
					+ '\n' + '购货单位：' + item.FCustName + '\n' + '单据状态：' + item.FStatus" clickable
					@click="ShowSelectMergeInfo(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>


		<view class="outstorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>	
		    <view class="pagehead">
			    <text class="srcbillno">{{SelectSrcBillNo}}</text>	
			    <button class="auditstorageout" v-on:click="AuditStorageOut()" v-show="IsAuditStorageOut">审核</button>
				<button class="unauditstorageout" v-on:click="UnAuditStorageOut()" v-show="!IsAuditStorageOut">反审</button>
			    <button class="deletestorageout" v-on:click="DeleteStorageOut()">删除</button>
			</view>
			
			<view class="billhead" v-show="IsBillHeadVisible">				
				<text class="title">出库日期：</text>
				<picker mode="date" :value="AddSOutGroupDate" :start="StartDate" :end="EndDate"
					@change="OutStorageDateChange">
					<view class="data">{{AddSOutGroupDate}}</view>
				</picker>
				<view class="dataline"></view>

				<text class="title">扫码进度：</text>
				<view class="data">{{ScanProgress}}</view>
				<view class="dataline"></view>
			</view>

			<scroll-view :scroll-top="ScrollTop" class="selectinfoscrollview"
				v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}" scroll-y="true">
				<uni-list>
					<FillQty v-for="(item,index) in BillGroupData" :key="index" :title="item.FModel 
			 		+ '/' + item.FNumber" :note="'应发:' + item.FSQty + '只/'
			        + (item.FSQty/item.FInPackPreQty).toFixed(1)
			        + '件' + '\n' + '实发:'+ item.FFactQty + '只/' 
			        + (item.FFactQty/item.FInPackPreQty).toFixed(1) + '件'" :rownumber="index + 1"
					v-bind:percent="Math.round((item.FFactQty / item.FSQty) * 100, 0)" isshowprogress
					:ishighlight="item.FHighLight" clickable v-on:click="GetSelectGroupModel(item)" 
					@ButtonClick="OpenQtyPopupWindow(index)">
					</FillQty>
				</uni-list>
			</scroll-view>
		</view>


		<view class="outstorageview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<view class="pagehead">
			    <text class="scanned">已扫描条码：</text>
			    <text class="queryall" clickable v-on:click="GetStorageOutCartonDetail()">查看全部</text>
			</view>
			
		    <text class="detailtitle">物料编码：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FNumber : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料型号：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FModel : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料名称：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FName : '空'}}</text>				
		    <view class="listline"></view>
		</view>


		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">来源单</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">出库单</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>


		<uni-popup ref="material" type="center" :mask-click="false">
			<mod-fty mode="input" message="成功消息" title="校验物料" placeholder="请输入物料编码" :duration="2000"
				:before-close="true" @close="CloseMatPopupWindowDirect" @confirm="CloseMatPopupWindow"></mod-fty>
		</uni-popup>

		<uni-popup ref="qty" type="center" :mask-click="false">
			<mod-fty mode="input" message="成功消息" title="修改数量" placeholder="请输入实发数量" :duration="2000"
				:before-close="true" @close="CloseQtyPopupWindowDirect" @confirm="CloseQtyPopupWindow"></mod-fty>
		</uni-popup>

		<OutStorageKeyboard @confirm="CloseQtyPopupWindow" @exit="CloseQtyPopupWindowDirect"
			v-show="IsOpenDigitKeyboard"></OutStorageKeyboard>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	import DelItem from '../../components/del-uni-list-item/del-uni-list-item.vue';
	import FillQty from '../../components/fill-qty/fill-qty.vue';
	import OutStorageKeyboard from '../../components/outstorage-keyboard/outstorage-keyboard.vue';
	import BillStatus from '../../components/out-billstatus/out-billstatus.vue';
	export default {
		components: {
			Config,
			DelItem,
			FillQty,
			OutStorageKeyboard,
			BillStatus
		},
		data() {
			return {				
				SelectStatus: '未出库',
				StatusArray: ['未出库', '已出库'],				
				SelectGroupModel: null,
				AddSOutGroupInterId: 0,
				AddSOutGroupBillNo: '空',
				AddSOutGroupCustId: 0,		
				SelectSrcBillNo: '空',
				SelectItems: '',
				TabSelectedIndex: 0,
				TouchStartX: 0,
				ScrollTop: 0,
				IsAddStorageOut: true,				
				IsOpenDigitKeyboard: false,
				AddSOutGroupDate: Config.DateFormat({
					format: true
				}),
				StartDate: Config.DateFormat('start'),
				EndDate: Config.DateFormat('end'),
				BillListData: [],
				BillGroupData: [],				
				IsBillHeadVisible: true,
				IsAuditStorageOut: true,				
				ScanProgress: '空',
				Main: '',
				Receiver: ''
			}
		},		
		onLoad() {
			this.AddListener();	
	        //this.AddItemList(null);
		},
		onUnload() {
			this.RemoveListener();
			this.CheckScanLab();
		},
		onShow(){
			this.ShowBillGroupInfo(0,false);
		},		
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods: {
			SwitchLoadingStatus: function(IsOpenLoading) {
				if (IsOpenLoading) {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
				} else {
					uni.hideLoading();
				}
			},			
			//切换审核标志
			SwitchAuditFlag: function(IsAuditStorageOut){
				this.IsAuditStorageOut = IsAuditStorageOut;
			},				
			//打开物料弹窗
			OpenMatPopupWindow: function() {
				this.$refs.material.open();
			},
			CloseMatPopupWindowDirect: function(e) {
				this.$refs.material.close();
			},
			//关闭物料弹窗
			CloseMatPopupWindow: function(e) {
				//console.log(e);
				this.$refs.material.close();
				if (e == null || e == '') {
					Config.ShowMessage('请填写要校验的物料编码！');
					Config.PopAudioContext(false);
					return;
				}

				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'CheckItemByBill',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageOutInterId,
							FItem: e,
							FICItems: this.SelectItems,
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
						let ResultData = result.data.ResultData.CheckItemByBill;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
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
						}
					}
				});
			},
			//打开数量弹窗
			OpenQtyPopupWindow: function(index) {
				//console.log(index);
				this.SelectGroupModel = this.BillGroupData[index];
				this.IsOpenDigitKeyboard = true;
				//this.$refs.qty.open();
			},
			CloseQtyPopupWindowDirect: function(e) {
				//this.$refs.qty.close();
				this.IsOpenDigitKeyboard = false;
			},
			//关闭数量弹窗
			CloseQtyPopupWindow: function(e) {
				//console.log(e);
				//this.$refs.qty.close();
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
						ModuleCode: 'AddPdaSOutGroupVirtualLab',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInterId: this.AddSOutGroupInterId,
							FItemId: this.SelectGroupModel.FItemId,
							FQty: e,	
							FBillerId: uni.getStorageSync('FUserId'),							
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
						let ResultData = result.data.ResultData.AddPdaSOutGroupVirtualLab;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.ShowBillGroupInfo(0,false);
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
			//检查扫描标签情况（检查是否有没扫码的合并单弹出提示）
			CheckScanLab:function(){
				console.log('CheckScanLab');
			},
			//删除来源单选中项
			DelOriginItem:function(item){
				let me = this;
				uni.showModal({
					title: '提示',
					content: '是否要对选中的来源单进行删除？',
					success: function (result) {
						if (result.confirm) {
							me.BillListData.splice(item.index, 1);
							Config.ShowMessage("删除成功！");
							Config.PopAudioContext(true);
						} 
					}
				});	
			},
			ClearOriginRecordData:function(){
				this.AddSOutGroupCustId = 0;
			},
			//清除单据头数据
			ClearBillHeadData: function() {
				this.AddSOutGroupInterId = 0;
				this.AddSOutGroupBillNo = '空';				
				this.SelectSrcBillNo = '空';				
				this.ScanProgress = '空';
				this.AddSOutGroupDate = DateFormat({
					format: true
				});
				this.BillGroupData = [];
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
						me.ShowICStockBillAddList(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			//统计单据数量
			StatBillQty: function() {
				let FSQty = 0;
				let FFactQty = 0;
				for (let i = 0; i < this.BillGroupData.length; i++) {
					let DataModel = this.BillGroupData[i];
					FSQty += parseFloat((DataModel.FSQty / DataModel.FInPackPreQty).toFixed(2));
					FFactQty += parseFloat((DataModel.FFactQty / DataModel.FInPackPreQty).toFixed(2));
				}
				this.ScanProgress = FFactQty.toFixed(2) + '件' + '/' + FSQty.toFixed(2) + '     件';
			},
			//扫描条码做出库
			ScanBarCode: function(Barcode) {
				if(this.AddSOutGroupInterId != 0 && this.AddSOutGroupBillNo != '空' && this.BillListData.length != 0){
				   uni.request({
				   	url: uni.getStorageSync('OtherUrl'),
				   	method: 'POST',
				   	data: {
				   		ModuleCode: 'SOutGroupScan',
				   		token: uni.getStorageSync('token'),
				   		ModuleParam: {				   			
				   			FInterId: this.AddSOutGroupInterId,
				   			FBarCode: Barcode,
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
				   			return;
				   		}
				   		
				   		let DataParam = result.data.ResultData.SOutGroupScan.dataparam;
				   		let Result = DataParam.Result;
				   		if(Result == 0){
				   			Config.ShowMessage(DataParam.Msg);
				   			Config.PopAudioContext(false);
				   			return;
				   		}							
				   		
				   		Config.ShowMessage(DataParam.Msg);
				   		Config.PopAudioContext(true);
						this.ShowBillGroupInfo(DataParam.FItemId,true);
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
			//新增销售出库合并单
			AddSOutGroup: function() {
                if(this.BillListData.length != 0){
					this.CheckAddSOutGroupInfo();
				}
				else{
					this.ClearOriginRecordData();
					this.AddSOutGroupInfo();
				}				
			},
			//查询销售出库单
			ConfirmSOutGroup: function() {	
				let IsSuccess = this.CheckConfirmSOutGroup();
				if(IsSuccess != 0){
					
				}						
				this.SwitchAuditFlag(true);				
				this.ShowBillGroupInfo(0,false);
				this.SwitchTab(1);
			},
			CheckConfirmSOutGroup:function(){
				if(this.AddSOutGroupInterId == 0 && this.AddSOutGroupBillNo == '空'){
				   return 0;
				}
				
				if(this.BillListData.length == 0){
				   Config.ShowMessage('请选择需要出库的来源单！');
				   Config.PopAudioContext(false);
				   return 0;
				}
			},
			//检查来源单是否存在扫描单据数据
			CheckAddSOutGroupInfo: function() {
				uni.showModal({
					title: '提示',
					content: '来源单列表存在数据，是否还要重新新增？',
					success: function(result) {
						if (result.confirm) {
							
						}
					}
				});
			},
			//新增入库单合并信息
			AddSOutGroupInfo: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddSOutGroup',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FBillerId: uni.getStorageSync('FUserId'),
							FInterId: 0,
							FBillNo: '',
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
						
						let DataParam = result.data.ResultData.AddSOutGroup.dataparam;
						let Result = DataParam.Result;
						if(Result == 0){
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}							
						
						this.AddSOutGroupInterId = DataParam.FInterId;
						this.AddSOutGroupBillNo = DataParam.FBillNo;
						this.AddSOutGroupDate = Config.DateFormat({
							format: true,
						});
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
						}
					}
				});
			},
			//新增虚拟标签编号
			AddVirtualLabelBillNo: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaVirtualLabelBillNo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FBillNo: '',
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
						let DataModel = result.data.ResultData.GetPdaVirtualLabelBillNo.dataparam;
						let VirtualLabelBillNo = DataModel.FBillNo;
						//console.log(VirtualLabelBillNo);										
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
		    ShowICStockBillAddList: function(Barcode) {
				if(this.AddSOutGroupInterId == 0 && this.AddSOutGroupBillNo == '空'){
				   Config.ShowMessage('请先新增！');
				   Config.PopAudioContext(false);
				   return;
				}
				
				if(this.BillListData.length != 0){
				   let RepeatCount = this.BillListData.filter(x => x.FBillNo == Barcode).length;
				   if(RepeatCount > 0){
					  Config.ShowMessage("该单据已在来源单列表中，请重新扫描！");
					  Config.PopAudioContext(false);	
					  return;
				   }
				}
				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddSOutSrcBillChk',
						token: uni.getStorageSync('token'),
						ModuleParam: {						
							FInterId: this.AddSOutGroupInterId,							
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
						
						let DataParam = result.data.ResultData.AddSOutSrcBillChk.dataparam;
						let Result = DataParam.Result;
						if(Result == 0){
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}													
						this.AddSOutSrcBill(Barcode);
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
					}
				});				
			},
			AddSOutSrcBill: function(Barcode){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'AddSOutSrcBill',
						token: uni.getStorageSync('token'),
						ModuleParam: {						
							FInterId: this.AddSOutGroupInterId,							
							FCustId: this.AddSOutGroupCustId,
							FSrcBillNo: Barcode,
							FGCustId: 0,
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
						
						let DataParam = result.data.ResultData.AddSOutSrcBill.dataparam;
						let Result = DataParam.Result;
						if(Result == 0){
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}	
						this.AddSOutGroupCustId = DataParam.FGCustId;						
						this.AddICStockBillList(Barcode);
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
					}
				});
			},
			AddICStockBillList:function(Barcode){				
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetPdaICStockBillAddList',
						token: uni.getStorageSync('token'),
						ModuleParam: {							
							FBillNo: Barcode,
							FInterID: 0,
							FDate: '',
							FBillerID: 0,
							FBillerName: '',
							FCustID: 0,
							FCustName: '',
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
						
						let DataParam = result.data.ResultData.GetPdaICStockBillAddList.dataparam;
						let Result = DataParam.Result;
						if(Result == 0){
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}												
						this.AddItemList(DataParam);
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
			AddItemList(DataParam){
				// let AddItem = {"FInterID":null,"FBillNo":null,"FDate":null,
				// "FBillerID":null,"FBillerName":null,"FCustID":null,
				// "FCustName":null};
				// this.BillListData.push(AddItem);				
				let AddItem = {"FInterID":DataParam.FInterID,"FBillNo":DataParam.FBillNo,"FDate":DataParam.FDate,
				"FBillerID":DataParam.FBillerID,"FBillerName":DataParam.FBillerName,"FCustID":DataParam.FCustID,
				"FCustName":DataParam.FCustName};
				this.BillListData.push(AddItem);				
				Config.ShowMessage(DataParam.Msg);
				Config.PopAudioContext(true);	
				// let AddItem = [{"FInterID":DataParam.FInterID,"FBillNo":DataParam.FBillNo,"FDate":DataParam.FDate,"FBillerID":DataParam.FBillerID,
				// ,"FBillerName": DataParam.FBillerName,"FCustID":DataParam.FCustID,"FCustName":DataParam.FCustName}];
				//console.log(this.BillListData);
			},
			FindICStockBillAddList: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetPdaSOutGroupNotPutInList',
						token: uni.getStorageSync('token'),
						ModuleParam: {	
							FInterId: this.AddSOutGroupInterId
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
						this.BillListData = result.data.ResultData.GetPdaSOutGroupNotPutInList.data0;
						if(this.BillListData.length == 0){
						   this.ClearBillHeadData();
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
		    ShowICStockBillQueryList: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'GetPdaSOutGroupPutInList',
						token: uni.getStorageSync('token'),
						ModuleParam: {							
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
						this.BillListData = result.data.ResultData.GetPdaSOutGroupPutInList.data0;
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
			//显示对应单据列表
			ShowBillInfo: function(Barcode) {
				if (this.SelectStatus == '未出库') {
			        this.FindICStockBillAddList();				
				} else {					
				    this.ShowICStockBillQueryList();					
				}
				this.IsAddStorageOut = this.SelectStatus == '未出库' ? true : false;
			},	
			ShowSelectMergeInfo: function(item){
				this.GetSelectMergeInfo(item);
				this.SwitchTab(1);
				this.ShowBillGroupInfo(0,false);
			},
			GetSelectMergeInfo: function(item){
				this.AddSOutGroupInterId = item.FInterId;
				this.AddSOutGroupBillNo = item.FBillNo;
				this.AddSOutGroupCustId = item.FCustId;
				this.AddSOutGroupDate = item.FDate;				
			},
			//显示单据分组信息
			ShowBillGroupInfo: function(FItemId, FIsScanned) {
				if(this.AddSOutGroupInterId != 0){
				   uni.showLoading({
				   	title: 'Loading',
				   	mask: true
				   });
				   uni.request({
				   	url: uni.getStorageSync('OtherUrl'),
				   	method: 'POST',
				   	data: {
				   		ModuleCode: 'GetPdaSOutGroupByItemScan',
				   		token: uni.getStorageSync('token'),
				   		ModuleParam: {
				   			FInterId: this.AddSOutGroupInterId,
				   			FItemId: FItemId,
				   			FIsScanned: FIsScanned
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
				   		this.BillGroupData = result.data.ResultData.GetPdaSOutGroupByItemScan
				   			.data0;
				   		this.BillGroupData.sort(x => x.FHighLight);
				   		this.GetBillSelectItem();
				   		this.StatBillQty();
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
			//获取选中单据的物料信息
			GetBillSelectItem: function() {
				this.SelectItems = '';
				for (var i = 0; i < this.BillGroupData.length; i++) {
					let DataModel = this.BillGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
			},
			//删除销售出库单
			DeleteStorageOut: function() {
				let me = this;
				if (me.AddSOutGroupInterId == 0 && me.AddSOutGroupBillNo == '空') {
					Config.ShowMessage('请选择要删除的合并单！');
					Config.PopAudioContext(false);
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.AddSOutGroupBillNo + '的合并单？',
					success: function(result) {
						if (result.confirm) {							
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'SOutGroupDel',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FInterId: me.AddSOutGroupInterId,
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
										.SOutGroupDel
										.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);
										return;
									}
									Config.ShowMessage(DataParam.Msg);
									Config.PopAudioContext(true);
									me.ClearBillHeadData();
									me.GetSelectGroupModel(null);
									me.SwitchTab(0);
								},
								fail: () => {
									Config.ShowMessage('请求数据失败！');
									Config.PopAudioContext(false);
									return;
								},
								complete: (resultcomp) => {
									let ResultMsg = resultcomp.data.ResultMsg;
									if (ResultMsg != 'undefined' && ResultMsg.indexOf(
											'执行成功') == -1) {
										Config.ShowMessage(ResultMsg);
										Config.PopAudioContext(false);										
									}
									uni.hideLoading();
								}
							});								
						}
					}
				});
			},
			//反审核销售出库单
			UnAuditStorageOut: function() {
				if (this.StorageOutBillNo == '空') {
					Config.ShowMessage('请选择要反审核的销售出库单！');
					Config.PopAudioContext(false);
					return;
				}
				if (this.IsScanSEOrder) {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'unPdaSEOrderRptToStorageOutRpt',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.StorageOutInterId,
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
							let DataParam = result.data.ResultData.UnPdaSEOrderRptToStorageOutRpt
							.dataparam;
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
				} else {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'unPdaSEOutStockRptToStorageOut',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FId: this.StorageOutInterId,
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
							let DataParam = result.data.ResultData.UnPdaSEOutStockRptToStorageOutRpt
								.dataparam;
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
				}
			},
			//审核销售出库单
			AuditStorageOut: function() {
				if (this.AddSOutGroupInterId == 0 && this.AddSOutGroupBillNo == '空') {
					Config.ShowMessage('请选择要审核的合并单！');
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
						ModuleCode: 'SOutGroupSubmitChk',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInterId: this.AddSOutGroupInterId,							
							Result: 0,							
							Msg: '',
							FStatusCN: ''
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
						let DataParam = result.data.ResultData.SOutGroupSubmitChk.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							this.SOutGroupSubmitChk(DataParam.Msg);
						} 
						else{
							this.SOutGroupSubmit();
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
			//审核销售出库单
			SOutGroupSubmit: function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'SOutGroupSubmit',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FInterId: this.AddSOutGroupInterId,	
							FBillerId: uni.getStorageSync('FUserId'),						
							Result: 0,							
							Msg: '',							
						}
					},
					success: (result) => {
						console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);										
							return;
						}
						let DataParam = result.data.ResultData.SOutGroupSubmit.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						} 
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);	
				        this.SwitchAuditFlag();
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
			//审核销售出库单校验
			SOutGroupSubmitChk: function(Msg) {
				let me = this;
				uni.showModal({
					title: '提示',
					content: Msg,
					success: function (result) {
						if (result.confirm) {
							me.SOutGroupSubmit();
						} 
					}
				});	
			},
			//获取出库单外箱明细信息
			GetStorageOutCartonDetail: function() {
				if(this.StorageOutInterId != 0 && this.SelectGroupModel != null){
					uni.showLoading({
						title: 'Loading'
					});
					uni.navigateTo({
						url: '/pages/outstorage/cartonlabeldetail?AddSOutGroupInterId=' + this.AddSOutGroupInterId +
							'&ItemId=' + this.SelectGroupModel.FItemId
					});
					uni.hideLoading();
				}				
			},
			//获取选中的分组信息
			GetSelectGroupModel: function(item) {
				this.SelectGroupModel = item;
				//console.log(this.SelectGroupModel);
			},
			//弹出填写数量窗口
			PopupFillQtyWindow: function() {
				//console.log('PopupFillQtyWindow');
				this.$refs.fillqty.open();
			},
			//数量异常检查
			QtyExceptionCheck: function() {
				uni.navigateTo({
					url: '/pages/outstorage/qtycheck?StorageOutInterId=' + this.StorageOutInterId
				});
			},			
			//选择出库日期
			OutStorageDateChange(e) {
				this.OutStorageDate = e.detail.value
			}			
		}
	}	
</script>

<style>
	.outstorageview {
		width: 100%;
		height: 950upx;
	}
	
	.billstatus {
		margin-top: -90upx;
		margin-left: 570upx;
	}

	.billscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 25upx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 750upx;
		margin-top: 50upx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 900upx;
		margin-top: 50upx;
	}

	.scanseorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #F0AD4E;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 20upx;
	}

	.scanseoutstockorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #1AAD19;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 30upx;
	}

	.addstorageout {
		display: inline-block;
		width: 25%;
		height: 90upx;
		color: #FFFFFF;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;	
		margin-left: 40upx;
		margin-top: 20upx;
	}

	.confirmsoutgroup {
		width: 25%;
		height: 90upx;
		color: #FFFFFF;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;	
		margin-left: 300upx;
		margin-top: -100upx;
	}

	.auditstorageout {		
		width: 20%;
		color: #FFFFFF;	
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 420upx;
		margin-top: -70upx;
	}

	.unauditstorageout {
		width: 20%;
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;		
		margin-left: 420upx;
		margin-top: -70upx;
	}

	.deletestorageout {		
		width: 20%;		
		color: #FFFFFF;
		font-size: 15px;
		border: 1px solid #FFFFFF;
		background-color: #1AAD19;
		text-align: center;
		margin-left: 590upx;
		margin-top: -85upx;
	}

	.checkitem {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 580upx;
		margin-top: -96upx;
	}
	
	.pagehead{
		width: 100%;
		height: 130upx;
		background-color: #1AAD19;
	}

	.srcbillno {
		display: inline-block;
		color: #FFFFFF;
		font-size: 19px;
		margin-left: 20upx;
		margin-top: 30upx;
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
</style>