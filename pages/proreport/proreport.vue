<template>
	<view class="content">			
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged"></uni-search-bar>
		     <scroll-view class="sumscrollview" scroll-y="true">
		        <uni-list>
			       <uni-list-item v-for="(item,index) in SummaryListData":key="index" :title="'车间名称：'+ item.FDeptName + '\n' + '班组名称：' + item.FTeamName
			       + '\n' + '制单人：' + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo"
			       :isshowcheckbox="false" clickable v-on:click="SummaryItemSelected(item)">
			       </uni-list-item>
		        </uni-list>
		      </scroll-view>
		</view>
		
		
		
		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="addproreport" v-on:click="AddProReport()">新增</button>
			<button class="auditproreport" v-on:click="AuditProReport()">审核</button>
			<button class="unauditproreport" v-on:click="UnAuditProReport()">反审</button>
			<button class="hidebillhead" v-on:click="SwitchBillHeadVisible()">隐藏</button>			
			
			<view class="billhead" v-show="IsBillHeadVisible">
			<text class="title">单据编号：</text>
			<text class="billnodata">{{ProReportBillNo}}</text>
			<view class="dataline"></view>			
			
			<text class="title">车间名称：</text>		
			<navigator url="/pages/proreport/workshopquery" hover-class="navigator-hover">		
			    <view class="data">{{SelectWorkShopArray[1]}}</view>		   
			</navigator>
		   <!-- <view class="data">{{SelectWorkShopArray[1]}}</view>	
			<uni-list>
			<uni-list-item v-for="(item,index) in TestData" :key="index" :title="item.Name" clickable
			:isshowcheckbox="false"></uni-list-item>
			</uni-list> -->
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
			
			<scroll-view class="infoscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in InfoListData" :key="index" :title="'物料规格：' + item.FModel + '\n' 
					+ '物料编码：' + item.FNumber + '\n' +'物料名称：'+ item.FName + '\n' + '汇总数量：' + item.FSumQty + '\n' 
					+ '源单编号：' + item.FSrcBillNo + '\n' + '件数：' + item.FLabelCount + '\n' + '批次：' + item.FGMPBatchNo"
					:isshowcheckbox="false" clickable v-on:click="InfoItemSelected(item)"></uni-list-item>
				</uni-list>
			</scroll-view>	
		</view>
		 
		
		
		<view class="proreportview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="selectlabel" v-on:click="SelectAllLabel()">全选/反选</button>
			<button class="deletelabel" v-on:click="DeleteSelectLabel()">删除</button>
			
			<scroll-view class="detailscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in DetailListData" :key="index" :title="'外箱标签：'+ item.FPackBarcode + '\n' +'物料规格：' + item.FModel + '\n' 
					+ '物料编码：' + item.FNumber + '\n' + '物料名称：'+ item.FName + '\n' +  '数量：' + item.FQty + '\n' 
					+ '源单编号：' + item.FSrcBillNo + '\n'"  :checkboxvalue="item.FPackBarcode" :ischecked="item.FIsChecked" 
					@CheckBoxChange="ChangeIsChecked(item)" clickable></uni-list-item>
				</uni-list>
			</scroll-view>	
		</view>
				
		<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}" v-on:click="SwitchTab(0)">汇总</text>
		<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>		
		<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}" v-on:click="SwitchTab(1)">单据</text>
		<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>		
		<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}" v-on:click="SwitchTab(2)">明细</text>
		<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>		
	</view>
</template>


