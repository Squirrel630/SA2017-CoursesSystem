     $(function() {  
        var stu_number = $("#stu-number"),
        name = $( "#name" ),  
        department = $( "#department" ),  
        total = $( "#total" ), 
        usual_grade = $( "#usual"),
        design_grade = $("#design"),
        exam_grade = $( "#exam"), 
        rowindex = $( "#rowindex" ),
        student_list = [],  
        allFields = $( [] ).add( stu_number ).add( name ).add( department ).add( total ).add( rowindex );

        var pageInfo = new Object();
        pageInfo.pageNum = 1;
        pageInfo.pageSize = 10;  

        function getStudents(){
            $.ajax({
                url: 'http://localhost:9000/students',
                type: 'GET',
                dataType:'json',               
                }).done(function(res) {
                    removeData();
                    student_list = res.list;
                    createData(student_list);
                }).fail(function(res) {
                    console.log(res);
                });
        }

        getStudents();

        $( "#dialog-form" ).dialog({  
            autoOpen: false,  
            height: 300,  
            width: 480,  
            modal: true,  
            buttons: {  
                "确认": function() { 
                    var student = new Object();
                    student.id = stu_number.val();
                    student.name = name.val();
                    student.department = department.val();
                    student.grade = total.val();
                    student.usual_grade = "0";
                    student.design_grade = "0";
                    student.exam_grade = "0";
 
                    if (rowindex.val()==""){//新增 
                          $.ajax({
                            url: 'http://localhost:9000/students/add',
                            type: 'POST',
                            cache: false,
                            dataType:'json',
                            data: student
                        }).done(function(res) {
                            removeData();
                            student_list = res.list;
                            createData(student_list);
                        }).fail(function(res) {
                            console.log(res);
                        });

                        bindEvent();  
                    }  
                    else{//修改  
                        var idx = rowindex.val();  
                        var tr = $("#users>tbody>tr").eq(idx);  
                        //$("#debug").text(tr.html());  
                        tr.children().eq(0).text(stu_number.val());  
                        tr.children().eq(1).text(name.val());  
                        tr.children().eq(2).text(department.val()); 
                        tr.children().eq(3).text(total.val()); 

                        $.ajax({
                            url: 'http://localhost:9000/students/update',
                            type: 'POST',
                            cache: false,
                            dataType:'json',
                            data: student,
                        }).done(function(res) {
                            removeData();
                            student_list = res.list;
                            createData(student_list);
                        }).fail(function(res) {
                            console.log(res);
                        });   
                        bindEvent();  
                        $( this ).dialog( "close" );    
                    }  
                    $( this ).dialog( "close" );  
                },  
                "取消": function() {  
                    $( this ).dialog( "close" );  
                }  
            },  
            close: function() {  
                //allFields.val( "" ).removeClass( "ui-state-error" );  
                ;  
            }  
        });

        $( "#dialog-import").dialog({
            autoOpen: false,
            height: 200,
            width: 320,
            modal: true,
            buttons: {
                "导入": function(){
                    $.ajax({
                        url: 'http://localhost:9000/batchimport',
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#uploadForm')[0]),
                        processData: false,
                        contentType: false
                    }).done(function(res) {
                        removeData();
                        student_list = res.list;
                        createData(student_list);
                    }).fail(function(res) {

                    });
                    $(this).dialog("close");
                },
                "取消": function(){
                    $(this).dialog("close");
                }
            },
            close: function(){
                ;
            }
        });

        $( "#dialog-grade").dialog({
            autoOpen: false,
            height: 300,
            width: 480,
            modal: true,
            buttons: {
                "确认": function(){
                    var student = new Object();
                    student.id = stu_number.val();
                    student.name = name.val();
                    student.department = department.val();
                    student.grade = total.val();
                    student.usual_grade = usual_grade.val();
                    student.design_grade = design_grade.val();
                    student.exam_grade = exam_grade.val();

                    $.ajax({
                        url: 'http://localhost:9000/students/update',
                        type: 'POST',
                        cache: false,
                        dataType:'json',
                        data: student
                    }).done(function(res) {
                        removeData();
                        student_list = res.list;
                        createData(student_list);
                    }).fail(function(res) {
                        console.log(res);
                    });   
                    bindEvent();  
                    $(this).dialog("close");
                },
                "取消": function(){
                    $(this).dialog("close");
                }
            },
            close: function(){
                ;
            }
        });

        function bindEvent(){  
            //绑定Edit按钮的单击事件  
            $(".EditButton").click(function(){  
                var b = $(this);  
                var tr = b.parents("tr");  
                var tds = tr.children();  
                //设置初始值  
                stu_number.val(tds.eq(0).text());
                name.val(tds.eq(1).text());  
                department.val(tds.eq(2).text());  
                total.val(tds.eq(3).text());  

                var trs = b.parents("tbody").children();  
                //设置行号，以行号为标识，进行修改。  
                rowindex.val(trs.index(tr));  

                //打开对话框  
                $( "#dialog-form" ).dialog( "open" );  

                bindEvent();
            });  

            //绑定Delete按钮的单击事件  
            $(".DeleteButton").click(function(){ 
                var b = $(this);  
                var tr = b.parents("tr");  
                var tds = tr.children();  
                //设置初始值  
                stu_number.val(tds.eq(0).text());
                var temp = new Object();
                temp.id = stu_number.val();

                $.ajax({
                    url: 'http://localhost:9000/students/delete',
                    type: 'POST',
                    data: temp,
                    cache: false,
                    dataType:'json'
                }).done(function(res) {
                    removeData();
                    student_list = res.list;
                    createData(student_list);
                }).fail(function(res) {
                    console.log(res);
                });    
                var tr = $(this).parents("tr");  
                tr.remove();  
                bindEvent();
            }); 

            //绑定Grade按钮的单击事件
            $(".GradeButton").click(function(){
                var b = $(this);  
                var tr = b.parents("tr");  
                var tds = tr.children();  
                //设置初始值  
                stu_number.val(tds.eq(0).text());
                name.val(tds.eq(1).text());  
                department.val(tds.eq(2).text());  
                total.val(tds.eq(3).text());  

                $("#dialog-grade").dialog("open");
                bindEvent();
            });
        };  

        $(".lastPage")
        .button()
        .click(function(){
                if(pageInfo.pageNum>1)
                    pageInfo.pageNum--;
                $.ajax({
                    url: 'http://localhost:9000/students/pageInfo',
                    type: 'POST',
                    data: pageInfo,
                    cache: false,
                    dataType:'json'
                }).done(function(res) {
                    removeData();
                    student_list = res.list;
                    createData(student_list);
                }).fail(function(res) {
                    console.log(res);
                });    
        });

        $(".nextPage")
        .button()
        .click(function(){
            pageInfo.pageNum++;
            $.ajax({
                url: 'http://localhost:9000/students/pageInfo',
                type: 'POST',
                data: pageInfo,
                cache: false,
                dataType:'json'
            }).done(function(res) {
                removeData();
                student_list = res.list;
                createData(student_list);
            }).fail(function(res) {
                console.log(res);
            });    
        });

        bindEvent();  

        $( "#create-user" )  
        .button()  
        .click(function() {  
                //清空表单域  
                allFields.each(function(idx){  
                    this.value="";  
                });  
                $( "#dialog-form" ).dialog( "open" );  
            });  

        $("#import")
        .button()
        .click(function(){
                //导入本地文件  
                $( "#dialog-import" ).dialog( "open" );  
        })

        function removeData(){
            var body = document.getElementById("students");
            while(body.hasChildNodes()) {//当div下还存在子节点时 循环继续
                body.removeChild(body.firstChild);
            }
        }

        function createData(res){
            for (var i=0;i<student_list.length;i++){
                $( "#users tbody" ).append( "<tr>" +  
                            "<td>" + res[i].id + "</td>" +   
                            "<td>" + res[i].studentname + "</td>" +   
                            "<td>" + res[i].department + "</td>" +  
                            "<td>" + res[i].grade + "</td>" + 
                            '<td><button class="EditButton">修改</button><button class="DeleteButton">删除</button><button class="GradeButton">成绩</button></td>'+  
                            "</tr>" );
            }
            bindEvent();
        }

    });



