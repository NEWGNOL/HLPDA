<template>
	<view class="content">			
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged"></uni-search-bar>
			<BillStatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowProReportSum()"></BillStatus>
		     <scroll-view class="sumscrollview" scroll-y="true">
		        <uni-list>
			       <uni-list-item v-for="(item,index) in SummaryListData":key="index" :title="'车间名称：'+ item.FDeptName + '\n' + '班组名称：' + item.FTeamName
			       + '\n' + '制单人：' + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo"
			       :note="'单据状态：' + item.FStatus" clickable :isshowicon="item.FIsScanned" v-on:click="SummaryItemSelected(item)">
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
			<text class="billnoempty" v-bind:class="{billnofull : ProReportBillNo != '空'}">{{ProReportBillNo}}</text>
			<view class="dataline"></view>			
			
			<text class="title">车间名称：</text>		
			<navigator url="/pages/proreport/workshopquery" hover-class="navigator-hover">		
			    <view class="data">{{SelectWorkShopArray[1]}}</view>		   
			</navigator>		   
			<view class="dataline"></view>
			
			<text class="title">班组名称：</text>
			<navigator url="/pages/proreport/teamquery" hover-class="navigator-hover">		
			    <view class="data">{{SelectTeamArray[1]}}</view>
			</navigator>
			<view class="dataline"></view>
			
			<text class="title">完工日期：</text>
			<picker mode="date" :value="FinishDate":start="StartDate" :end="EndDate" @change="FinishDateChange">
				<view class="data">{{FinishDate}}</view>			
			</picker>
			<view class="dataline"></view>
			</view>
			
			<scroll-view class="unselectinfoscrollview" v-bind:class="{selectinfoscrollview : !IsBillHeadVisible}" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="item.FNumber + '/' + item.FModel
					+ '\n' + '源单编号：' + item.FSrcBillNo + '\n' + '汇总进度：' + item.FSumQty + '/' + (item.FICMOQty - item.FSumQty)" 
					isshowprogress v-bind:percent="Math.round((item.FSumQty / item.FICMOQty) * 100, 0)" 
					clickable v-on:click="InfoItemSelected(item)">
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
			<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FSOBillNo : '空'}}</text>
			<text class="detailtitle">计划生产数量：</text>
			<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FAuxQty : '空'}}</text>
			<text class="detailtitle">计划开工日期：</text>
			<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FPlanCommitDate : '空'}}</text>
			<text class="detailtitle">实际完工日期：</text>
			<text class="detaildata">{{this.ProreportInfoItem != null ? (this.ProreportInfoItem.FFinishDate != null ? this.ProreportInfoItem.FFinishDate : '空') : '空'}}</text>
			<text class="detailtitle">生产预测单号：</text>
			<text class="detaildata">{{this.ProreportInfoItem != null ? (this.ProreportInfoItem.FPPOrderBillNo != null ? this.ProreportInfoItem.FPPOrderBillNo : '空') : '空'}}</text>
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
				TabSelectedIndex: 1,
				SearchValue: '',
				SelectStatus: '全部',
				ProReportInterId: 0,				
				ProReportBillNo: '空',
				ProReportSrcInterId: 0,
				IsBillHeadVisible: true,				
				SelectWorkShopArray: [0,'请选择车间'],
				SelectTeamArray: [0,'请选择班组'],				
				Label: '',
				FinishDate: DateFormat({
					format: true
				}),
				ItemTouchStartDate: null,
				SelectLabel:'',
				IsSelectAllLabel: false,
				StartDate:DateFormat('start'),
				EndDate:DateFormat('end'),			
				SummaryListData:[],
				InfoListData: [],	
				StatusArray: ['全部','已审核','未审核'],
				ProreportInfoItem: null,
				ProreportItem: null,
			    TouchStartX: 0,
				ItemTouchStartX: 0,	
				LongPressTime: 2,
				SlidingValue: 100,
				Animation: null,
				AnimationData: [],
				IsStopAnimation: false,				
				Main:'',
				Receiver:''
			}
		},		
	    onLoad() {	
			//this.InitAnimation();
			this.AddListener();			
			this.ShowProReportSum();
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
				this.Main = main;	
				this.Receiver = receiver;
					
				function doReceive(context, intent) { 			
				    plus.android.importClass(intent);  		
				    var Barcode = intent.getStringExtra("barcode_string");  
				    me.Label = Barcode;						
					me.ScanBarCode();									 
				} 
			},
			//移除广播监听
			RemoveListener:function(){
				this.Main.unregisterReceiver(this.Receiver);//取消监听
			},
			//初始化动画
			InitAnimation:function(){
				var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease',
					})
				this.Animation = animation;
			},
			//开启动画
			StartAnimation:function(){
				if(!this.IsStopAnimation)					
				{
					// 定义动画内容
					this.Animation.translateX(80).step();
					// 导出动画数据传递给data层
					this.AnimationData = this.Animation.export();
					//三秒内不滚动时触发
					var timer = setTimeout(()=>{
						this.IsStopAnimation = false;
						this.Animation.translateX(0).step()
						this.AnimationData = this.Animation.export()
						},1000);
					this.IsStopAnimation = true;
				}
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
			//获取手指滑列表项的起点
			ItemTouchStart:function(e){			
				this.ItemTouchStartDate = new Date();
				this.ItemTouchStartX = e.changedTouches[0].clientX;					
			},
			//获取手指滑列表项的终点
			ItemTouchEnd:function(e){	
				let me = this;
				let ItemTouchEndDate = new Date();
				let ItemTouchEndX = e.changedTouches[0].clientX;
				let LongPressTime = CalDateDiff(ItemTouchEndDate, me.ItemTouchStartDate);				
				if(LongPressTime >= me.LongPressTime && me.ItemTouchStartX == ItemTouchEndX)
				{					
					uni.showModal({
						title: '提示',
						content: '是否需要删除单据编号为' + me.ProreportItem.FBillNo + '的汇报单？',
						success: function (result) {
							if (result.confirm) {							
								uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'ICMORpt2_9',
									token: uni.getStorageSync('token'),
									ModuleParam:  {									
										FId:me.ProreportItem.FId,
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
									
									uni.request({
									url: uni.getStorageSync('OtherUrl'),
									method: 'POST',
									data: {
										ModuleCode: 'getPdaICMORptList',
										token: uni.getStorageSync('token'),
										PageIndex: 0,
										PageSize: 50,
										PageRefresh: 0,
										ModuleParam:  {							
											FBillNo:this.SearchValue,							
										}
									},
									success: (res) => {										
										let ResultCode = res.data.ResultCode;
										let ResultMsg = res.data.ResultMsg;
										if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
										{						
											Config.ShowMessage('账号登录异常，请重新登录！');	
											Config.PopAudioContext();
											return;
										}						
										this.SummaryListData = res.data.ResultData.PdaICMORptListInfo.data0;
									},
									fail: () => {
										Config.ShowMessage('请求数据失败！');
										Config.PopAudioContext();
									}
								    });
								},
								fail: () => {
									Config.ShowMessage('请求数据失败！');	
									Config.PopAudioContext();
								}
							    });
							}
						}
					});
				}			
			},
			//记录选中的单据编号
			ItemLongPress:function(item)
			{
				this.ProreportItem = item;
			},
			//切换外箱标签是否选中
			ChangeIsChecked:function(item){
				item.FIsChecked = !item.FIsChecked;				
			},
			//切换页签
			SwitchTab:function(Index){
				this.TabSelectedIndex = Index;
				if(this.TabSelectedIndex == 0)
				{
					this.ShowProReportSum();
				}
				else if(this.TabSelectedIndex == 1)
				{
					this.ShowProReportInfo()
				}
				else					
				{
					this.GetProReportInfoExpand(null);
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
					this.ShowProReportSum();
				}
				else if(this.TabSelectedIndex == 1)
				{
					this.ShowProReportInfo()
				}
				else					
				{
					this.GetProReportInfoExpand(null);
				}	
			},
			//显示生产汇报汇总
			ShowProReportSum:function(){				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptList',
						token: uni.getStorageSync('token'),
						PageIndex: 0,
						PageRefresh: 0,
						ModuleParam:  {							
							FBillNo: this.SearchValue,
							FBillerID: uni.getStorageSync('FUserId'),
							FStatus: this.SelectStatus == '全部' ? '0,1' : (this.SelectStatus == '已审核' ? '1' : '0')
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
						this.SummaryListData = result.data.ResultData.PdaICMORptListInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');		
	                    Config.PopAudioContext();
					}
				});
			},			
			//扫描条码
			ScanBarCode:function(){	
				if(this.ProReportBillNo == '空')
				{
					Config.ShowMessage('请新增汇报单！');
					Config.PopAudioContext();
					return;
				}				
				if(this.SelectWorkShopArray[0] == 0)
				{
					Config.ShowMessage('请填写车间！');	
					Config.PopAudioContext();
					return;
				}				
				if(this.SelectTeamArray[0] == 0)
				{
					Config.ShowMessage('请填写班组！');	
					Config.PopAudioContext();
					return;
				}				
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
							   FPackBarCode: this.Label,
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
						 	Config.PopAudioContext();
						 	return;
						 }						 
						 let ResultData = result.data.ResultData.AddPdaICMORpt;
						 let Result = ResultData.dataparam.Result;
						 if(Result == 0)
						 {
							 Config.ShowMessage(ResultData.dataparam.Msg);	
							 Config.PopAudioContext();
							 return;
						 }
						 this.InfoListData = ResultData.data0;	
						 Config.ShowMessage(ResultData.dataparam.Msg);	
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
					}
				});
			},
			//新增生产汇报单
			AddProReport:function(){
			        uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptMaxId',
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
							Config.PopAudioContext();
							return;
						}						
						let DataModel = result.data.ResultData.PdaICMORpt.dataparam;
						this.ProReportInterId = DataModel.FId;					
			            this.ProReportBillNo = DataModel.FBillNo;	
						this.ProReportSrcInterId = 0
						this.SelectWorkShopArray = [0,'请选择车间'];
						this.SelectTeamArray = [0,'请选择班组'];
						this.FinishDate = DateFormat({
					                      format: true
				                                  });	
			            this.InfoListData = [];
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
					}
				});	
			},
			//审核生产汇报单
			AuditProReport(){
				if(this.SelectWorkShopArray[0] == 0)
				{
					Config.ShowMessage('请填写车间！');
					Config.PopAudioContext();
					return;
				}				
				if(this.SelectTeamArray[0] == 0)
				{
					Config.ShowMessage('请填写班组！');	
					Config.PopAudioContext();
					return;
				}				
				 if(this.InfoListData.length == 0)					 
				 {
					 Config.ShowMessage('汇报单无扫描数据！');	
					 Config.PopAudioContext();
					 return;
				 }				
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
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if(ResultCode == 'FAIL' && ResultMsg == '不存在的Token')
						{						
							Config.ShowMessage('账号登录异常，请重新登录！');	
							Config.PopAudioContext();
							return;
						}	
						let DataParam = result.data.ResultData.PdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if(Result == 0)							
						{
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext();
							return;
						}
						Config.ShowMessage(DataParam.Msg);						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
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
							FId: this.ProReportInterId,
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
							Config.PopAudioContext();
							return;
						}	
						let DataParam = result.data.ResultData.unPdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if(Result == 0)							
						{
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext();
							return;
						}
						Config.ShowMessage(DataParam.Msg);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
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
				me.ProReportInterId = 0;
				me.ProReportBillNo = '空';
				me.ProReportSrcInterId = 0;								
				me.SelectWorkShopArray = [0,'请选择车间'];
				me.SelectTeamArray = [0,'请选择班组'];			
				me.FinishDate = DateFormat({
					format: true
				});	
			},
			//删除汇报单
			DeleteProreportBill:function(){
				if(this.ProReportBillNo == '空')
				{
					Config.ShowMessage('请新增汇报单！');
					Config.PopAudioContext();
					return;
				}
				if(this.SelectWorkShopArray[0] == 0)
				{
					Config.ShowMessage('请填写车间！');	
					Config.PopAudioContext();
					return;
				}				
				if(this.SelectTeamArray[0] == 0)
				{
					Config.ShowMe8sage('请填写班组！');	
					Config.PopAudioContext();
					return;
				}	
				
				let me = this;	
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.ProReportBillNo + '的汇报单？',
					success: function (result) {
						if (result.confirm) {							
							uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								    ModuleCode: 'ICMORpt2_9',
									token: uni.getStorageSync('token'),
									ModuleParam:  {									
										FId: me.ProReportInterId,
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
			//获取汇报单信息
			GetProReportInfoBySum:function(item){
				this.TabSelectedIndex = 1;
				this.ProReportInterId = item.FId;
				this.ProReportBillNo = item.FBillNo;	
				this.SelectWorkShopArray = [item.FDeptId, item.FDeptName];
				this.SelectTeamArray = [item.FTeamId, item.FTeamName];
				this.FinishDate = item.FDate;					
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptSumInfo',
						token: uni.getStorageSync('token'),					
						ModuleParam:  {
							FId:this.ProReportInterId										
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
						this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
					}
				});
			},
			//显示生产汇报单信息
			ShowProReportInfo:function(){
				if(this.ProReportInterId != 0)
				{					
				    uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
							ModuleCode: 'getPdaICMORptSumInfo',
							token: uni.getStorageSync('token'),					
							ModuleParam:  {
								   FId:this.ProReportInterId										
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
								this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
							},
							fail: () => {
								Config.ShowMessage('请求数据失败！');
								Config.PopAudioContext();
							}
						});
				 }
			},
			//根据汇报单信息获取明细
			GetProReportDetail:function(){				
				uni.showLoading({
					title:'Loading'
				});	
				uni.navigateTo({
					url:'/pages/proreport/cartonlabeldetail?ProReportInterId=' + this.ProReportInterId 
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
	
	.addproreport{
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}
	
	.auditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 380rpx;
		margin-top: -96rpx;
	}
	
	.unauditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 560rpx;
		margin-top: -96rpx;
	}
	
	.hidebillhead{
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 560rpx;
		margin-top: -96rpx;
	}
	
	.deletebill{		
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 200rpx;
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
		width: 250rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 370rpx;	
	    text-align: center;
	}
	
	.dataline {
		width: 60%;
		height: 5rpx;
		background-color:#4CD964;
		margin-left: 250rpx;
	}

	.proreportview {	
		width: 100%;
		height: 950rpx;
	}
		
	.sumscrollview {
		width: 100%;
		height: 950rpx;
	}
	
	.unselectinfoscrollview{
		width: 100%;
		height: 550rpx;
		margin-top: 50rpx;
	}
	
	.selectinfoscrollview{
		width: 100%;
		height: 850rpx;
		margin-top: 70rpx;
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
		width: 70%;
		margin-left: 5rpx;
	}	
	
	.billstatus{	
		position: absolute;
		margin-top: -90rpx;
		margin-left: 570rpx;
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
