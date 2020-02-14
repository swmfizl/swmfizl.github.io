new Vue({
	el: "#YunLiAdmin",
	data: {
		loading: false,
		menuBar: MenuBar, // 左侧菜单
		// 活动窗口面包屑
		breadcrumb: {
			icon: "el-icon-s-home", // 面包屑icon
			path: ["基本信息", "账户信息"] // 面包屑路径
		},
		// 用户信息
		account: {
			unit: {},
			user: {},
			permit: {
				dataPermit: [],
				filePermit: []
			}
		},
		accountInfoMap: AccountInfoMap, // 账号信息映射表
		indexPage: "1-1", // 当前活动页面
		selectDataCenterPermit: "", // 当前选择数据权限
		dataCenterPermitList: [], // 数据权限列表
		editorJsonAdd: null, // 新增数据编辑器
		// JSON编辑器默认数据
		editorDefaultJson: {
			"desk": "描述",
			"time": "创建时间"
		},
		dataList: [], // 数据记录列表当前展示记录
		dataSum: 0, // 数据记录总数
		dataPageIndex: 1, // 数据记录当前展示页面
		dataPageSize: 10, // 数据记录页面大小
		editorJsonEdit: null, // 编辑数据编辑器
		isEditJsonData: false, // 当前是否显示编辑数据编辑器,
		editJsonDataId: null, // 当前编辑数据的ID
		selectFileSystemPermit: "", // 当前选择文件权限
		fileSystemPermitList: [], // 文件权限列表
		fileList: [], // 文件系统当前展示记录
		fileSum: 0, // 文件记录总数
		filePageIndex: 1, // 文件记录当前展示页面
		filePageSize: 10, // 文件记录页面大小
		// 文件上传默认配置
		fileUploadConf: {
			url: "",
			data: {
				"token": "",
				"collection": ""
			}
		},
		documentBoxUrl: "", // 文档查看窗口路径
	},
	methods: {
		/**
		 * 左侧菜单目路由
		 * @param {Object} submenu 子菜单
		 * @param {Object} page 目标页面
		 */
		toMenuPage: function(submenu, page) {
			var THIS = this;
			if (submenu.index == 0) {
				this.exitLanding()
			} else {
				if (Object.keys(this.account.user).length == 0) {
					this.$message({
						showClose: true,
						message: '请等待获取用户信息完成再执行操作！',
						type: 'warning'
					});
					return;
				}
				this.indexPage = page.index;
				this.breadcrumb = {
					icon: submenu.icon,
					path: [submenu.text, page.text]
				}
				switch (this.indexPage) {
					case "2-1":
						setTimeout(function() {
							THIS.initEditorJsonAdd()
						}, 5)
						break;
					case "2-2":
						this.queryDataList({
							"pageIndex": 1,
							"pageSize": 10
						});
						this.isEditJsonData = false;
						break;
					case "3-2":
						this.queryFileList({
							"pageIndex": 1,
							"pageSize": 10
						});
						break;
					case "4-1":
						this.documentBoxUrl = "./doc/docDataCenter.html";
						break;
					case "4-2":
						this.documentBoxUrl = "./doc/docFileSystem.html";
						break;
					default:
						break;
				}
			}
		},

		/**
		 *  查询用户信息
		 */
		queryUserInfo: function() {
			var THIS = this;
			var token = Util.getCookie("yunli_token");
			this.loading = true;
			JCloud.userQuery(token, function(res) {
				if (res.status == 0) {
					THIS.account = res.data;
				} else if (res.status == "-7") {
					document.cookie = "yunli_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
					window.location.href = window.location.href.split("/page")[0] + "/index.html";
				}

				// 文件权限
				THIS.fileSystemPermitList = [];
				if (THIS.account.permit.filePermit.length > 0) {
					THIS.fileSystemPermitList = THIS.account.permit.filePermit;
					THIS.selectFileSystemPermit = THIS.fileSystemPermitList[0].collection
				}

				// 数据权限
				THIS.dataCenterPermitList = [];
				if (THIS.account.permit.dataPermit.length > 0) {
					THIS.dataCenterPermitList = THIS.account.permit.dataPermit;
					THIS.selectDataCenterPermit = THIS.dataCenterPermitList[0].collection
				}

				setTimeout(function() {
					THIS.loading = false;
				}, 500)
			})
		},

		/**
		 * 退出登陆
		 */
		exitLanding: function() {
			document.cookie = "yunli_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
			window.location.href = window.location.href.split("/page")[0] + "/index.html";
		},

		/**
		 * 初始化新增数据JSON编辑器
		 */
		initEditorJsonAdd: function() {
			if (this.account.permit.dataPermit.length == 0) {
				this.$message({
					showClose: true,
					message: '没有数据中心权限！',
					type: 'warning'
				});
				return;
			}
			if (this.editorJsonAdd == null) {
				this.editorJsonAdd = CodeMirror.fromTextArea(document.getElementById("EditorJsonAdd"), {
					lineNumbers: true,
					mode: "application/json",
					gutters: ["CodeMirror-lint-markers"],
					lint: true,
					styleActiveLine: true
				});
			}
			this.editorDefaultJson.time = Util.dateFormat("yyyy-MM-dd hh:mm:ss", new Date());
			this.editorJsonAdd.setValue(JSON.stringify(this.editorDefaultJson));
		},

		/**
		 * 查询数据中心数据集
		 * @param {String} condition 查询条件
		 */
		queryDataList: function(condition) {
			this.dataPageIndex = condition.pageIndex;
			this.dataPageSize = condition.pageSize;
			var THIS = this;
			if (this.account.permit.dataPermit.length == 0) {
				this.$message({
					showClose: true,
					message: '没有数据中心权限！',
					type: 'warning'
				});
				return;
			}
			var collection = this.selectDataCenterPermit;
			this.loading = true;
			JCloud.dataQuery({
				collection: collection,
				condition: condition
			}, function(res) {
				THIS.dataList = res.data.data;
				THIS.dataSum = res.data.sum;
				setTimeout(function() {
					THIS.loading = false;
				}, 500)
			})
		},

		/**
		 * 数据记录翻页
		 * @param {Int} 页码
		 */
		dataChangePageIndex: function(page) {
			this.queryDataList({
				"pageIndex": page,
				"pageSize": this.dataPageSize
			})
		},
		/**
		 * 数据记录改变页面大小
		 * @param {Int} size 页面大小
		 */
		dataChangePageSize: function(size) {
			this.queryDataList({
				"pageIndex": 1,
				"pageSize": size
			})
		},
		/**
		 * 提交数据中心新增记录
		 */
		submitEditorJsonAdd: function() {
			var THIS = this;
			var token = Util.getCookie("yunli_token");
			var collection = this.selectDataCenterPermit;
			var data = JSON.parse(this.editorJsonAdd.getValue())
			JCloud.dataInsert({
				"token": token,
				"collection": collection,
				"data": [data]
			}, function(res) {
				if (res.status == 0) {
					THIS.editorDefaultJson.time = Util.dateFormat("yyyy-MM-dd hh:mm:ss", new Date());
					THIS.editorJsonAdd.setValue(JSON.stringify(THIS.editorDefaultJson));
					THIS.$message({
						showClose: true,
						message: '新增记录成功！',
						type: 'success'
					});
				}
			})
		},

		/**
		 * 匹配数据ID删除数据记录
		 * @param {String} dataId 数据记录ID
		 */
		deleteDataById: function(dataId) {
			var THIS = this;
			var token = Util.getCookie("yunli_token");
			var collection = this.selectDataCenterPermit;
			JCloud.dataDelete({
				"token": token,
				"collection": collection,
				"id": [dataId]
			}, function(res) {
				if (res.status == 0) {
					THIS.queryDataList({
						"pageIndex": THIS.dataList.length == 1 ? --THIS.dataPageIndex : THIS.dataPageIndex,
						"pageSize": THIS.dataPageSize
					})
					THIS.$message({
						showClose: true,
						message: '删除记录成功！',
						type: 'success'
					});
				}
			})
		},

		/**
		 * 清空新增记录JSON编辑器
		 */
		emptyEditorJsonAdd: function() {
			this.editorDefaultJson.time = Util.dateFormat("yyyy-MM-dd hh:mm:ss", new Date());
			this.editorJsonAdd.setValue(JSON.stringify(this.editorDefaultJson));
		},
		/**
		 * 格式化新增记录JSON编辑器
		 */
		formatEditorJsonAdd: function() {
			this.editorJsonAdd.autoFormatRange({
				line: 0,
				ch: 0
			}, {
				line: this.editorJsonAdd.lineCount()
			}, );
		},
		/**
		 * 格式化编辑记录JSON编辑器
		 */
		formatEditorJsonEdit: function() {
			this.editorJsonEdit.autoFormatRange({
				line: 0,
				ch: 0
			}, {
				line: this.editorJsonEdit.lineCount()
			}, );
		},
		/**
		 * 编辑数据中心记录
		 * @param {Object} dataJson 数据对象
		 */
		editData: function(dataJson) {
			var THIS = this;
			this.editJsonDataId = dataJson.id;
			this.isEditJsonData = true;
			setTimeout(function() {
				THIS.initEditorJsonEdit(dataJson)
			}, 5);
		},

		/**
		 * 初始化数据中心记录编辑器
		 * @param {Object} dataJson 待数据对象
		 */
		initEditorJsonEdit: function(dataJson) {
			var THIS = this;
			if (this.editorJsonEdit == null) {
				this.editorJsonEdit = CodeMirror.fromTextArea(document.getElementById("EditorJsonEdit"), {
					lineNumbers: true,
					mode: "application/json",
					gutters: ["CodeMirror-lint-markers"],
					lint: true,
					styleActiveLine: true
				});
			}
			this.editorJsonEdit.setValue(JSON.stringify(dataJson));
			setTimeout(function() {
				THIS.formatEditorJsonEdit();
			}, 5)
		},

		/**
		 * 提交数据中心记录编辑
		 */
		submitEditorJsonEdit: function() {
			var THIS = this;
			var token = Util.getCookie("yunli_token");
			var collection = this.selectDataCenterPermit;
			var data = JSON.parse(this.editorJsonEdit.getValue())
			JCloud.dataUpdate({
				"token": token,
				"collection": collection,
				"data": [data]
			}, function(res) {
				if (res.status == 0) {
					THIS.$message({
						showClose: true,
						message: '更新记录成功！',
						type: 'success'
					});
				}
			})
		},

		/**
		 * 关闭更新记录编辑器
		 */
		closeEditorJsonEdit: function() {
			this.isEditJsonData = false;
			this.queryDataList({
				"pageIndex": this.dataPageIndex,
				"pageSize": this.dataPageSize,
			})
		},

		/**
		 * 删除数据中心记录
		 * @param {Object} dataJson 数据对象
		 */
		deleteData: function(dataJson) {
			var THIS = this;
			this.$confirm('确认删除？').then(function() {
				THIS.deleteDataById(dataJson.id)
			})
		},

		/**
		 * 文件记录翻页
		 * @param {Int} page 页码
		 */
		fileChangePageIndex: function(page) {
			this.queryFileList({
				"pageIndex": this.filePageIndex,
				"pageSize": this.filePageSize
			})
		},

		/**
		 * 改变文件记录页面大小
		 * @param {Int} size 页面大小
		 */
		fileChangePageSize: function(size) {
			this.queryFileList({
				"pageIndex": 1,
				"pageSize": size
			})
		},

		/**
		 * 查询文件系统文件集
		 * @param {String} condition 查询条件
		 */
		queryFileList: function(condition) {
			this.filePageIndex = condition.pageIndex;
			this.filePageSize = condition.pageSize;
			var THIS = this;
			if (this.account.permit.filePermit.length == 0) {
				this.$message({
					showClose: true,
					message: '没有文件系统权限！',
					type: 'warning'
				});
				return;
			}
			var collection = this.selectFileSystemPermit;
			this.loading = true;
			JCloud.fileQuery({
				collection: collection,
				condition: condition
			}, function(res) {
				THIS.fileList = res.data.file;
				THIS.fileSum = res.data.sum;
				setTimeout(function() {
					THIS.loading = false;
				}, 500)
			})
		},

		/**
		 * 删除文件
		 * @param {Object} fileJson 文件数据对象
		 */
		deleteFile: function(fileJson) {
			var THIS = this;
			this.$confirm('确认删除？').then(function() {
				THIS.deleteFileById(fileJson.id)
			})
		},

		/**
		 * 匹配ID删除文件
		 * @param {String} fileId 文件ID
		 */
		deleteFileById: function(fileId) {
			var THIS = this;
			var token = Util.getCookie("yunli_token");
			var collection = this.selectFileSystemPermit;
			JCloud.fileDelete({
				"token": token,
				"collection": collection,
				"id": [fileId]
			}, function(res) {
				if (res.status == 0) {
					THIS.queryFileList({
						"pageIndex": THIS.fileList.length == 1 ? --THIS.filePageIndex : THIS.filePageIndex,
						"pageSize": THIS.filePageSize
					})
					THIS.$message({
						showClose: true,
						message: '删除文件成功！',
						type: 'success'
					});
				}
			})
		},

		/**
		 * 提交文件上传到服务器
		 */
		submitFileUpload: function() {
			var THIS = this;
			this.fileUploadConf = {
				url: JCloud.getFileUploadApi(),
				data: {
					"token": Util.getCookie("yunli_token"),
					"collection": this.selectFileSystemPermit
				}
			}
			setTimeout(function() {
				THIS.$refs.fileUpload.submit();
			}, 5)
		},

		/**
		 * 文件上传成功回调
		 */
		fileUploadSuccess: function(response) {
			if (response.data.error == null) {
				if (response.status == 0) {
					this.$message({
						showClose: true,
						message: '文件上传成功！',
						type: 'success'
					});
					this.$refs.fileUpload.clearFiles()
				}
			} else {
				this.$message({
					showClose: true,
					message: response.data.error[0],
					type: 'error'
				});
				this.$refs.fileUpload.clearFiles()
			}
			this.fileUploadConf = {
				url: "",
				data: {
					"token": "",
					"collection": ""
				}
			}
		},

		/**
		 * 获取当前选中的用户中心权限值
		 */
		getSelectDataCenterPermit: function() {
			var permit = {};
			for (var index in this.dataCenterPermitList) {
				if (this.dataCenterPermitList[index].collection == this.selectDataCenterPermit) {
					permit = this.dataCenterPermitList[index];
					break;
				}
			}
			return permit
		},

		/**
		 * 切换当前选中的用户中心权限值
		 */
		changeDataCenterPermit: function(collection) {
			var THIS = this;
			this.selectDataCenterPermit = collection;
			setTimeout(function() {
				THIS.queryDataList({
					"pageIndex": 1,
					"pageSize": 10
				})
			}, 5)
		},

		/**
		 * 获取当前选中的文件系统权限值
		 */
		getSelectFilfSystemPermit: function() {
			var permit = {};
			for (var index in this.fileSystemPermitList) {
				if (this.fileSystemPermitList[index].collection == this.selectFileSystemPermit) {
					permit = this.fileSystemPermitList[index];
					break;
				}
			}
			return permit
		},

		/**
		 * 切换当前选中的文件系统权限值
		 */
		changeFileSystemPermit: function(collection) {
			var THIS = this;
			this.selectFileSystemPermit = collection;
			setTimeout(function() {
				THIS.queryFileList({
					"pageIndex": 1,
					"pageSize": 10
				})
			}, 5)
		},
	},

	mounted: function() {
		this.queryUserInfo();
	}

})
