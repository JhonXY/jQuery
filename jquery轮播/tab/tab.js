//闭包形式封装代码
(function($){  // $ 接受传入的jquery
	var Tab = function(tab){

		var _this = this; // this代表Tab类

		//保存单个tab组件，之所以要保存是因为原型中会用到
		this.tab = tab; // 传入的参数是等待构造的每个组件

		//默认配置参数
		this.config={
			//定义鼠标触发类型
			"type": "mouseover",
			//定义切换效果
			"effect":"default",
			//定义初始触发项
			"invoke":"1",
			//定义切换间隔时间
			"auto":false
		}

		//保存tab标签列表
		this.tabItems = this.tab.find('ul.tab-nav li');
		// 对应的内容列表
		this.contentItems = this.tab.find('div.content-wrap div.content-item')

		//如果配置参数存在, 就扩展掉默认参数
		if (this.getConfig()) {
			$.extend(this.config, this.getConfig());
		}
		//console.log(this.config)

		//保存配置参数
		var config = this.config;
		if (config.type === "click") {
			this.tabItems.on('click',function(){
				_this._toggle($(this))
			})
		}else{
			this.tabItems.on('mouseover', function(){
				_this._toggle($(this))
			})
		}
		if (config.effect === 'fade') {

		}else{
			config.effect = 'default';
		}
		if (config.invoke >= this.tabItems.length) {
			config.invoke = 0;
		}

		this._toggle(this.tabItems.eq(config.invoke-1));
		this.numToggle = function(interval){
			var _this=this;
			//判断this.i是否存在,不存在则通过查找on获取索引
			this.i = this.i || this.tabItems.find('.on').index();
			this.t = setInterval(function(){
				if (_this.i<_this.tabItems.length-1) {
					_this.i++;
				}else{
					_this.i =0;
				}
				_this._toggle(_this.tabItems.eq(_this.i),true);
			},interval)
		}


		if (config.auto) {
			this.numToggle(config.auto);
		}
		//鼠标放在tab上停止动画,离开动画继续
		this.tab.hover(function() {
			clearInterval(_this.t)
		}, function() {
			if (_this.config.auto) {
				_this.numToggle(config.auto)
			}
		});
	}

	// 原型就是用来存储一些固定不变的方法，能够自由调用构造函数内的属性
	Tab.prototype = {
		//获取配置参数
		getConfig:function(){
			//获取tab的data-config
			var config = this.tab.data('config');
			//确保有配置参数
			if (config && config!="") {
				return config;
			}else{
				return null;
			}
		},
		_toggle:function(currTab,flag){
			//每次toggle重新设定自动toggle
			var _this = this;
			var i = currTab.index();
			this.i = i;
			var _effect =this.config.effect == 'fade' ? 500:0;
			currTab.addClass('on').siblings().removeClass('on');
			//设定toggle触发时,内容延迟显示
			var t =setTimeout(function(){
				//添加stop()取消动画堆积效果
				_this.contentItems.eq(i).stop().fadeIn(_effect).siblings().stop().fadeOut(_effect)
			},200);
		}
	}

	//Tab添加静态方法
	Tab.init = function(tabs){
		var _this = this; // _this代表Tab.init这个方法
		tabs.each(function(index, el) {
			// console.log(this);
			// console.log($(this));
			// console.log(_this);
			new _this($(this));  // $(this)代表each出的每个dom元素并用jquery进行包装，调用外部的Tab来new，形成一个闭包
		});
	}

	$.fn.extend({
		tab: function () {
			this.each (function () {
				new Tab($(this))  // $(this)表示传入的jquery集合的每个dom元素
			})
		}
	})

	//将Tab赋值为全局变量
	window.Tab = Tab; // 将这个类注册到windows对象上，使外部能够访问
})(jQuery) // 匿名函数传入jquery
