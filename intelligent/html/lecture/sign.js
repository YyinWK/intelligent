(function() {

    _g.setNowPage('lecture/sign');
    $('#formContent').html(_g.getTemplate('lecture/sign-V'));

    // if() {//判断讲座签到是否已结束，则无需再请求接口
    //     $('#item').html('<div style="display: inline-block; height: 100%; width: 0; vertical-align: middle;"></div><div style="font-size: 20px; vertical-align: middle; display: inline-block;">讲座签到已结束</div>');
    //     return
    // }

    var id = _g.pm.param.id;
    var isProvedSign = _g.pm.param.isProvedSign;
    var start = _g.pm.param.start;
    var end = _g.pm.param.end;
    var one = _g.pm.param.one;
    var status = start ? 'S' : end ? 'E' : 'A';
    console.log(status)


    if(set) {
        clearTimeout(set);
    }
    $('#item').html('<div class="ui-loading__bd"><img src="/images/loading_more.gif" alt=""></div>');

    function getQrCode(getTime) {
        var supports = (new XMLHttpRequest()).withCredentials !== undefined;
        if (supports) {
            console.log(55555)
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://120.77.204.252:80/lecture/generateQRCode.do", true);
            xmlhttp.setRequestHeader('Content-Type', 'application/json');
            xmlhttp.responseType = "blob";
            // if(getTime) {
            //     xmlhttp.onreadystatechange = function() {
            //         if(xmlhttp.readyState != 4) {
            //             $('#item').html('<div class="ui-loading__bd"><img src="/images/loading_more.gif" alt=""></div>');
            //         }
            //     }
            // }
            xmlhttp.onload = function() {
                console.log(this);
                if (this.status == 200) {
                    var blob = this.response;  
                    var img = document.createElement('img');  
                    img.onload = function (e) {  
                        window.URL.revokeObjectURL(img.src);  
                    };  
                    img.src = window.URL.createObjectURL(blob);  
                    $('#item').html(img);
                    $('#item img').addClass('img-full');
                }
            }
            xmlhttp.send(JSON.stringify({data: {
                QRCode: 'Y',//是否获取签到二维码
                status: 'S',//开始签到or结束签到
                lectureId: id //讲座id
            },
            token: sessionStorage.getItem('token')}));
        }
    }

    getQrCode();
    
    var set = setTimeout(function () {
        getQrCode();
        set = setTimeout(arguments.callee, 10000);
    }, 10000);

    $('#stop').click(function() {
        clearTimeout(set);
        $('#item').html('<div style="display: inline-block; height: 100%; width: 0; vertical-align: middle;"></div><div style="font-size: 20px; vertical-align: middle; display: inline-block;">讲座签到已结束</div>');
    })

})();