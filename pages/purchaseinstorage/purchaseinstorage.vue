<template>
	<view class="content">
		<view class="instorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowPurchaseInfo()">
			</billstatus>
			<button class="addstoragein" v-bind:disabled="!IsAddStorageIn" v-on:click="AddStorageIn()">新增</button>
			<button class="querystoragein" v-bind:disabled="IsAddStorageIn" v-on:click="QueryStorageIn()">查询</button>
		</view>
		
		
		
		<view class="instorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
		     <button class="deletestoragein" v-on:click="DeleteStorageIn()">删除</button>
		     <button class="auditstoragein" v-on:click="AuditStorageIn()">审核</button>
		     <button class="unauditstoragein" v-on:click="UnAuditStorageIn()">反审</button>
			 
			 <view class="billhead" v-show="IsBillHeadVisible">
			 	<text class="title">单据编号：</text>
			 	<text class="billnoempty">{{StorageInBillNo}}</text>
			 	<view class="dataline"></view>
			 	
			 	<text class="title">供应商：</text>
			 	<view class="data">{{SelectSupplierArray[1]}}</view>			 	
			 	<view class="dataline"></view>
			 
			 	<text class="title">入库日期：</text>
			 	<picker mode="date" :value="InStorageDate" :start="StartDate" :end="EndDate" @change="InStorageDateChange">
			 		<view class="data">{{InStorageDate}}</view>
			 	</picker>
			 	<view class="dataline"></view>
			 </view>
		</view>
		
		
		
		<view class="instorageview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			
		</view>
		
		
		
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">采购单</text>
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
	export default {
		data() {
			return {
				StorageInterId: 0,
				StorageInBillNo: '空',
				SelectSupplierArray: [0, '请选择供应商'],
				SearchValue: '',
				SelectStatus: '',
				StatusArray: ['未入库', '已入库'],
				StorageInAndBin: [],
				TabSelectedIndex: 0,
				TouchStartX: 0,
				InStorageDate: DateFormat({
					format: true
				}),
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				IsBillHeadVisible: true,
				IsAddStorageIn: true
			}
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods: {
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
					} 
					else if (this.TabSelectedIndex == 1) {
						
					} 
					else {						
					}
				}
			},
			//滑动页面
			SlidingPage: function(IsSlidingLeftPage) {
				if (IsSlidingLeftPage) {
					this.TabSelectedIndex++;
				} 
				else {
					this.TabSelectedIndex--;
				}
				
				if (this.TabSelectedIndex == 0) {
				} 
				else if (this.TabSelectedIndex == 1) {
					
				} 
				else {						
				}
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//显示采购订单信息
			ShowPurchaseInfo:function(){
				
			},
			//新增入库单
			AddStorageIn: function() {
				// let IsSucess = this.GetSelectProreportByAdd();
				// if (IsSucess == 0) {
				// 	return;
				// }
				this.SwitchTab(1);
				this.AddStorageInBillNo();				
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
							return;
						}
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.StorageInterId = DataModel.FId;
						this.StorageInBillNo = DataModel.FBillNo;
						this.InStorageDate = DateFormat({
							format: true,
						});
						this.StorageInListData = [];
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
			//查询入库单
			QueryStorageIn: function() {
				// let IsSuccess = this.GetSelectProreportByQuery();
				// if (IsSuccess == 0) {
				// 	return;
				// }
				this.SwitchTab(1);				
			},		
			//审核入库单
			AuditStorageIn: function() {
			
			},
			//反审核入库单
			UnAuditStorageIn: function() {				
			},
			//选择入库日期
			InStorageDateChange(e) {
				this.InStorageDate = e.detail.value
			},
			//条件搜索采购订单列表
			ValueChanged: function() {
				this.ShowPurchaseInfo()();
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
</script>

<style>
    .content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.search {
		position: absolute;
		width: 70%;
		margin-left: 5upx;
	}
	
	.billstatus {
		margin-top: -90upx;
		margin-left: 570upx;
	}
	
	.addstoragein {
		width: 20%;
		uheight: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}
	
	.querystoragein {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -90upx;
	}
	
	.billhead {
		width: 100%;
		margin-top: 50upx;
	}
	
	.title {		
		margin-left: 50upx;
		font-size: 40upx;
	}
	
	.billnoempty {		
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 100upx;
		text-align: center;
		color: #777777;
	}	
	
	.data {	
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
	
	.auditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 300upx;
		margin-top: -96upx;
	}
	
	.unauditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}
	
	.deletestoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 20upx;
	}
	
	.instorageview {
		width: 100%;
		height: 950upx;
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
		width: 18%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 40upx;
	}
	
	.tabmiddleline {
		position: absolute;
		width: 18%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 330upx;
	}
	
	.tabrightline {
		position: absolute;
		width: 15%;
		height: 5upx;
		margin-top: 80upx;
		margin-left: 620upx;
	}
</style>
