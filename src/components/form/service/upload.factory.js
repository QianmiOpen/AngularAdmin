//-----------------------------------------------------------------------------------------------
//
//
//  针对input的封装
//
//
//-----------------------------------------------------------------------------------------------
(function () {

    angular.module('admin.component')
        .provider('UIUploadControl', () => {
            let domain, tokenUrl, maxSize,
                result = {
                    setDomain(_domain) {
                        domain = _domain
                    },

                    setTokenUrl(_tokenUrl) {
                        tokenUrl = _tokenUrl;
                    },

                    setMaxSize(_maxSize) {
                        maxSize = _maxSize;
                    },

                    $get() {
                        class UIUploadControl extends UIFormItemControl {

                            constructor(s, e, a) {
                                this.className = 'Upload';
                                super(s, e, a);
                            }

                            init() {
                                super.init();
                                this.$updateButton = this.element.find('button:eq(0)');
                                this.$removeButton = this.element.find('button:eq(1)');
                                this.$container = this.element.find('.ui-form-upload');
                                this.uploadButtonId = 'uiFormUploadButton' + new Date().getTime();
                                this.uploadContrainerId = 'uiFormUploadContainer' + new Date().getTime();
                                this.$updateButton.attr('id', this.uploadButtonId);
                                this.$container.attr('id', this.$container);
                            }

                            render() {
                                super.render();
                                Qiniu.uploader({
                                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                                    browse_button: this.uploadButtonId,       //上传选择的点选按钮，**必需**
                                    uptoken_url: tokenUrl,
                                    domain: domain,
                                    unique_names: true,
                                    container: this.uploadContrainerId,           //上传区域DOM ID，默认是browser_button的父元素，
                                    max_file_size: maxSize,           //最大文件体积限制
                                    flash_swf_url: '/assets/js/plupload/js/Moxie.swf',  //引入flash,相对路径
                                    max_retries: 3,                   //上传失败最大重试次数
                                    dragdrop: true,                   //开启可拖曳上传
                                    drop_element: this.uploadContrainerId,        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                                    chunk_size: '1mb',                //分块上传时，每片的体积
                                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                                    init: {
                                        'FilesAdded': function (up, files) {
                                            plupload.each(files, function (file) {
                                                // 文件添加进队列后,处理相关的事情
                                            });
                                        },
                                        'BeforeUpload': function (up, file) {
                                            var a = 1;
                                            // 每个文件上传前,处理相关的事情
                                        },
                                        'UploadProgress': function (up, file) {
                                            var a = 1;
                                            // 每个文件上传时,处理相关的事情
                                        },
                                        'FileUploaded': function (up, file, info) {
                                            info = JSON.parse(info);
                                            info.name = file.name;
                                            info.url = domain + '/' + info.key;
                                            cb && cb(info);
                                            // 每个文件上传成功后,处理相关的事情
                                            // 其中 info 是文件上传成功后，服务端返回的json，形式如
                                            // {
                                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                                            //    "key": "gogopher.jpg"
                                            //  }
                                            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                                            // var domain = up.getOption('domain');
                                            // var res = parseJSON(info);
                                            // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
                                        },
                                        'Error': function (up, err, errTip) {
                                            var a = 1;
                                            //上传出错时,处理相关的事情
                                        },
                                        'UploadComplete': function () {
                                            var a = 1;
                                            //队列文件处理完毕后,处理相关的事情
                                        },
                                        'Key': function (up, file) {
                                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                            // 该配置必须要在 unique_names: false , save_key: false 时才生效
                                            var key = "";
                                            // do something with key here
                                            return key
                                        }
                                    }
                                });
                            }
                        }
                        return UIUploadControl;
                    }
                };
            return result;
        });
})();