#css 实时解析


> 具体效果打开 demo.html 观看

style样式的参数形式
	
	#work_con {
	    /* speed:5;delay:100; */
	    position: fixed;
	    right: 10px;
	    top: 10px;
	}


注释的参数形式

	/* {{speed:3;delay:2000;}}
	 * let`s begin!!
	 */


暂时只支持延迟和速度

方法：运行脚本 `jsonStyle.js` （需更改脚本最后几行的css文件源和目标源）

原理：通过一系列的正则把css格式化成json格式的数据，然后根据json来向页面输出字符，这个过程中同时修改style