

# Angular Admin UI
* src
    * component  all the control
    * filter     common filter
    * service    common service
    * template   custom control template
    * admin.js   entry file

## 配置项

```javascript
.constant('AdminCDN', 'http://localhost:63342/AngularAdminSrc/output/assets')
.config((AdminCDN, AjaxProvider, MessageProvider, UIEditorControlProvider, UIUploadControlProvider, UITableControlProvider, UITreeControlProvider) => {

    //
    // ajax 默认返回处理
    //
    AjaxProvider.setSuccessHandler((result) => result.type == 1 ? result.data : null);
    AjaxProvider.setFailHandler((result) => result.type != 1 ? result.data : null);

    //
    // 通知位置
    //
    MessageProvider.setPosition('bottom', 'right');

    //
    // 百度编辑器的库地址
    //
    UIEditorControlProvider.setUrl(`${AdminCDN}/ueditor/ueditor.config.js`, `${AdminCDN}/ueditor/ueditor.all.js`);

    //
    // 上传空间的配置
    //
    UIUploadControlProvider.setDomain('七牛域名');
    UIUploadControlProvider.setTokenUrl('七牛每次上传会调用这个URL, 返回算好的token, 然后才能上传');
    UIUploadControlProvider.setMaxSize('1mb');

    //
    // 表格配置项
    //
    UITableControlProvider.setRequestMethod('post');
    UITableControlProvider.setResultName('aaData', 'iTotalRecords');
    UITableControlProvider.setPageName('pageSize', 'pageNo');
    UITableControlProvider.setConfig({});

    //
    // 树配置项
    //
    UITreeControlProvider.setDataName('id', 'name', 'pid');
    UITreeControlProvider.setRequestMethod('post');
});
```

## 控制

* ```<ui-state-button class="btn-danger" ng-click="" target="">点击</ui-state-button>```
    * ngClick 是controller里面的方法, 可以返回pormise方法
    * target 如果设置, 点击会锁屏幕, css3表达式
* ```<ui-breadcrumb  datas="" url="" />```
    * datas, [{name: .., url: ..}] 或者 ['A', 'B', 'C']
    * url, 如果想远程加载设置这个, post请求

## 图表

## 容器

* ```<ui-container controller="" />```
    * controller, 可以angular.module('').controller或者function xxCtrl两种, 该组件主要是等待子组件全部完毕后才会调用controller

## 表单

* ```<ui-form-date mode="date" label="日期:" placeholder="什么鬼" help="醉了" model="formDate" change="dateChangeHandler()"></ui-form-date>```
    * mode, [date, datetime, time, month, year] 选其一
    * model, 双向绑定
    * change, scope里面的方法
* ```<ui-form-date-range mode="datetime" label="日期范围:" help="醉了3" from-model="formRangeFromDate" to-model="formRangeToDate" change="dateRangeChangeHandler()"></ui-form-date-range>```
    * mode, [date, datetime, time, month, year] 选其一
    * form-model, 开始时间的双向绑定
    * to-model, 结束时间的双向绑定
    * change, scope里面的方法
* ```<ui-form-input label="输入框" help="醉了4" model="item.formInput" change="inputChangeHandler()"></ui-form-input>```
* ```<ui-form-select label="下拉框" url="" date-key-name="" date-value-name="" help="醉了5" model="item.formSelect" change="selectChangeHandler()"><option value="1">1</option><option value="2">2</option><option value="3">3</option></ui-form-select>```
    * url, 远程数据地址
    * dataKeyName, 键的名称
    * dateValueName, 值的名称
    * render, scope里面的方法, 用于美化option
* ```<ui-form-spinner label="计数器:" model="item.formSpinner" help="醉了6" min="0" max="100" step="5" change="spinnerChangeHandler(val)"></ui-form-spinner>```
    * min, 最小值
    * max, 最大值
    * step, 步数
    * change 改变以后的回调
* ```<ui-form-switch label="开关:" model="item.formSwitch" help="醉了6" on-text="男" off-text="女" change="switchChangeHandler(val)"></ui-form-switch>```
    * on-text, 左边的文字, 默认是开
    * off-text, 右边的文字, 默认是关
    * on-value, 左边的文件, 默认是1
    * off-value, 右边的文字, 默认是0
* ```<ui-form-tag label="开关:" model="item.formTag" url="/test/remote/select" editable="true" change="tagChangeHandler(val, item, vals, items)"></ui-form-tag>```
    * url, 远程加载的数据地址
    * editable, 是否可以按回车自动新增一个, 默认是true
* ```<ui-form-region label="地域:" model="item.formRegion" help="醉了8" change="regionChangeHandler(mode, val, p, c, s)"></ui-form-region>```
    * mode, p = 只显示省, c = 只显示省和市, s = 只显示省和市和区, a = 全部显示, 默认是a
* ```<ui-form-editor label="百度编辑器:" model="item.formEdiotr" help="醉了9" change="editorChangeHandler(val)"></ui-form-editor>```
    * 尚无

## 查询

* ```<ui-search-date mode="date" label="日期:" placeholder="什么鬼" model="formDate" change="dateChangeHandler()"></ui-search-date>```
    * mode, [date, datetime, time, month, year] 选其一
    * model, 双向绑定
    * change, scope里面的方法
* ```<ui-search-date-range mode="datetime" label="日期范围:" from-model="formRangeFromDate" to-model="formRangeToDate" change="dateRangeChangeHandler()"></ui-search-date-range>```
    * mod, [date, datetime, time, month, year] 选其一
    * form-model, 开始时间的双向绑定
    * to-model, 结束时间的双向绑定
    * change, scope里面的方法
