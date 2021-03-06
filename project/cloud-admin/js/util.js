const Util = {
	/**
	 * 获取cookie
	 * @param {String} name
	 * @return {String}
	 */
	getCookie: function(name) {
		var cookieList = document.cookie.split("; ");
		var cookieJson = {};
		for (var index in cookieList) {
			cookieJson[cookieList[index].split("=")[0]] = cookieList[index].split("=")[1];
		}
		return cookieJson[name]
	},

	/**
	 * @param {String} fmt 格式
	 * @param {Object} date 待格式时间对象
	 */
	dateFormat: function(fmt, date) {
		var ret;
		const opt = {
			"y+": date.getFullYear().toString(), // 年
			"M+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"h+": date.getHours().toString(), // 时
			"m+": date.getMinutes().toString(), // 分
			"s+": date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (var k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	},

	/**
	 * 生成一个UUID
	 */
	uuid: function() {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	}
}
