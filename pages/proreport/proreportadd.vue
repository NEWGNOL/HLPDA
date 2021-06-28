<template>
	<view class="content">
			<view class="tba_contain">
				<!-- 导航栏 -->
				<scroll-view class="tab" scroll-x :scroll-left="tabScroll" scroll-with-animation="true">					
					<block v-for="(item,index) in MenuList" :key="index">
						<view :class="['tab-item',currentTab == index ? 'active' : '']" :data-current="index" @click='clickMenu'>{{item.Name}}</view>
					</block>
				</scroll-view>
				<!-- 页面 -->
				<swiper class="list_content" style='height: height px' duration="500" :current="currentTab" @change="changeContent">					
					<swiper-item class="content-item">
						<uni-search-bar class="search" cancelButton="none"></uni-search-bar>
						<block style="height: 300rpx;" v-for="item in SummaryListData">
							<view class="list_img"> 
								<view>
								<text>{{'车间名称：'+ item.FDeptName + '\n' + '班组名称：' + item.FTeamName
			                    + '\n' + '制单人：' + item.FBillerName + '\n' + '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo}}</text>
								</view>
							</view>
						</block>
						<view v-if="pages_all" class="tips" @click="jz">加载更多</view>
						<view v-if="pages_all==false" class="tips2">暂无更多数据~</view>
					</swiper-item>
					<!--段子-->
					<swiper-item class="content-item" >
						<block v-for="item in list_xh">
							<view class="list">
								<view>{{item.title}}</view>
							</view>
						</block>
					</swiper-item>
				</swiper>
			</view>
		</view>
</template>


<script src="vue.js" type="text/javascript" charset="UTF-8"></script>
<script src="https://unpkg.com/element-ui/lib/index.js"></script>
<script>
	import Config from '../../common/config.js';
	export default {
		data() {
				return {
					//导航
					MenuList: [{
						Name: "汇总"
					}, 
					{
					    Name: "单据"
					},
					{
					    Name: "明细"
					}],
					SummaryListData:[],
					tabScroll: 0,
					currentTab: 0,
					//文字笑话
					list: [],
					list_xh:[
						{
							title:'段子'
						},
						{
							title:'段子'
						},
						{
							title:'段子'
						},
						{
							title:'段子'
						}
						
					],
					//图片笑话
					list_img: [	{
							title:'图文'
						},
						{
							title:'图文'
						},
						{
							title:'图文'
						},
						{
							title:'图文'
						}],
					//加载条数
					pages: 0,
					pages_all: false,
				}
			},
			onLoad() {
				uni.getSystemInfo({ // 获取当前设备的宽高，文档有
					success: (res) => {
						this.windowHeight = res.windowHeight;
						this.windowWidth = res.windowWidth;
					},
				});
			
		        this.ShowProReportSum();
			},
			methods: {
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
				//点击tab menu
				clickMenu: function(e) {
					var current = e.currentTarget.dataset.current; //获取当前tab的index
					// 导航tab共2个，获取一个的宽度
					var tabWidth = this.windowWidth / 2;
					this.tabScroll = (current - 2) * tabWidth; //使点击的tab始终在居中位置
					if (this.currentTab == current) {
						return false
					} else {
						this.currentTab = current;
					};
		
				},
				//活动menu 内容
				changeContent: function(e) {
					var current = e.detail.current; // 获取当前内容所在index,文档有
					var tabWidth = this.windowWidth / 2;
					this.currentTab = current;
					this.tabScroll = (current - 2) * tabWidth;
				},
		
				//放大图片
				chooseImage: function(e) {
					var urls = [e];
					console.log(urls)
					uni.previewImage({
						urls: urls
					})
				},
				//加载数据
				jz() {
					if (this.pages < this.list.length) {
						var pages = this.pages + 5;
						var list = this.list.slice(this.pages, pages);
						for (var i = 0; i < list.length; i++) {
							this.list_img.push(list[i]);
						};
						this.pages = pages;
					} else {
						this.pages_all = false;
					}
				},
		
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
		margin-bottom: 40upx;
	}
	
	.content-item {
		width: 95%;
		/* height: 200rpx; */
		margin: 0 auto;
		margin-bottom: 40upx;
	}
	
	.tba_contain {
		width: 100%;
		height: 100%;
	}
	
	.tab {
		width: 100%;
		height: 100rpx;
		position: fixed;
		left: 0;
		white-space: nowrap;
		box-sizing: border-box;
		overflow: hidden;
		line-height: 100rpx;
		background: #007AFF;
		;
		z-index: 999;
	}
	
	.tab-item {
		display: inline-block;
		width: 33.3%;
		text-align: center;
		font-size: 16px;
		color: #fff;
	}
	
	.search {
		position: absolute;
		width: 90%;
		margin-left: 20rpx;
	}
	
	.active {
		color: fff;
		font-size: 20px;
		;
	}
	
	.list_content {	
		padding-top:100rpx;
		box-sizing: border-box;
		text-align: center;
		font-size: 14px;
		min-height: 100vh;
	}
	
	.content-item {
		overflow-y: scroll;
		margin: 0 auto;		
	}
	
	.list_img {
		width: 95%;
		margin: 0 auto;
		text-align: left;
		font-size: 16px;
		margin-top: 40rpx;
		border-bottom: solid 1px #ccc;
	}
	
	.list_img view {
		margin-bottom: 10px;
	}
	
	.list_img image {
		margin-bottom: 10px;
	}
	
	.list {
		width: 90%;
		margin: 0 auto;
		padding: 2.5%;
		text-align: left;
		font-size: 16px;
		margin-top: 20rpx;
		color: #333;
		padding-bottom: 80rpx;
		/* box-shadow: 0px 0px 10px #247CF0;
		background-color: #247CF0; */
		border-bottom: solid 1px #eee;
	}
	
	.sj-active{
		display: block;
		float: right;
		width: 40px;
		padding: 10rpx;
		text-align: center;
		color: #fff;
		font-size: 28rpx;
		background-color: #247CF0;
	}
	
	.list view:nth-child(1) {
		font-weight: bold;
	}
	
	.list view:nth-child(2) {
		padding-top: 10px;
		font-size: 16px;
		margin-bottom: 10px;
	}
	
	.tips{
		width: 180px;
		margin: 0 auto;
		margin-top: 30rpx;
		background: #666;
		line-height: 100rpx;
		text-align: center;
		color: #fff;
		font-size: 14px;
	}
	
	.tips2{
		text-align: center;
		color: #CCCCCC;
		font-size: 14px;
		margin-top: 20px;
	}
</style>
