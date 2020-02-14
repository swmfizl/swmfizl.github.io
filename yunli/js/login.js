new Vue({
	el: "#Login",
	data: {
		account: "",
		password: ""
	},
	methods: {
		login: function() {
			if (!this.account) {
				this.$message({
					showClose: true,
					message: '请输入账号！',
					type: 'error'
				});
				return;
			}
			if (!this.password) {
				this.$message({
					showClose: true,
					message: '请输入密码！',
					type: 'error'
				});
				return;
			}
			var THIS = this;
			JCloud.login({
				account: this.account,
				password: this.password
			}, function(res) {
				if (res.status == 0) {
					document.cookie = "yunli_token=" + res.data.token +  "; path=/";
					window.location.href = window.location.href.split("/index.html")[0] + "/page/home.html"
				} else {
					if (res.status == "-7") {
						THIS.$message({
							showClose: true,
							message: '账号或秘密错误！',
							type: 'error'
						});
					} else if (res.status == "-9") {
						THIS.$message({
							showClose: true,
							message: '登陆超时！',
							type: 'error'
						});
					}
				}
			})
		}
	},
	mounted: function() {
		if(Util.getCookie("yunli_token")) {
			window.location.href = window.location.href.split("/index.html")[0] + "/page/home.html"
		}
	}
})
