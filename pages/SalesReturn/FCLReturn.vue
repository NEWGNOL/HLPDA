<template>
	<view>
		<view class="billhead" v-show="billShow"  ref="billheader">
			<view class="button-box">
				<!-- <button @click="BillSave" type="default" >保存</button> -->
				<button @click="AuditBill" type="primary" :disabled="billHeader.FStatus == 1" >审核</button>
				<button @click="DeleteMode" type="warn" :disabled="billHeader.FStatus == 1">{{deleteTitle}}</button>
			</view>
			<view class="billhead-child">
				<view class="row">
					<view>单据编号：</view>
					<view class="row-info">{{billHeader.FBillno}}</view>
				</view>
				<view class="row">
					<view>创建日期：</view>
					<view class="row-info">{{billHeader.FCreateDate}}</view>
				</view>
				<view class="row">
					<view>创建用户：</view>
					<view class="row-info">{{billHeader.FUserName}}</view>
				</view>
				<view class="row">
					<view>单据状态：</view>
					<view class="row-info">{{billHeader.FStatus == 0? '未审核':'已审核'}}</view>
				</view>
			</view>
		</view>
		<scroll-view :class="[ billShow==true?'billEntry':'billEntryBill']" ref="Entry" scroll-y="true">
			<view class="list">
				<uni-list>
					<uni-list-item v-for="(item,index) in billEntry" :key="index">
						<template v-slot:body>
							<view class="slot-box" @click="selectItem(item)">
								<view class="info-box" style="flex: 1;">
									<view>序号：{{item.FSeq}}</view>
									<view>扫码标签：{{item.FBarCode}}</view>
									<view>物料信息：{{item.FName}}/{{item.FModel}}/{{item.FNumber}}</view>
								</view>
								<view class="icon-box" style="border-left: #cacaca solid 1px;" v-show="deleteMode">
									<view @click.stop="DeleteItem(item)">
										<uni-icons type="closeempty" size="30"></uni-icons>
									</view>
								</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</view>
		</scroll-view>	
	</view>
</template>

