<template>
	<view class="content">
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged"></uni-search-bar>		
		     <scroll-view class="sumscrollview" scroll-y="true">
		        <uni-list>
			       <!-- <uni-list-item v-for="(item,index) in SummaryListData":key="index" :title="'仓库名称：'+ item.FStorageName + '\n' 
				   + '仓位组名称：' + item.FStockPlaceGroupName + '\n' + '仓位名称：' + item.FStorageBinName + '\n' + '制单人：'
				   + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo"  :note="'单据状态：' 
				   + item.FStatus" clickable :isshowicon="item.FIsScanned" v-on:click="SummaryItemSelected(item)">
			       </uni-list-item> -->
				   <uni-list-item v-for="(item,index) in SummaryListData":key="index" :title="'制单人：'
				   + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '汇报单编号：' + item.FBillNo"
					clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"  @CheckBoxChange="ChangeIsChecked(item)" >
				   </uni-list-item>
		        </uni-list>
		     </scroll-view>	 
			 <!-- @TouchStart="ItemTouchStart" @TouchEnd="ItemTouchEnd" @LongPress="ItemLongPress(item)" -->
		</view>
		
		
		
		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="addstoragein" v-on:click="AddStorageIn()">新增</button>
			<button class="auditproreport" v-on:click="AuditProReport()">审核</button>
			<button class="unauditproreport" v-on:click="UnAuditProReport()">反审</button>			
			<button class="deletebill" v-on:click="DeleteProreportBill()">删除</button>	
			
			<view class="billhead" v-show="IsBillHeadVisible">
			<text class="title">单据编号：</text>
			<text class="billnoempty" v-bind:class="{billnofull : StorageInBillNo != '空'}">{{StorageInBillNo}}</text>
			<view class="dataline"></view>			
			
			<!-- <text class="title">所在仓库：</text>	
				<view class="data">{{StorageArray[1]}}</view>
			    <image class="barcode" src="../../static/barcode.png" mode="aspectFit" @click="ScanWareHouse()"></image>
		    <view class="dataline"></view>
			
			<text class="title">所在仓位：</text>				
			    <view class="data">{{StorageBinArray[1]}}</view>			
			<view class="dataline"></view> -->
			
			<text class="title">入库日期：</text>
			    <picker mode="date" :value="FinishDate":start="StartDate" :end="EndDate" @change="FinishDateChange">
				       <view class="data">{{FinishDate}}</view>			
			    </picker>
			    <view class="dataline"></view>
			</view>
			
			<!-- <productdetail class="productdetail" label="产品明细"></productdetail>
			<text class="modeltitle">物料规格：</text>
			<text class="modeldata">{{this.MaterialInfo != null ? this.MaterialInfo.FModel : '*'}}</text>
			<text class="numbertitle">物料编码：</text>
			<text class="numberdata">{{this.MaterialInfo != null ? this.MaterialInfo.FNumber : '*'}}</text>
			<text class="nametitle">物料名称：</text>
			<text class="namedata">{{this.MaterialInfo != null ? this.MaterialInfo.FName : '*'}}</text>	
			<text class="labelcounttitle">外箱数量：</text>
			<text class="labelcountdata">{{this.MaterialInfo != null ? this.MaterialInfo.FLabelCount : '*'}}</text>	 -->
			
			<scroll-view class="unselectinfoscrollview" v-bind:class="{selectinfoscrollview : !IsBillHeadVisible}" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="item.FNumber + '/' 
					+ item.FModel + '\n' + '汇报单编号：' + item.FBillNo + '\n' + '源单编号：' + item.FSrcBillNo
					+ '\n' + '入库进度：' + item.FStorageInCount + '/' + item.FSumQty" 
					clickable isshowprogress v-bind:percent="Math.round((item.FStorageInCount / item.FSumQty) * 100, 0)">
					<!-- v-on:click="InfoItemSelected(item)" -->
					</uni-list-item>
					<!-- <uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="'物料规格：' + item.FModel + '\n' 
					+ '物料编码：' + item.FNumber + '\n' +'物料名称：'+ item.FName + '\n' + '源单编号：' + item.FSrcBillNo
					+ '\n' + '批次：' + item.FGMPBatchNo + '\n' + '汇总数量：' + item.FSumQty + '只/' + item.FLabelCount + '件' + '\n'
					+ '未汇报数量：' + (item.FICMOQty - item.FSumQty)" :isshowprogress="true" clickable 
					v-bind:percent="Math.round((item.FSumQty / (item.FICMOQty - item.FSumQty)) * 100, 0)" v-on:click="InfoItemSelected(item)">
					</uni-list-item> -->
				</uni-list>
			</scroll-view>	
		</view>
		
		 
		
		<view class="proreportview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
		      <button class="selectlabel">全选/反选</button>
		      <button class="deletelabel">删除</button>
			  <scroll-view class="cartonlabelscrollview" scroll-y="true">
				  <uni-list>
					  
				  </uni-list>
			  </scroll-view>
	    </view>
		
		
		
		<view class="tabbackground">
		     <text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}" v-on:click="SwitchTab(0)">汇总</text>
		     <view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>		
		     <text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}" v-on:click="SwitchTab(1)">单据</text>
		     <view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>		
		     <text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}" v-on:click="SwitchTab(2)">明细</text>
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
				SelectStatus: '全部',
				StorageInterId: 0,				
				StorageInBillNo: '空',
				ProReportSrcInterId: 0,
				IsBillHeadVisible: true,
				StorageBinIsActive: false,
				StorageArray: [0,'请选择仓库'],
				StorageBinArray: [0,'请选择仓位'],				
				Label: '',
				FinishDate: DateFormat({
					format: true
				}),
				ItemTouchStartDate: null,			
				StartDate:DateFormat('start'),
				EndDate:DateFormat('end'),			
				SummaryListData:[],
				InfoListData: [],	
				StatusArray: ['全部','已审核','未审核'],
				SelectedProreport: '',
				SelectedIcmo:'',
				ProreportInfoItem: null,
				ProreportItem: null,				
				MaterialInfo: null,
			    TouchStartX: 0,
				ItemTouchStartX: 0,	
				LongPressTime: 2,
				SlidingValue: 100,							
				Main:'',
				Receiver:''
			}
		},		
	    onLoad() {				
			this.AddListener();		
			this.GetGblSetting();
			this.ShowInstorageSum();
		},
		onUnload() {
			this.RemoveListener();
		},	
	    onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();		   
		},
		methods: {				
			//添加广播监听
			AddListener:function() {
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
					me.GetSelectProreport();
					me.ShowProReportGroupInfo();
					
				} 
			},
			//移除广播监听
			RemoveListener:function(){
				this.Main.unregisterReceiver(this.Receiver);//取消监听
			},
			//检测汇报单是否选中
			ChangeIsChecked:function(item){
				item.FIsChecked = !item.FIsChecked;				
			},
			//获取系统参数
			GetGblSetting:function(){
				uni.request({
				url: uni.getStorageSync('OtherUrl'),
				method: 'POST',
				data: {
						ModuleCode: 'getStorageBinIsActive',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							   FSignalKey: 'StorageBinIsActive'								
							}
						},
						success: (result) => {								
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
							{						
								Config.ShowMessage('账号登录异常，请重新登录！');	
								Config.PopAudioContext(false);
								return;
							}	
							this.StorageBinIsActive = result.data.ResultData.getStorageBinIsActiveInfo.data0.FValue;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
						}
					});
			},
			//扫描仓库
			ScanWareHouse:function(){
				let me = this;
				if(me.StorageInBillNo == '空')
				{
					Config.ShowMessage('请新增入库单！');
					Config.PopAudioContext(false);
					return;
				}				
				uni.scanCode({
					success: function (result) {						
						uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
								ModuleCode: 'getStockByNumber',
								token: uni.getStorageSync('token'),					
								ModuleParam:  {
									   FNumber: result.result							
									}
								},
								success: (result) => {										
									let ResultCode = result.data.ResultCode;
									let ResultMsg = result.data.ResultMsg;
									if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
									{						
										Config.ShowMessage('账号登录异常，请重新登录！');	
										Config.PopAudioContext(false);
										return;
									}	
									
									let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
									me.StorageArray = [DataModel.FItemID, DataModel.FName];	
									// if(me.StorageBinIsActive)
									// {
									// 	console.log(me.StorageBinIsActive);
									// }
									// else
									// {
									//     let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
									//     me.StorageArray = [DataModel.FItemID, DataModel.FName];	
									// }
								},
								fail: () => {
									Config.ShowMessage('请求数据失败！');
									Config.PopAudioContext(false);
								}
							});												
                    }
				});
			},
			//获取手指滑动页面的起点
			TouchStart:function(e){
				this.TouchStartX = e.changedTouches[0].clientX;				
			},
			//获取手指滑动页面的终点
			TouchEnd:function(e){				
				let TouchEndX = e.changedTouches[0].clientX;
				if(this.TouchStartX - TouchEndX >= this.SlidingValue && this.TabSelectedIndex < 2) 
				{						
			        this.SlidingPage(true);		
				}
				if(TouchEndX - this.TouchStartX >= this.SlidingValue && this.TabSelectedIndex > 0)
				{					
					this.SlidingPage(false);	
				}
			},					
			//切换页签
			SwitchTab:function(TabSelectedIndex){
				if(this.TabSelectedIndex != TabSelectedIndex)
				{
				    this.TabSelectedIndex = TabSelectedIndex;				
				if(this.TabSelectedIndex == 0)
				{
					
				}
				else if(this.TabSelectedIndex == 1)
				{
					this.GetSelectProreport();
					this.ShowProReportGroupInfo();
				}
				else					
				{
					this.GetProReportInfoExpand(null);
				}
				}
			},		
			//滑动页面
			SlidingPage:function(IsSlidingLeftPage){
				if(IsSlidingLeftPage)
				{
					this.TabSelectedIndex++;					
				}
				else
				{
					this.TabSelectedIndex--;
				}
				
				if(this.TabSelectedIndex == 0)
				{
					
				}
				else if(this.TabSelectedIndex == 1)
				{
					this.GetSelectProreport();
					this.ShowProReportGroupInfo()
				}
				else					
				{
					this.GetProReportInfoExpand(null);
				}	
			},
			//显示入库单汇总
			ShowInstorageSum:function(){			
				uni.request({
				url: uni.getStorageSync('OtherUrl'),
				method: 'POST',
				data: {
						ModuleCode: 'getPdaStorageInRptList',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							   FBillNo: this.SearchValue,
							   FBillerID: uni.getStorageSync('FUserId')							   									
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
								return;
							}	
							this.SummaryListData = result.data.ResultData.PdaStorageInRptListInfo.data0;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
						}
					});
			},
			//获取选中的汇报单
			GetSelectProreport:function(){
				this.SelectedProreport = '';
				this.SelectedIcmo = '';
				for (var i = 0; i < this.SummaryListData.length; i++) {
				if(this.SummaryListData[i].FIsChecked)
				{						
				    this.SelectedProreport += this.SummaryListData[i].FId + ',';
					this.SelectedIcmo += this.SummaryListData[i].FSrcInterId + ',';													
				}					
			    }	
				if(this.SelectedProreport != '')					
				{
				 	this.SelectedProreport = this.SelectedProreport.substr(0, this.SelectedProreport.length - 1);
					this.SelectedIcmo = this.SelectedIcmo.substr(0, this.SelectedIcmo.length - 1);
				}
				else
				{
					this.SelectedProreport = '0';
					this.SelectedIcmo = '0';
				}	
				console.log(this.SelectedProreport);
			},
			//扫描条码
			ScanBarCode:function(){	
				if(this.StorageInBillNo == '空')
				{
					Config.ShowMessage('请新增入库单！');
					Config.PopAudioContext(false);					
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
							   FDate: this.FinishDate,
							   FBillerID: uni.getStorageSync('FUserId'),
							   FPackBarCode: this.Label,							  
							   Result: 0,
							   Msg: ''
						}
					},
					success: (result) => {	
						 console.log(result.data);
						 let ResultCode = result.data.ResultCode;
						 let ResultMsg = result.data.ResultMsg;
						 if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						 {						
						 	Config.ShowMessage('账号登录异常，请重新登录！');	
						 	Config.PopAudioContext(false);
						 	return;
						 }						 
						 let ResultData = result.data.ResultData.AddPdaStorageInRpt;
						 let Result = ResultData.dataparam.Result;
						 if(Result == 0)
						 {
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
					}
				});
			},
			//新增入库单
			AddStorageIn:function(){
			        uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageInRptMaxId',
						token: uni.getStorageSync('token'),
						ModuleParam:  {
							Result:0,
							FId:0,
							FBillNo:'',
							Msg:''
						}
					},
					success: (result) => {					
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext(false);
							return;
						}						
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.StorageInterId = DataModel.FId;					
			            this.StorageInBillNo = DataModel.FBillNo;	
						// this.ProReportSrcInterId = 0
						// this.SelectWorkShopArray = [0,'请选择车间'];
						// this.SelectTeamArray = [0,'请选择班组'];
						// this.FinishDate = DateFormat({
					 //                      format: true
				  //                                 });	
			   //          this.InfoListData = [];
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext(false);
					}
				});	
			},
			//审核生产汇报单
			AuditProReport(){
				if(this.SelectWorkShopArray[0] == 0)
				{
					Config.ShowMessage('请填写车间！');
					Config.PopAudioContext(false);
					return;
				}				
				if(this.SelectTeamArray[0] == 0)
				{
					Config.ShowMessage('请填写班组！');	
					Config.PopAudioContext(false);
					return;
				}				
				if(this.InfoListData.length == 0)					 
				{
					 Config.ShowMessage('汇报单无扫描数据！');	
					 Config.PopAudioContext(false);
					 return;
				}				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'pdaICMORptToICMORpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							   FId: this.StorageInterId,
							   FBillNo: this.StorageInBillNo,							  
							   Result: 0,
							   Msg: ''
						}
					},
					success: (result) => {							
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext(false);
							return;
						}	
						let DataParam = result.data.ResultData.PdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if(Result == 0)							
						{
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					}
				});
			},
			//反审核生产汇报单
			UnAuditProReport:function(){
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'unPdaICMORptToICMORpt',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FId: this.StorageInterId,
							Result:0,
							Msg:''
						}
					},
					success: (result) => {							
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext(false);
							return;
						}	
						let DataParam = result.data.ResultData.unPdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if(Result == 0)							
						{
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext(false);
					}
				});
			},
			//切换表头是否可见
	        SwitchBillHeadVisible:function()
			{				
				this.IsBillHeadVisible = !this.IsBillHeadVisible;				
			},
			//清除单据头数据
			ClearBillHeadData:function(me){
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.ProReportSrcInterId = 0;								
				me.SelectWorkShopArray = [0,'请选择车间'];
				me.SelectTeamArray = [0,'请选择班组'];			
				me.FinishDate = DateFormat({
					format: true
				});	
			},
			//删除汇报单
			DeleteProreportBill:function(){
				let me = this;
				if(me.StorageInBillNo == '空')
				{
					Config.ShowMessage('请新增汇报单！');
					Config.PopAudioContext(false);
					return;
				}
				if(me.SelectWorkShopArray[0] == 0)
				{
					Config.ShowMessage('请填写车间！');	
					Config.PopAudioContext(false);
					return;
				}				
				if(me.SelectTeamArray[0] == 0)
				{
					Config.ShowMe8sage('请填写班组！');	
					Config.PopAudioContext(false);
					return;
				}				
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.StorageInBillNo + '的汇报单？',
					success: function (result) {
						if (result.confirm) {							
							uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								    ModuleCode: 'ICMORpt2_9',
									token: uni.getStorageSync('token'),
									ModuleParam:  {									
										FId: me.StorageInterId,
										Result:0,									
										Msg:''
									}
								},
							success: (resdelete) => {									
								let ResultCode = resdelete.data.ResultCode;
								let ResultMsg = resdelete.data.ResultMsg;
								if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
								{						
									Config.ShowMessage('账号登录异常，请重新登录！');	
									Config.PopAudioContext();
									return;
								}	
								let DataParam = resdelete.data.ResultData.ICMORpt2_9.dataparam;
								ResultCode = DataParam.Result;
								if(ResultCode == 0)
								{
									Config.ShowMessage(DataParam.Msg);
									Config.PopAudioContext();
									return;
								}
								
								Config.ShowMessage(DataParam.Msg);	
								me.ClearBillHeadData(me);
								me.GetProReportInfoExpand(null);
						    },
							fail: () => {
								    Config.ShowMessage('请求数据失败！');	
								    Config.PopAudioContext();
								}
							});
							}
						}
					});
			},
			//获取选中的汇报单信息
			GetProReportInfoBySum:function(item){						
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptGroupInfo',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FIndexIdList:this.StorageInterId										
						}
					},
					success: (result) => {							
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext();
							return;
						}	
						this.InfoListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
					}
				});
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfo:function(){				
					uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
							ModuleCode: 'getPdaICMORptGroupInfo',
							token: uni.getStorageSync('token'),					
							ModuleParam:  {
								   FIndexIdList: this.SelectedProreport										
								}
							},
							success: (result) => {
								console.log(result.data);
								let ResultCode = result.data.ResultCode;
								let ResultMsg = result.data.ResultMsg;
								if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
								{						
									Config.ShowMessage('账号登录异常，请重新登录！');	
									Config.PopAudioContext();
									return;
								}	
								this.InfoListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
							},
							fail: () => {
								Config.ShowMessage('请求数据失败！');
								Config.PopAudioContext();
							}
						});
				 
			},
			//根据汇报单信息获取明细
			GetProReportDetail:function(){				
				uni.showLoading({
					title:'Loading'
				});	
				uni.navigateTo({
					url:'/pages/proreport/cartonlabeldetail?StorageInterId=' + this.StorageInterId 
					+ '&ProReportSrcInterId=' + this.ProReportSrcInterId
				});
				uni.hideLoading();
			},
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpand:function(item){
			    if(item != null)
				{
			        this.TabSelectedIndex = 2;
			        this.ProreportInfoItem = item;	
					this.ProReportSrcInterId = item.FSrcInterId;
				}
				else
				{
					this.ProreportInfoItem = null;
				}
			},			
			//汇总页面选中的Item
			SummaryItemSelected: function(item){
				this.GetProReportInfoBySum(item);						
			},
			//单据页面选中的Item
			InfoItemSelected: function(item){	
				this.GetProReportInfoExpand(item);
		    },
			//选择完工日期
			FinishDateChange(e) {
				this.FinishDate = e.detail.value
			},
			//条件搜索汇报单列表
			ValueChanged: function() {
				this.ShowInstorageSum();				
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
		    if(type != ''){
		    return `${Year}-${Month}-${Day}`;
		    }
		    return `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
	   }
	   //计算两个时间的时间差
	   function CalDateDiff(StartDate, EndDate){
		    var DateDiff = StartDate.getTime() - EndDate.getTime();//时间差的毫秒数
		    var Leave1 = DateDiff % (24*3600*1000)  //计算天数后剩余的毫秒数
		    var Hour = Math.floor(Leave1/(3600*1000))//计算出小时数	
		    var Leave2 = Leave1 % (3600*1000) //计算小时数后剩余的毫秒数
		    var Minutes = Math.floor(Leave2/(60*1000))  //计算相差分钟数
		    var Leave3 = Leave2 % (60*1000)  //计算分钟数后剩余的毫秒数
		    var Seconds = Math.round(Leave3/1000)  //计算相差秒数
			return Seconds;
	   }
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.addstoragein{
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 23rpx;
		margin-top: 20rpx;
	}
	
	.deletebill{
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 206rpx;
		margin-top: -96rpx;
	}
	
	.auditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 389rpx;
		margin-top: -96rpx;
	}
	
	.unauditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 572rpx;
		margin-top: -96rpx;
	}
	
	.hidebillhead{
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 564rpx;
		margin-top: -96rpx;
	}
	
	.billhead{
		width: 100%;		
		margin-top: 50rpx;
	}
	
	.title {	
		display: flex;		
		margin-left:50rpx;
		font-size: 40rpx;
	}
	
	.billnoempty{
		display: flex;
		width: 200rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 300rpx;
		text-align: center;
		color: #777777;
	}
	
	.billnofull{
		display: flex;
		width: 200rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 300rpx;
		text-align: center;	
	    color: #000000;
	}
	
	.detailtitle{
		display: flex;
		font-size: 35rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;		
	}
	
	.detaildata{
		display: flex;		
		text-align: center;
		font-size: 35rpx;
		margin-top: -50rpx;
		margin-left: 270rpx;		
	}
	
	.data {
		display: flex;
		width: 300rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 320rpx;	
	    text-align: center;
	}
	
	.dataline {
		width: 60%;
		height: 5rpx;
		background-color:#4CD964;
		margin-left: 250rpx;
	}
	
	.barcode {
		display: flex;
		width: 50rpx;
		height: 50rpx;
		margin-top: -55rpx;
		margin-left: 650rpx;
	}
	
	.proreportview {	
		width: 100%;
		height: 950rpx;
	}
		
	.sumscrollview {
		width: 100%;
		height: 950rpx;
	}
	
	.cartonlabelscrollview{
		width: 100%;
		height: 550rpx;
		margin-top: 20rpx;
	}
	
	.selectinfoscrollview{		
		width: 100%;
		height: 850rpx;
		margin-top: 50rpx;
	}
	
	.unselectinfoscrollview{
		width: 100%;
		height: 550rpx;
		margin-top: 50rpx;
	}
	
	.detailscrollview {
		width: 100%;
		height: 950rpx;
		margin-top: 20rpx;
	}
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline{
		background-color: #007AFF;
	}
	
	.tabbackground{
		position: absolute;
		width: 100%;
		height: 100rpx;
		margin-top: 660rpx;
		background-color: #F4F4F4;		
	}
	
	.tableft {	
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;	
		margin-left: 40rpx;
	}
	
	.tabmiddle {
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;	
		margin-left: 330rpx;
	}
	
	.tabright {	
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;
		margin-left: 630rpx;
	}
	
	.tableftline {	
		position: absolute;
		width: 15%;
		height: 5rpx;
		margin-top: 80rpx;
		margin-left: 30rpx;
	}
	
	.tabmiddleline {
		position: absolute;
		width: 15%;
		height: 5rpx;	
		margin-top: 80rpx;
		margin-left: 320rpx;
	}
	
	.tabrightline {		
		position: absolute;
		width: 15%;
		height: 5rpx;
		margin-top: 80rpx;
		margin-left: 620rpx;
	}	
	
	.search {	
		position: absolute;
		width: 95%;
		margin-left: 5rpx;
	}	
	
	.billstatus{	
		position: absolute;
		margin-top: -90rpx;
		margin-left: 570rpx;
	}
	
	.productdetail{
		position: absolute;
		margin-top: 50rpx;
	}
	
	.scanned{
		display: flex;		
		font-size: 40rpx;
		margin-left: 30rpx;
		margin-top: 20rpx;		
	}
	
	.queryall{
		display: flex;		
		font-size: 40rpx;
		color: #007AFF;	
		margin-left: 570rpx;
		margin-top: -60rpx;
	}
	
	.modeltitle{
		position: absolute;
		font-size: 40rpx; 
		margin-left: 50rpx; 
		margin-top: 180rpx;
	}
	
	.modeldata{
		position: absolute;
		width: 500rpx; 
		font-size: 45rpx; 
		margin-left: 300rpx; 
		margin-top: 180rpx;
	}
	
	.numbertitle{
		position: absolute;
		font-size: 40rpx; 
		margin-left: 50rpx; 
		margin-top: 280rpx;
	}
	
	.numberdata{
		position: absolute;
		width: 500rpx; 
		font-size: 45rpx; 
	    margin-left: 300rpx; 
		margin-top: 280rpx;
	}
	
	.nametitle{
		position: absolute;
		font-size: 40rpx; 
		margin-left: 50rpx; 
		margin-top: 380rpx;
	}
	
	.namedata{
		position: absolute;
		width: 500rpx; 
		font-size: 45rpx; 
		margin-left: 300rpx; 
		margin-top: 380rpx;
	}
	
	.labelcounttitle{
		position: absolute;
		font-size: 40rpx; 
		margin-left: 50rpx; 
		margin-top: 480rpx;
	}
	
	.labelcountdata{
		position: absolute;
		width: 500rpx; 
		font-size: 45rpx; 
		margin-left: 300rpx; 
		margin-top: 480rpx;
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
