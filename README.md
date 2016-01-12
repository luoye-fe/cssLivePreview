#css 实时解析


> 具体效果打开 index.html 观看

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

方法：

	1、需要实时预览的css写到 src/css/01.css 中
	2、cd 到 lib 目录，运行 node node jsonStyle.js build ../src/css/01.css ../src/js/formatArr.js，把标准的css解析成json
	3、cd 到跟目录，运行 webpack
	4、打开 index.html 预览效果 

原理：通过一系列的正则把css格式化成json格式的数据，然后根据json来向页面输出字符，同时修改style