<script>
import Config from '@/common/config.js'
import {PostRequest} from '@/request/request.js'
export default{
	name:"FCLReturn",
	data(){
		return{
			billShow:true,
			deleteMode:false,
			deleteTitle:'删除模式',
			isChange:false,
			type:"新增",
			billHeader:{
				FID: '',
				FBillno: '',
				FStatus: '',
				FCreateDate: '',
				FUserName :'',
				FCreateUserId:''
			},
			
			billEntry:[]
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
		async ScanBarCode(Barcode){
			console.log(Barcode)
			// this.billEntry.push({barCode:Barcode})
			//判断当前单据体是否有该标签
			if(this.billHeader.FStatus == 1){
				Config.ShowMessage('该单据已审核，不允许扫码');
				Config.PopAudioContext(false);
				return
			}
			this.isChange = true
			uni.showLoading({
				title:'加载中'
			})
			for(let i = 0 ; i<this.billEntry.length ;i++){
				if(Barcode == this.billEntry[i].FBarCode){
					uni.hideLoading();
					Config.ShowMessage('该标签已存在');
					Config.PopAudioContext(false);
					return
				}
			}
			
			var api = uni.getStorageSync('OtherUrl')
			var data = {
				ModuleCode:"SCAN_SALESRETURN",
				token:uni.getStorageSync('token'),
				ModuleParam:{
					label:Barcode,
					FID:this.billHeader.FID
				},
			}
			var result = await PostRequest(api,data)
			
			console.log(result)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			let ResultData = result.data.ResultData.data.data0
			if(ResultData.FStatus == -1){
				uni.hideLoading();
				Config.ShowMessage(ResultData.FMessage);
				Config.PopAudioContext(false);
				return
			}
			
			let item = {
				"FSeq":this.billEntry.length + 1,
				"FID":0,
				"FLabelId": ResultData.FLabelId,
				"FBarCode": ResultData.FBarCode,
				"FName": ResultData.FName,
				"FModel": ResultData.FModel,
				"FNumber": ResultData.FNumber
			}
			this.billEntry.push(item)
			uni.hideLoading();
		},
		BillSave(){
			
		},
		DeleteMode(){
			if(this.deleteMode){
				this.deleteMode = false
				this.deleteTitle = '删除模式'
			}else{
				this.deleteMode = true
				this.deleteTitle = '退出删除'
			}
		},
		selectItem(item){
			console.log(item)
		},
		DeleteItem(item){
			var that = this
			console.log(item)
			uni.showModal({
				title:"确认删除？",
				success:async function (res) {
					if (res.confirm) {
						try{
							await that.deleteItemExcommd(item)
							await that.RefreshEntry()
							// that.RefreshSeq()
						}catch(e){
							console.log(e)
							Config.ShowMessage('网络异常');
							Config.PopAudioContext(false);
							return;
						}
						
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
		},
		async deleteItemExcommd(item){
			var data = {"ModuleCode":"DeleteSalesReturnEntry","token":uni.getStorageSync('token'),"ModuleParam":{"FID":this.billHeader.FID,"LabelId":item.FLabelId}}
			var api = uni.getStorageSync('OtherUrl')
			var result = await PostRequest(api,data)
			// console.log(result)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			Config.ShowMessage('删除成功');
		},
		async RefreshEntry(){
			var api = uni.getStorageSync('OtherUrl')
			let data1 = {"ModuleCode":"t_salesReturnEntry_list","token":uni.getStorageSync('token'),"ModuleParam":{"FID":this.billHeader.FID}}
			var result1 = await PostRequest(api,data1)
			let ResultCode1 = result1.data.ResultCode;
			let ResultMsg1 = result1.data.ResultMsg;
			if (ResultCode1 == 'FAIL' && ResultMsg1 == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode1 == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg1);
				Config.PopAudioContext(false);
				return
			}
			let ResultData1 = result1.data.ResultData.data.data0
			console.log(ResultData1)
			this.billEntry = []
			for(let i = 0 ; i<ResultData1.length ;i++){
				let item = {
					"FSeq":i + 1,
					"FID":ResultData1[i].FID,
					"FLabelId": ResultData1[i].FLabelId,
					"FBarCode": ResultData1[i].FBarCode,
					"FName": ResultData1[i].FName,
					"FModel": ResultData1[i].FModel,
					"FNumber": ResultData1[i].FNumber
				}
				this.billEntry.push(item)
			}
		},
		RefreshSeq(){
			for(let i = 0 ; i < this.billEntry.length ; i++){
				this.billEntry[i].FSeq = i+1;
			}
		},
		async AuditBill(){
			uni.showLoading({
				title:'审核中'
			})
			var data = {"ModuleCode":"SalesReturnAudit","token":uni.getStorageSync('token'),"ModuleParam":{"FID":this.billHeader.FID}}
			var api = uni.getStorageSync('OtherUrl')
			try{
				var result = await PostRequest(api,data)
			}catch(e){
				uni.hideLoading();
				console.log("SalesReturnAudit",e)
				Config.ShowMessage('网络异常');
				Config.PopAudioContext(false);
				return
			}
			console.log(result)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			let ResultData = result.data.ResultData.data.data0
			if(ResultData.statusCode == 0){
				uni.hideLoading();
				this.billHeader.FStatus = 1
				Config.ShowMessage(ResultData.msg);
			}else{
				uni.hideLoading();
				Config.ShowMessage(ResultData.msg);
			}
		},
		DelayGoBack(){
			setTimeout(()=>{
				uni.navigateBack()
			},2000)
		},
		async DeleteBill(){
			var data = {"ModuleCode":"DeleteSalesReturnHeader","token":uni.getStorageSync('token'),"ModuleParam":{"FID":this.billHeader.FID}}
			var api = uni.getStorageSync('OtherUrl')
			try{
				var result = await PostRequest(api,data)
			}catch(e){
				//TODO handle the exception
				Config.ShowMessage('网络异常');
				Config.PopAudioContext(false);
				return
			}
			// console.log(result)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			let ResultData = result.data.ResultData.data.data0
			Config.ShowMessage('删除成功');
		}
	},
	beforeMount() {
		
	},
	mounted() {
		console.log("FCLReturn")
	},
	async onLoad(e) {
		this.AddListener();
		console.log(e)
		uni.showLoading({
			title:'加载中'
		})
		if(e.FID!=0){
			//单据头
			let data = {"ModuleCode":"t_salesReturn_list","token":uni.getStorageSync('token'),"ModuleParam":{"type":"1","FID":e.FID}}
			var api = uni.getStorageSync('OtherUrl')
			
			var result = await PostRequest(api,data)
			
			// console.log(result)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				return
			}
			let ResultData = result.data.ResultData.data.data0[0]
			this.billHeader = ResultData
			
			//单据体
			
			let data1 = {"ModuleCode":"t_salesReturnEntry_list","token":uni.getStorageSync('token'),"ModuleParam":{"FID":e.FID}}
			var result1 = await PostRequest(api,data1)
			let ResultCode1 = result1.data.ResultCode;
			let ResultMsg1 = result1.data.ResultMsg;
			if (ResultCode1 == 'FAIL' && ResultMsg1 == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				this.DelayGoBack()
				return;
			}
			if(ResultCode1 == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg1);
				Config.PopAudioContext(false);
				this.DelayGoBack()
				return
			}
			let ResultData1 = result1.data.ResultData.data.data0
			console.log(ResultData1)
			this.billEntry = []
			for(let i = 0 ; i<ResultData1.length ;i++){
				let item = {
					"FSeq":i + 1,
					"FID":ResultData1[i].FID,
					"FLabelId": ResultData1[i].FLabelId,
					"FBarCode": ResultData1[i].FBarCode,
					"FName": ResultData1[i].FName,
					"FModel": ResultData1[i].FModel,
					"FNumber": ResultData1[i].FNumber
				}
				this.billEntry.push(item)
			}
			uni.hideLoading()
		}else if(e.FID==0){
			uni.showLoading({
				title:'加载中'
			})
			//获取单据头FID , 单据头编号
			var data = {"ModuleCode":"GetBillNoId","token":uni.getStorageSync('token'),"ModuleParam":{"FUserName":uni.getStorageSync("FUserName"),"FCreateUserId":uni.getStorageSync("FUserId")}}
			var api = uni.getStorageSync('OtherUrl')
			var result = await PostRequest(api,data)
			let ResultCode = result.data.ResultCode;
			let ResultMsg = result.data.ResultMsg;
			if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
				uni.hideLoading();
				Config.ShowMessage('账号登录异常，请重新登录！');
				Config.PopAudioContext(false);
				// uni.navigateBack()
				this.DelayGoBack()
				return;
			}
			if(ResultCode == 'FAIL'){
				uni.hideLoading();
				Config.ShowMessage(ResultMsg);
				Config.PopAudioContext(false);
				// uni.navigateBack()
				this.DelayGoBack()
				return
			}
			let ResultData = result.data.ResultData.data.data0
			console.log(ResultData)
			
			this.billHeader.FID = ResultData.FID
			this.billHeader.FBillno = ResultData.FBillno
			this.billHeader.FStatus = 0
			this.billHeader.FCreateDate = ResultData.FCreateDate
			this.billHeader.FUserName = uni.getStorageSync("FUserName");
			this.billHeader.FCreateUserId = uni.getStorageSync("FUserId");
			uni.hideLoading()
			//
		}
		//初始化 单据头 单据体
		
	},
	onUnload() {
		this.RemoveListener();
	},
	onNavigationBarButtonTap() {
		// this.$refs.inputDialog.open()
		// console.log(this.$refs.billheader.$el.style)
		if(this.billShow ){
			this.billShow = false
		}else{
			this.billShow = true
		}
		
	},
	onBackPress(e) {
		// console.log(e)
		if (e.from === 'navigateBack') {
				return false;
		}
		if(e.from ==='backbutton'){
			// if(this.isChange){
			// 	uni.showModal({
			// 		title:'提示',
			// 		content:'当前页面数据已改变，但未保存，是否退出？',
			// 		success: function (res) {
			// 			if (res.confirm) {
			// 				// console.log('用户点击确定');
			// 				uni.navigateBack()
			// 			} else if (res.cancel) {
			// 				// console.log('用户点击取消');
			// 			}
			// 		}
			// 	})
			// }else{
			// 	// uni.navigateBack()
			// 	return false
			// }
			var that = this
			if(this.billEntry.length == 0){
				uni.showModal({
					title:'提示',
					content:'当前单据扫码条数为0，是否删除？',
					success: async function (res) {
						if (res.confirm) {
							// console.log('用户点击确定');
							that.DeleteBill()
							uni.navigateBack()
						} else if (res.cancel) {
							// console.log('用户点击取消');
							uni.navigateBack()
						}
					}
				})
			}else{
				uni.navigateBack()
			}
			return true
		}
	}
}
</script>

<style scoped>
	.button-box{
		display: flex;
		flex-direction: row;
		padding-top: 5px;
		background-color: antiquewhite;
		padding-bottom: 5px;
	}
	
	.billhead{
		/* background-color: antiquewhite; */
		/* height: 15vh; */
		/* height: 15vh; */
		transition: 0.5s;
		
	}
	.billhead-child{
		padding: 15px;
		border-bottom: #b0b0b0 solid 1px;
	}
	.billEntry{
		/* background-color: blue; */
		height: 70vh;
	}
	.billEntryBill{
		height: 90vh;
	}
	.slot-box{
		width: 100%;
		color: #818181;
		display: flex;
		flex-direction: row;
	}
	.icon-box{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.row{
		display: flex;
		flex-direction: row;
	}
	.row-info{
		text-align: center;
		border-bottom: #b0b0b0 solid 1px;
		width: 60%;
	}
</style>