* ```<ui-search-input label="输入框" help="醉了4" model="item.formInput" change="inputChangeHandler()"></ui-search-input>```
* ```<ui-search-select label="下拉框" url="" date-key-name="" date-value-name="" help="醉了5" model="item.formSelect" change="selectChangeHandler()"><option value="1">1</option><option value="2">2</option><option value="3">3</option></ui-search-select>```
    * url, 远程数据地址
    * dataKeyName, 键的名称
    * dateValueName, 值的名称
    * render, scope里面的方法, 用于美化option


## 表格

```javascript
<ui-table url="/test/remote/select" nopage="false" manual="false" change="callback(isSelect, selectItem, selectValue, selectItems, selectValues)" data-success="callback(result)" data-fail="callback(result)">
    <ui-table-check-column name="id"></ui-table-check-column>
    <ui-table-date-column head="日期列" name="date" format="yyyy-MM-dd"></ui-table-date-column>
    <ui-table-image-column head="图片列" image-css="imageSS" name="image" placeholder="xxxxxx"></ui-table-image-column>
    <ui-table-column head="简单列" name="simple"></ui-table-column>
    <ui-table-column head="自定义列" name="advance">
        {{data.simple}}
    </ui-table-column>
    <ui-table-progress-column head="进度条列" name="progress"></ui-table-progress-column>
    <ui-table-state-column head="状态列" name="state" default="0">
        <span state="0">吃</span>
        <span state="1">喝</span>
        <span state="2">玩</span>
    </ui-table-state-column>
    <ui-table-operation-column head="操作列"></ui-table-operation-column>
</ui-table>
```

## 树

```javascript
<ui-tree url="/test/remote/select"
             on-data-success="dataSuccessHandler(result)"
             on-data-fail="dataFailHandler(result)"
             on-before-check="beforeCheckHandler(treeNode)"
             on-check="checkHandler(treeNode)"
             on-before-click="beforeClickHandler(treeNode)"
             on-click="clickHandler(treeNode)"></ui-tree>
```

## 弹出框

## component list
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/components.jpg)
    
## template list
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/template.jpg)

## service list
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/service.jpg)

## Form UI
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/form.png)
```javascript
<ui-form column="1">
    <ui-form-input label="normal" placeholder="abc" help="help" model="ccc" ></ui-form-input>
    <ui-form-date label="date" placeholder="abc" help="help" model="aaa"></ui-form-date>
    <ui-form-select label="select">
        <option value="a">aa</option>
        <option value="a">aa</option>
    </ui-form-select>
    <ui-form-switch label="switch" name="qqq" on-value="1" off-value="2" on-text="123" off-text="321"></ui-form-switch>
    <ui-form-region  label="region"></ui-form-region>
    <ui-form-user-select label="user"></ui-form-user-select>
    <ui-form-textarea label="&lt;span style='color:red'&gt;*&lt;/span&gt; textarea："></ui-form-textarea>
</ui-form>
```

## SearchForm
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/searchform.png)
```javascript
<ui-search-form>
    <ui-search-input class="input-medium" label="测试" name="test"></ui-search-input>
    <ui-search-select name="test2">
        <option value="aaa">创建人</option>
        <option value="bbbb">沟通人</option>
    </ui-search-select>
    <ui-search-input-select>
        <option value="aaa">联系方式</option>
        <option value="bbbb">客户姓名</option>
    </ui-search-input-select>
    <ui-search-multi-select tip="xxxxx">
        <option value="aaa">联系方式</option>
        <option value="bbbb">客户姓名</option>
        <option value="ccc">联系方式</option>
        <option value="ddd">客户姓名</option>
    </ui-search-multi-select>
    <ui-search-date class="input-medium" label="日期" name="test3"></ui-search-date>
    <ui-search-region mode="c" label="区域" name="asdasd22"></ui-search-region>
    <ui-search-user-select class="input-medium" label="用户"></ui-search-user-select>
    <ui-search-date-range label="注册时间"></ui-search-date-range>
</ui-search-form>
```

## Toolbar And Table
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/toolbar_table.png)
```javascript
<ui-table url="/test" edit-url="/test">
    <ui-table-check-column name="a"></ui-table-check-column>
    <ui-table-column head="checkbox" name="a" editable="region"></ui-table-column>
    <ui-table-progress-column head="progress" name="a"></ui-table-progress-column>
    <ui-table-image-column head="image" name="ww"></ui-table-image-column>
    <ui-table-date-column head="date" name="e" ></ui-table-date-column>
    <ui-table-state-column hred="state" name="f" default="0" >
        <span class='label label-sm label-default' state="0" style='background-color:red !important'>0</span>
        <span class='label label-sm label-default' state="1" style='background-color:green !important'>1</span>
    </ui-table-state-column>
    <ui-table-operation-column head="opertion">
        <a class="btn btn-sm default" href="javascript:;" ng-click="managePotential()"><iclass="fa fa-cogs"></i></a>
        <a class="btn btn-sm default" href="javascript:;" ng-click="assignPotential()"><i class="fa fa-hand-o-right"></i></a>
        <a class="btn btn-sm default" href="javascript:;" ng-click="editContact()"><i class="fa fa-comments-o"></i></a>
        <a class="btn btn-sm default" href="javascript:;" ng-click="assignClaim()"><i class=" fa fa-chain"></i></a>
        <a class="btn btn-sm default " href="javascript:;" ng-click="assignRelease()"><i class=" fa fa-chain-broken"></i></a>
    </ui-table-operation-column>
</ui-table>
```

## Tree
![Image text](https://raw.githubusercontent.com/binlaniua/AngularAdmin/master/demo/docs/tree.png)
```javascript
<ui-tree url="/region" expand="1" on-click="treeTwoClick"></ui-tree>
```