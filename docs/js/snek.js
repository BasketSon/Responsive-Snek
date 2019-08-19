window.addEventListener("load",()=>{resizeCanvas(),document.addEventListener("keydown",changeDir),loop()}),window.addEventListener("resize",resizeCanvas);let frameID,canvas=document.getElementById("can"),canvasWrapper=document.querySelector(".canv-wrap"),ctx=canvas.getContext("2d"),gs=fkp=!1,speed=baseSpeed=3,color=randomColor(),xv=yv=0,px=canvas.width/2,py=canvas.height/2,pw=ph=20,aw=ah=appleSize(),apples=new Set,trail=[],tail=30,tailSafeZone=20,cooldown=!1,score=0,img=new Image;function resizeCanvas(){canvas.width=canvasWrapper.clientWidth,canvas.height=canvasWrapper.clientHeight,aw=ah=appleSize(),drawApples()}function appleSize(){return canvas.height/10>30?canvas.height/10:30}function loop(){ctx.fillStyle="black",ctx.fillRect(0,0,canvas.width,canvas.height),px+=xv,py+=yv,px>canvas.width&&(px=0),px+pw<0&&(px=canvas.width),py>canvas.height&&(py=0),py+ph<0&&(py=canvas.height);let e={x:px,y:py,color:ctx.fillStyle};trail.push(e),trail.length>tail&&(trail=trail.slice(-tail));for(let a=0;a<trail.length;a++){let t=pw/2,n=trail[a].x+pw/2,i=trail[a].y+pw/2;ctx.fillStyle=color,a<40&&trail[a]!==e&&(t-=(40-a)/6),a%4||trail[a]===e||(ctx.fillStyle="#"+lightenDarkenColor(color,-20)),ctx.beginPath(),ctx.arc(n,i,t,0,2*Math.PI),ctx.fill()}if(trail.length>=tail&&gs)for(let e=trail.length-tailSafeZone;e>=0;e--)if(headCollision(trail[e],pw)){tail=tailSafeZone,speed=baseSpeed,color=randomColor();for(let e of trail)if(e.color="red",trail.indexOf(e)>=trail.length-tail)break}drawApples();for(let e of apples)headCollision(e,aw)&&(apples.delete(e),tail+=~~(aw-25),speed+=~~(aw/700));frameID=requestAnimationFrame(loop)}function headCollision(e,a){if(px<e.x+a&&px+pw>e.x&&py<e.y+a&&py+ph>e.y)return!0}function lightenDarkenColor(e,a){e.startsWith("#")&&(e=e.slice(1));let t=parseInt(e,16);return((255&t)+a|(t>>8&255)+a<<8|(t>>16)+a<<16).toString(16)}function Apple(){function e(){let a=~~(Math.random()*canvas.width);return(a<aw||a>canvas.width-aw)&&(a=e()),a}function a(){let e=~~(Math.random()*canvas.height);return(e<ah||e>canvas.height-ah)&&(e=a()),e}let t=e(),n=a();for(let i of trail)t<i.x+aw&&t+aw>i.x&&n<i.y+ah&&n+ah>i.y&&(t=e(),n=a());this.x=t,this.y=n,this.color="red"}function spawnApples(){if((new Apple).spawn(),apples.size<9&&~~(100*Math.random())>50){(new Apple).spawn()}apples.size<10&&setTimeout(spawnApples,3e3)}function drawApples(){for(let e of apples)ctx.drawImage(img,e.x,e.y,aw,ah)}function randomColor(){return`#${(100+~~(155*Math.random())).toString(16)}${(100+~~(155*Math.random())).toString(16)}${(100+~~(155*Math.random())).toString(16)}`}function changeDir(e){if(fkp||(setTimeout(()=>gs=!0,1e3),fkp=!0,spawnApples()),cooldown)return!1;switch(e.which){case 37:case 65:xv=xv>0?xv:-speed,yv=0;break;case 38:case 87:xv=0,yv=yv>0?yv:-speed;break;case 39:case 68:xv=xv<0?xv:speed,yv=0;break;case 40:case 83:xv=0,yv=yv<0?yv:speed}cooldown=!0,setTimeout(()=>cooldown=!1,50)}img.src="../img/apple.png",Apple.prototype.spawn=function(){apples.add(this)};