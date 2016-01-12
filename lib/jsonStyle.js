var fs = require('fs');
var program = require('commander');
var pkg = require('../package.json');

var regxObj = {
    commentRegex: /^\/\*[\s\S]+?\*\//, // 以 /* 开头的注释
    noComment: /(^\/)/, // 非注释
    ruleRegex: /[\s\S]+?\}/, // 返回style规则
    selectorRegex: /[\s\S]+\{/, // 返回选择器
    styleRegex: /\{[\s\S]+\}/, // 返回style 
    commentRegx2: /\/\*[\s\S]+?\*\//, // 普通的注释
    frontAndAfterSpaceRegx: /(^\s+)|(\s+$)/g, // 前后空格
    optinsInComment: /\{\{[\s\S]+?\}\}/ // 注释中的参数
}

var defaultOptions = {
    'speed': '2',
    'delay': '0',
    'effect': 'none', // 换行时的特效
    'bgMusic': 'none', // 背景音乐
    'tyepEffect': 'none', // 单个字符音效
    'typeMusic': 'none' // 单个字符特效
}

var getOptions = function(type, str) {
    var options = {};
    if (type === 'style') {
        if (str.match(regxObj['commentRegx2']) === null) {
            return defaultOptions;
        } else {
            var _str = str.match(regxObj['commentRegx2'])[0].replace(/(\/\*)|(\*\/)/ig, '').replace(/\s/ig, '');
        }
        var _current = getSplitArr(_str, ';');
        for (var i = 0; i < _current.length; i++) {
            var _options = getSplitArr(_current[i], ':');
            options[_options[0]] = _options[1];
        }
        // 补全默认参数
        for (item in defaultOptions) {
            if (options[item] === undefined) {
                options[item] = defaultOptions[item];
            }
        }
        return options;
    }
    if (type === 'comment') {
        if (str.match(regxObj['optinsInComment']) === null) {
            return defaultOptions;
        } else {
            var _str = str.match(regxObj['optinsInComment'])[0].replace(/(\{\{)|(\}\})/ig, '').replace(/\s/ig, '');
        }
        var _current = getSplitArr(_str, ';');
        for (var i = 0; i < _current.length; i++) {
            var _options = getSplitArr(_current[i], ':');
            options[_options[0]] = _options[1];
        }
        // 补全默认参数
        for (item in defaultOptions) {
            if (options[item] === undefined) {
                options[item] = defaultOptions[item];
            }
        }
        return options;
    }
}

// speed:2;delay:100; -> ['speed:2','delay:100']
// speed:2; -> ['speed','2']
var getSplitArr = function(str, tab) {
    var tab = tab === undefined ? '' : tab;
    var _current = str.split(tab);
    var result = [];
    for (var i = 0; i < _current.length; i++) {
        if (_current[i] !== '') {
            result.push(_current[i]);
        }
    }
    return result;
}

var formatStyle = [];
var formatStyleString = function(string) {
    if (regxObj['commentRegex'].test(string)) {
        var _current = {};

        // 获取注释中的参数设置
        _current['options'] = getOptions('comment', string);
        // 去掉注释中的参数字符串
        string = string.replace(regxObj['optinsInComment'], '');

        _current['comment'] = string.match(regxObj['commentRegex'])[0];
        string = (string.slice(string.match(regxObj['commentRegex']).index + string.match(regxObj['commentRegex'])[0].length)).replace(/(^\n+)/g, '');

        formatStyle.push(_current);
        return formatStyleString(string);
    }
    if (!regxObj['noComment'].test(string)) {
        var _current = {};
        if (string.length === 0) {
            return formatStyle;
        }
        var rule = string.match(regxObj['ruleRegex'])[0].replace(/\n/ig, '');
        _current['selector'] = rule.match(regxObj['selectorRegex'])[0].replace(/\{/, '');

        var styleString = rule;

        // 获取style中的参数设置
        _current['options'] = getOptions('style', styleString);
        // 去掉style中的参数字符串
        styleString = styleString.replace(regxObj['commentRegx2'], '')

        _current['style'] = [];
        styleString = styleString.match(regxObj['styleRegex'])[0].replace(/\{/, '').replace(/\}/, '');

        for (var i = 0; i < styleString.split(';').length - 1; i++) {
            var _styleCurrent = {};
            _styleCurrent['key'] = (styleString.split(';')[i].split(':')[0]).replace(regxObj['frontAndAfterSpaceRegx'], '');
            _styleCurrent['value'] = (styleString.split(';')[i].split(':')[1]).replace(regxObj['frontAndAfterSpaceRegx'], '');
            _current['style'].push(_styleCurrent);
        }
        formatStyle.push(_current);
        string = (string.slice(string.match(regxObj['ruleRegex']).index + string.match(regxObj['ruleRegex'])[0].length)).replace(/(^\n+)/g, '');;
        return formatStyleString(string);
    }
    return formatStyle;
}


program.version(pkg.version);
program
    .command('build <path> [target]')
    .description('build file,target must be a filename')
    .action(function(path, target) {
        fs.readFile(path, 'utf-8', function(err, data) {
            fs.writeFileSync(target, 'module.exports =  ' + JSON.stringify(formatStyleString(data)), 'utf-8');
        });
    })
program.parse(process.argv);

// this project
// node node jsonStyle.js build ../src/css/01.css ../src/js/formatArr.js
