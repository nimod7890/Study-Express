
module.exports={
    html:function(title,list,body,control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>`
    },
    List:function(fileList){
      var list ='<ul>';
      var i=0;
      while(i<fileList.length){
        list+=`<li><a href="/page/${fileList[i]}">${fileList[i]}</a></li>`
        i+=1;
      }
      list+='</ul>';
      return list;
    }
  }

  