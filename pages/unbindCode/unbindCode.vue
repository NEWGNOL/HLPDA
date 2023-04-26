<template>
	<view class="content">
		<view class="search-header">
			<view class="search-box">
				<!-- <uni-search-bar style="flex: 1;" @focus="" @confirm="search" v-model="searchValue" @input="input"
					@cancel="cancel" @clear="clear" cancelButton="none" >
				</uni-search-bar> -->
				<view class="search-icon">
					<uni-icons type="search" size="30"></uni-icons>
				</view>
				<view class="search-box-left">
					{{searchValue}}
				</view>
				
			</view>
			<view>
				<button @click="searchBtn" type="primary">查找</button>
			</view>
		</view>
		<view class="history-info">
			<view class="margin-bottom" v-for="item in historyInfo" :key="item.id">
				<view class="his-box">
					<view class="his-header">
						<view class="his-title">内箱：{{item.wrapBox}}</view>
						<view class="his-btn">
							<button  type="primary" @click="UnBindingCode(item)">
								解绑
							</button>
						</view>
					</view>
					<!-- 分割线 -->
					<view>
						<view style="border-bottom: 1px solid #ffe4cd;"></view>
					</view>
					<view class="his-detail">
						<view class="margin-bottom">
							产品1：{{item.label1}}
						</view>
						<view class="margin-bottom">
							产品2：{{item.label2}}
						</view>
						<view class="margin-bottom">
							绑定日期：{{item.date}}
						</view>
						<view class="margin-bottom">
							操作人：{{item.user}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"unbindCode",
		data(){
			return{
				searchValue:'请扫描条码',
				historyInfo:[]
			}
		},
		methods:{
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
					me.ScanBarCode(Barcode);
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
				
			ScanBarCode(Barcode){
				this.searchValue = Barcode
			},
			searchBtn(){
				var a = [
					{
						id:"1",
						wrapBox:"SL-125S4561",
						label1:"ws5425dzdwa",
						label2:"wskxjs142wd",
						date:"2023/4/26",
						user:"梁健林"
					},
					{
						id:"2",
						wrapBox:"SL-125S4561",
						label1:"ws5425dzdwa",
						label2:"wskxjs142wd",
						date:"2023/4/26",
						user:"龙文"
					}
				]
				this.historyInfo.length = 0;
				this.historyInfo.push(...a)
			},
			UnBindingCode(item){
				uni.showModal({
					title:"解绑操作",
					content:"确认解绑？",
					success:(res)=> {
						if (res.confirm) {
							// console.log('用户点击确定');
							console.log(item.id)
							//此处做网络请求处理
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					},
					fail:(err)=> {
						
					}
				})
			}
		},
		onLoad() {
			this.AddListener();
		},
		onUnload() {
			this.RemoveListener();
		}
	}
</script>

<style scoped>
	.content{
		padding: 10upx;
	}
	.search-header{
		/* position: fixed;
		top: 10upx;
		left: 10upx; */
		display: flex;
		flex-direction: row;
	}
	.search-box{
		/* width: 100%; */
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 5px;
		border-radius: 6px;
		border: 1px solid #e0e0e0;
		box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
		margin-right: 10upx;
	}
	.search-box-left{
		color: gray;
	}
	.search-icon{
		margin-right: 10upx;
	}
	.his-box{
		box-shadow: rgba(99, 99, 99, 0.2) 2px 2px 8px 0px;
		border-radius: 6px;
		padding: 20upx;
	}
	.his-header{
		margin-top: 20upx;
		margin-bottom: 20upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.his-detail{
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-items: center;
	}
	.margin-bottom{
		/* margin-top: 20upx; */
		margin-bottom: 10upx;
	}
</style>