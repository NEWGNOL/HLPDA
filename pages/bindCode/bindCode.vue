<template>
	<view class="content">
		<view class="code-info">
			<view class="row">
				<view>内&nbsp;&nbsp;盒：</view>
				<view class="border-info">
					<view>{{wrapCode}}</view>
					<view v-show="wrapCode == ''?false:true " @click="clearBtn(1)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
				
			</view>
			<view class="row">
				<view>产品1：</view>
				<view class="border-info">
					<view>{{goodsCode1}}</view>
					<view v-show="goodsCode1 == ''?false:true " @click="clearBtn(2)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
			</view>
			<view class="row">
				<view>产品2：</view>
				<view class="border-info">
					<view>{{goodsCode2}}</view>
					<view v-show="goodsCode2 == ''?false:true " @click="clearBtn(3)"><uni-icons type="clear" size="30"></uni-icons></view>
				</view>
				
			</view>
		</view>
		<view class="active clear">
			<button type="primary" @click="bindingCodeBtn()">绑定</button>
		</view>
		<view class="clear">
			<button type="warn" @click="clear()">全部清空</button>
		</view>
	</view>
</template>

<script>
	
	import config from '@/common/config.js'
	import { bindingCode,unBindingCode } from '@/request/CodeBindingAPI/api.js'
	export default{
		name:"bindCode",
		data(){
			return{
				wrapCode:'',
				goodsCode1:'',
				goodsCode2:'',
				Main: '',
				Receiver: ''
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
			//扫描条码
			ScanBarCode(Barcode){
				try{
					let prefix = Barcode.slice(0,3)
					if(prefix == "SL-"){
						// console.log(prefix)
						this.wrapCode = Barcode
					}else if(this.goodsCode1 == "" && this.goodsCode2 != Barcode){
						this.goodsCode1 = Barcode
					}else if(this.goodsCode2 == "" && this.goodsCode1 != Barcode){
						this.goodsCode2 = Barcode
					}else if(this.goodsCode1 == Barcode){
						this.goodsCode1 = Barcode
					}else if(this.goodsCode2 == Barcode){
						this.goodsCode2 = Barcode
					}
					else{
						uni.showModal({
							title:"请先删除已扫码标签"
						})
					}
				}catch(e){
					//TODO handle the exception
				}
			},
			bindingCodeBtn(){
				
				this.wrapCode =''
				this.goodsCode1 = ''
				this.goodsCode2 = ''
			},
			clearBtn(type){
				if(type == 1){
					this.wrapCode = ''
				}else if(type == 2){
					this.goodsCode1 = ''
				}else if(type == 3){
					this.goodsCode2 = ''
				}
			},
			clear(){
				this.wrapCode =''
				this.goodsCode1 = ''
				this.goodsCode2 = ''
			}
		},
		onLoad() {
			this.AddListener();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'/pages/bindCode/bindingCodeHistory'
			})
		}
	}
</script>

<style scoped>
	.content{
		
	}
	.row{
		display: flex;
		flex-direction: row;
		margin-bottom: 20upx;
		font-size: 40upx;
		/* align-items: center; */
		/* justify-content: center; */
	}
	.code-info{
		padding: 20upx;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		justify-content: center;
	}
	.border-info{
		border-bottom: 4upx solid #aaaa00;
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.clear{
		padding: 20upx;
	}
</style>