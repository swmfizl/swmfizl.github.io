const MenuBar = [{
		index: "1",
		text: "基本信息",
		icon: "el-icon-s-home",
		sub: [{
			index: "1-1",
			text: "账户信息"
		}]
	},
	{
		index: "2",
		text: "数据中心",
		icon: "el-icon-coin",
		sub: [{
				index: "2-1",
				text: "新增记录"
			},
			{
				index: "2-2",
				text: "管理记录"
			}
		]
	},
	{
		index: "3",
		text: "文件系统",
		icon: "el-icon-folder-opened",
		sub: [{
				index: "3-1",
				text: "上传文件"
			},
			{
				index: "3-2",
				text: "管理文件"
			}
		]
	},
	{
		index: "4",
		text: "API文档",
		icon: "el-icon-s-opportunity",
		sub: [
			{
				index: "4-1",
				text: "数据中心API"
			},
			{
				index: "4-2",
				text: "文件系统API"
			}
		]
	},
	{
		index: "0",
		text: "个人中心",
		icon: "el-icon-s-custom",
		sub: [{
			index: "0-0",
			text: "退出登陆"
		}]
	}
]

const AccountInfoMap = {
	unit: {
		name: "公司名称",
		regtime: "注册时间",
		phone: "联系电话",
		email: "企业邮箱",
		address: "公司地址"
	},

	user: {
		name: "用户名称",
		account: "登陆账户",
		password: "登陆密码",
		regtime: "注册时间",
		phone: "联系电话",
		email: "用户邮箱",
		address: "联系地址"
	}
}
