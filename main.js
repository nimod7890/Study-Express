var express = require('express');
var app = express()
var fs = require('fs');
var qs=require('querystring');
var template=require('./template.js');
var path=require('path');
//npm install express --save
//npm install body-parser
//npm install compression

app.use(express.static('public'));
app.use(body.Parser.urlencoded({extended:false}));
app.use(compression());
app.get('*',function(request,response,next){
  fs.readdir(`./practice`, function(error, filelist){    request.list=filelist;
    request.list=filelist;
    next();
  });
});

app.get('/',function(request,response){
  var title = 'WEB';
  var body='Main Page';
  var control= `<a href="/create">create</a>`;
  var html = template.html(title, template.List(request.list), 
      `<h2>${title}</h2><p>${body}</p>
      <img scr="/cute.jpg" style="width:300px; display:block; margin-top:10px;">`,control);
  
  response.send(html);
})

app.get('/page/:pageId',function(request,response,next){
  var filteredId=path.parse(resquest.params.pageId).base;
  fs.readFile(`practice/${filteredId}`, 'utf8', function(err, body) {
    if(err){
      next(err);
    }else{
      var title = resquest.params.pageId;
      var control = `<a href="/create">create</a>  
              <a href="/edit/${title}">edit</a>
              <form action="/delete" method="post">
                <input ty pe="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`;
      var html = template.html(title, template.List(request.list), 
          `<h2>${title}</h2><p>${body}</p>`,control);
      response.send(html);      
    }
  }); 
});

app.get('/create',function(request,response){
  var title= 'create';
  var html=template.html(title,template.List(request.list),`
    <form action="/create" method="post">
      <p><input type='text' name="title" placeholder="title"></p>
      <p><textarea name="description" placeholder="description"></textarea></p>
      <p><input type='submit'></p>
    </form>
  `,` `);
  response.send(html);
});

app.post('/create',function(request,response){
  var post=request.body;
  var post=qs.parse(body);
  var title=post.title;
  var description=post.description;
  fs.writeFile(`practice/${title}`,description,'utf8',function(err){
    response.redirect(`/?id=${title}`);
  });
});

app.get('/edit/:pageId',function(request,response){
  var filteredId=path.parse(resquest.params.pageId).base;
  fs.readFile(`practice/${filteredId}`, 'utf8', function(err, body) {
    var title = resquest.params.pageId;
    var html = template.html(title, template.List(request.list), 
      `<form action="/edit_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type='text' name="title" placeholder="title" value="${title}"></p>
        <p><textarea name="description" placeholder="description">${body}</textarea></p>
        <p><input type='submit'></p>
      </form>`,control);
    response.send(html);
  });  
});
app.post('/edit_process',function(request,response){
  var post=request.body;
  var id=post.id;
  var title=post.title;
  var description=post.description;
  fs.rename(`practice/${id}`,`practice/${title}`,function(error){
    fs.writeFile(`practice/${title}`,description,'utf8',function(err){
      response.redirect(`/?id=${title}`) 
    });
  });      
});

app.post('/delete',function(request,response){
  var post=request.body;
  var id=post.id;
  var filteredId=path.parse(id).base;
  fs.unlink(`practice/${filteredId}`,function(error){
    response.redirect('/')
  });
});

app.use(function(request,response,next){
  response.status(404).send('cannot find page:(');
})

app.use(function(err,request,response,next){
  console.error(err.stack)
  response.status(500).send('Something broke');
})

app.listen(3000,function(){
  console.log('Listening on port 3000')
});

