<template>
	<view class="container">
		<view class="outstorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowSEOrderInfo()">
			</billstatus>
			<button class="addstorageout" v-bind:disabled="!IsAddStorageOut" v-on:click="AddStorageOut()">新增</button>
			<button class="querystorageout" v-bind:disabled="IsAddStorageOut" v-on:click="QueryStorageOut()">查询</button>
			<scroll-view class="poorderscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOrderListData" :key="index" :title="'销售订单制单人：'
				    + item.FBillerName + '\n'+ '销售订单制单日期：' + item.FDate + '\n' + '销售订单编号：' + item.FBillNo
					+ '\n' + '发货通知单编号：' + item.FPOOrderBillNo" clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"
						@CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>
		
		
		<view class="outstorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
		</view>
		
		
		<view class="outstorageview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data(){
			return {
				SearchValue: '',
				SelectStatus: '未出库',
				StatusArray: ['未出库', '已出库'],
				TabSelectedIndex: 0,
				TouchStartX: 0,
				IsAddStorageOut: true,
				SEOrderListData: []
			}
		},
		methods:{
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
			//新增销售出库单
			AddStorageOut:function(){
				
			},
			//查询销售出库单
			QueryStorageOut:function(){
				
			},
			//显示销售订单列表
			ShowSEOrderInfo:function(){
				
			},
			//检测销售订单（发货通知单）是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//条件搜索采购销售订单（发货通知单）列表
			ValueChanged: function() {
				this.ShowSEOrderInfo();
			}
		}
	}
</script>

<style>
	.outstorageview {
		width: 100%;
		height: 950upx;
	}
	
	.poorderscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 20upx;
	}
	
	.addstorageout {
		width: 20%;
		uheight: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}
	
	.querystorageout {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -95upx;
	}
</style>