<script src="vue.js" type="text/javascript" charset="UTF-8"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script>
	import Config from '../../common/config.js';
	export default {
		data() {			
			return {	
				TabSelectedIndex: 0,
				SearchValue: '',
				ProReportInterId: 0,				
				ProReportBillNo: '*',
				ProReportSrcInterId: 0,
				IsBillHeadVisible: true,
				WorkShopName: '',
				SelectWorkShopArray: [0,'请选择车间'],
				SelectTeamArray: [0,'请选择班组'],				
				Label: '',
				FinishDate: GetDate({
					format: true
				}),
				SelectLabel:'',
				StartDate:GetDate('start'),
				EndDate:GetDate('end'),
				TestData:[
					{Name:'111'},
					{Name:'222'}
					     ],
				SummaryListData:[],
				InfoListData: [],
				DetailListData: [],
			    TouchStartX: 0,
				SlidingValue: 100,
				Animation: null,
				AnimationData: [],
				IsStopAnimation: false,
				Main:'',
				Receiver:''
			}
		},		
	    onLoad() {	
			this.InitAnimation();
			this.AddListener();			
			this.ShowProReportSum();
		},
		onUnload() {
			this.RemoveListener();
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
			//获取手指滑动的起点
			TouchStart:function(e){
				this.TouchStartX = e.changedTouches[0].clientX;				
			},
			//获取手指滑动的终点
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
			//切换内箱标签是否选中
			ChangeIsChecked:function(item){
				item.FIsChecked = !item.FIsChecked;				
			},
			//切换页签
			SwitchTab:function(Index){
				this.TabSelectedIndex = Index;
				if(this.TabSelectedIndex == 0){
					this.ShowProReportSum();
				}
				else if(this.TabSelectedIndex == 1){
					this.ShowProReportInfo()
				}
				else					
				{
					this.GetProReportDetailByNew();
				}
			},
			//选择完工日期
			FinishDateChange(e) {
				this.FinishDate = e.detail.value
			},
			//条件搜索汇报单列表
			ValueChanged: function() {
				this.ShowProReportSum();				
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
					this.GetProReportDetailByNew();
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
						PageSize: 50,
						PageRefresh: 0,
						ModuleParam:  {							
							FBillNo:this.SearchValue,							
						}
					},
					success: (result) => {							
						this.SummaryListData = result.data.ResultData.PdaICMORptListInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');							
					}
				});
			},			
			//扫描条码
			ScanBarCode:function(){	
				if(this.ProReportBillNo == '*')
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
						let DataModel = result.data.ResultData.PdaICMORpt.dataparam;
						this.ProReportInterId = DataModel.FId;					
			            this.ProReportBillNo = DataModel.FBillNo;	
						this.ProReportSrcInterId = 0
						this.SelectWorkShopArray = [0,'请选择车间'];
						this.SelectTeamArray = [0,'请选择班组'];
						this.FinishDate = GetDate({
					                      format: true
				                                  });	
			            this.InfoListData = [];
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');					
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
								this.InfoListData = result.data.ResultData.PdaICMORptSumInfo.data0;
							},
							fail: () => {
								Config.ShowMessage('请求失败！');
								Config.PopAudioContext();
							}
						});
			},
			//获取选中的车间
			GetSelectWorkShop:function(e){
				let Pages = getCurrentPages();
				let CurrPage = Pages[Pages.length-1];		
				if(CurrPage._data != undefined && CurrPage._data.SelectWorkShopArray != undefined && CurrPage._data.SelectWorkShopArray !='' )
				{				
					this.SelectWorkShopArray = CurrPage._data.SelectWorkShopArray;
				}					
			},	
			//根据汇报单信息获取明细
			GetProReportDetailByMod:function(item){
			    this.TabSelectedIndex = 2;
			    this.ProReportSrcInterId = item.FSrcInterId;
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
			    		this.DetailListData = result.data.ResultData.PdaICMORptInfo.data0;
			    	},
			    	fail: () => {
			    		Config.ShowMessage('请求数据失败！');	
						Config.PopAudioContext();
			    	}
			    });				 
			},		
			//根据汇报单信息获取明细
			GetProReportDetailByNew:function(){
			    this.TabSelectedIndex = 2;	
				if(this.ProReportSrcInterId != 0)
				{
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
			    		this.DetailListData = result.data.ResultData.PdaICMORptInfo.data0;
			    	},
			    	fail: () => {
			    		Config.ShowMessage('请求数据失败！');		
						Config.PopAudioContext();
			    	}
			    });	
				}
			    else
				{
					this.DetailListData = [];
				}
			},
			//获取选中的标签
			GetSelectLabel:function(){
				this.SelectLabel = '';
				for (var i = 0; i < this.DetailListData.length; i++) {
					if(this.DetailListData[i].FIsChecked)
				    {						
						this.SelectLabel += this.DetailListData[i].FIndexId + ',';													
					}					
				}	
				if(this.SelectLabel != '')					
				{
					this.SelectLabel = this.SelectLabel.substr(0, this.SelectLabel.length - 1);
				}			
			}, 
			//全选/反选内箱列表项
			SelectAllLabel:function(){
				for (var i = 0; i < this.DetailListData.length; i++) {
					this.DetailListData[i].FIsChecked = !this.IsSelectAllLabel;				
				}		
			    this.IsSelectAllLabel = !this.IsSelectAllLabel;
			},	
			//删除选中的内箱列表项
			DeleteSelectLabel:function(){
				this.GetSelectLabel();	
				this.UnBinding();
			},	
			//扫码汇报外箱解绑
			UnBinding: function() {	
				let me = this;
				if(me.SelectLabel == '')					
				{
					Config.ShowMessage('请选择要删除的内箱标签！');
					Config.PopAudioContext();
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
										FIndexIdList: me.SelectLabel,
										Result:0,
										Msg:''
									}
								},
								success: (res) => {										
									uni.request({
										url: uni.getStorageSync('OtherUrl'),
										method: 'POST',
										data: {
											ModuleCode: 'getPdaICMORptInfo',
											token: uni.getStorageSync('token'),					
											ModuleParam:  {
												FId: me.ProReportInterId,
							                    FSrcInterId: me.ProReportSrcInterId									
											}
										},
										success: (resdetail) => {												
											me.DetailListData = resdetail.data.ResultData.PdaICMORptInfo.data0;
										},
										fail: () => {
											Config.ShowMessage('请求数据失败！');		
											Config.PopAudioContext();
										}
									});
									let DataModel = res.data.ResultData.ICMORpt2_10.dataparam;	
									let Result = DataModel.Result;
									if(Result == 0)
									{
										Config.ShowMessage(DataModel.Msg);
										Config.PopAudioContext();
										return;
									}
									Config.ShowMessage(DataModel.Msg);																																				
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
			//汇总页面选中的Item
			SummaryItemSelected: function(item){
				this.GetProReportInfoBySum(item);						
			},
			//单据页面选中的Item
			InfoItemSelected: function(item){	
				this.GetProReportDetailByMod(item);
		    }			
		}
	}
	    //获取选中的日期
        function GetDate(type) {
		const CurrentDate = new Date();
		let Year = CurrentDate.getFullYear();
		let Month = CurrentDate.getMonth() + 1;
		let Day = CurrentDate.getDate();
	
		if (type === 'start') {
			Year = Year - 60;
		} else if (type === 'end') {
			Year = Year + 2;
		}
		Month = Month > 9 ? Month : '0' + Month;;
		Day = Day > 9 ? Day : '0' + Day;
		return `${Year}-${Month}-${Day}`;
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
		margin-top: 50rpx;
	}
	
	.auditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;		
		border-radius: 50rpx;
		margin-left: 200rpx;
		margin-top: -96rpx;
	}
	
	.unauditproreport{	
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 380rpx;
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

	.billhead{
		width: 100%;		
		margin-top: 50rpx;
	}

	.title {	
		display: flex;		
		margin-left:50rpx;
		font-size: 40rpx;
	}
	
	.billnodata{
		display: flex;
		width: 200rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 300rpx;
		text-align: center;
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
	
	.infoscrollview{
		width: 100%;
		height: 550rpx;
		margin-top: 50rpx;
	}
	
	.detailscrollview {
		width: 100%;
		height: 850rpx;
		margin-top: 20rpx;
	}
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline{
		background-color: #007AFF;
	}
	
	.tableft {
		position: absolute;
		font-size: 40rpx;
		margin-top: 650rpx;
		margin-left: -270rpx;		
	}
	
	.tabmiddle {
		position: absolute;
		font-size: 40rpx;
		margin-top: 650rpx;		
	}
	
	.tabright {	
		position: absolute;
		font-size: 40rpx;
		margin-top: 650rpx;
		margin-left: 270rpx;
	}
	
	.tableftline {	
		position: absolute;
		width: 20%;
		height: 5rpx;
		margin-top: 680rpx;
		margin-left: -270rpx;
	}
	
	.tabmiddleline {
		position: absolute;
		width: 20%;
		height: 5rpx;
		margin-top: 680rpx;
	}
	
	.tabrightline {		
		position: absolute;
		width: 20%;
		height: 5rpx;
		margin-top: 680rpx;
		margin-left: 270rpx;
	}	
	
	.search {
		width: 90%;
		margin-left: 10rpx;
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
