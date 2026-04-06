/* ════════ PASTUKER — Bosque Sagrado · Top-down v3 ════════════ */
const MAP_W=5600,MAP_H=4200,SPD=200,PROX_PLANTA=80,PROX_TAITA=120,PLANTAS_META=5;
const TAITA_X=MAP_W/2,TAITA_Y=MAP_H/2;
const MM_W=160,MM_H=120;
const mmCanvas=document.getElementById('minimap');
const mmCtx=mmCanvas.getContext('2d');
let PLANTAS_DATA=[];
let recolectadas=[],cercana=null,taitaCerca=false;
let panelOpen=false,quizOn=false;
let qIdx=0,qPts=0,qPregs=[],qSeg=15,qInt=null;
let playerWorldX=300,playerWorldY=MAP_H-300;
let taitaParpadeo=false;
let _mmTick=0;

/* ── Volumen global (0.0 - 1.0) controlado desde el pause ── */
let _volumen = 0.5;

function dibujarMinimap(px,py,plantaObjs){
    const scaleX=MM_W/MAP_W,scaleY=MM_H/MAP_H;
    _mmTick++;
    mmCtx.clearRect(0,0,MM_W,MM_H);
    mmCtx.fillStyle='#1a4a2e'; mmCtx.fillRect(0,0,MM_W,MM_H);
    mmCtx.strokeStyle='rgba(212,175,55,.3)'; mmCtx.lineWidth=1; mmCtx.strokeRect(0,0,MM_W,MM_H);
    plantaObjs.forEach(o=>{
        const mx=o.data.mx*scaleX,my=o.data.my*scaleY,rec=o.spr.getData('rec');
        mmCtx.beginPath(); mmCtx.arc(mx,my,rec?3:4,0,Math.PI*2); mmCtx.fillStyle=rec?'#ef9a9a':'#81c784'; mmCtx.fill();
        if(!rec){mmCtx.beginPath();mmCtx.arc(mx,my,6,0,Math.PI*2);mmCtx.strokeStyle='rgba(129,199,132,.4)';mmCtx.lineWidth=1;mmCtx.stroke();}
    });
    const tx=TAITA_X*scaleX,ty=TAITA_Y*scaleY,par=taitaParpadeo&&(_mmTick%30<15);
    mmCtx.beginPath();mmCtx.arc(tx,ty,6,0,Math.PI*2);mmCtx.fillStyle=par?'#ffffff':'#d4af37';mmCtx.fill();
    mmCtx.beginPath();mmCtx.arc(tx,ty,par?11:8,0,Math.PI*2);mmCtx.strokeStyle=par?'rgba(255,255,255,.8)':'rgba(212,175,55,.5)';mmCtx.lineWidth=par?2:1.5;mmCtx.stroke();
    const jx=px*scaleX,jy=py*scaleY;
    mmCtx.beginPath();mmCtx.arc(jx,jy,4,0,Math.PI*2);mmCtx.fillStyle='#4fc3f7';mmCtx.fill();
    mmCtx.beginPath();mmCtx.arc(jx,jy,7,0,Math.PI*2);mmCtx.strokeStyle='rgba(79,195,247,.45)';mmCtx.lineWidth=1.5;mmCtx.stroke();
}

class PreloadScene extends Phaser.Scene{
    constructor(){super('Pre')}
    preload(){
        const W=this.scale.width,H=this.scale.height;
        this.add.rectangle(W/2,H/2,W,H,0x0d2a18);
        this._bar=this.add.rectangle(W/2-120,H/2+40,0,10,0xd4af37).setOrigin(0,.5);
        this.add.rectangle(W/2,H/2+40,240,10,0x1a4a2e).setStrokeStyle(1,0xd4af37,.3);
        this.add.text(W/2,H/2+15,'Preparando el Bosque Sagrado...',{fontFamily:"'Press Start 2P'",fontSize:'9px',color:'#f0d060'}).setOrigin(.5);
        this.load.on('progress',v=>{this._bar.width=240*v});

        // ── Imágenes ──
        this.load.image('tree','../images/landscale/tree.png');
        this.load.image('tree2','../images/landscale/tree_2.png');
        this.load.image('tree3','../images/landscale/tree_3.png');
        this.load.image('bush','../images/landscale/bush.png');
        this.load.image('bush2','../images/landscale/bush_2.png');
        this.load.image('okwute','../images/landscale/okwute.png');
        for(let i=1;i<=5;i++) this.load.image('plant_'+i,'../images/game/icons_game/plant_'+i+'.png');
        this.load.image('taita_f1','../images/taita/taita_frame1.png');
        this.load.image('taita_f2','../images/taita/taita_frame2.png');
        this.load.image('bird','../images/landscale/birds.png');
        ['default','left1','left2','left3','right1','right2','right3','down1','down2','down3','arrive1','arrive2','arrive3']
        .forEach(f=>this.load.image('walk_'+f,'../images/game/walk-men/walk-'+f+'.png'));
        ['default','left1','left2','left3','right1','right2','down1','down2','down3','arrive1','arrive2','arrive3']
        .forEach(f=>this.load.image('walk2_'+f,'../images/game/walk-woman/walk2-'+f+'.png'));
        this.load.image('taita-cam1','../images/taita/taita-caminando1.png');
        this.load.image('taita-cam2','../images/taita/taita-caminando2.png');
        this.load.image('walk-right1','../images/game/walk-men/walk-right1.png');
        this.load.image('walk-right2','../images/game/walk-men/walk-right2.png');
        this.load.image('walk-right3','../images/game/walk-men/walk-right3.png');
        this.load.image('walk2-right1','../images/game/walk-woman/walk2-right1.png');
        this.load.image('walk2-right2','../images/game/walk-woman/walk2-right2.png');
        for(let i=1;i<=15;i++){const k='portal'+String(i).padStart(2,'0');this.load.image(k,'../images/game/portal/'+k+'.png');}
        PLANTAS_CATALOGO.forEach(p=>this.load.image('planta_'+p.id,p.img));

        // ── Audio ──
        this.load.audio('forest_loop',  '../audio/music/forest_loop.mp3');
        this.load.audio('sfx_planta',   '../audio/sfx/recoger_planta.wav');
        this.load.audio('sfx_correcto', '../audio/sfx/correct_answer.wav');
        this.load.audio('sfx_incorrecto','../audio/sfx/wrong_answer.ogg');
        this.load.audio('sfx_portal',   '../audio/sfx/portal.ogg');
        this.load.audio('sfx_nivel',    '../audio/sfx/level_complete.wav');
    }
    create(){this.scene.start('World')}
}

function getPersonaje(){
    const g=localStorage.getItem('usuario_genero')||'hombre';
    const m=localStorage.getItem('mundo_actual')||'1';
    if(g==='mujer')return 'f';
    if(g==='otro'||g==='no_decir')return m==='2'?'f':'m';
    return 'm';
}

class WorldScene extends Phaser.Scene{
    constructor(){super('World')}
    create(){
        this.physics.world.setBounds(0,0,MAP_W,MAP_H);
        this.cameras.main.setBounds(0,0,MAP_W,MAP_H);
        this._suelo();this._borde();this._arboles();this._piedras();
        this._arbustos();this._cielo();this._plantas();this._taita();
        this._aves();this._player();
        this.physics.add.collider(this.pl,this.treeGrp);
        this.physics.add.collider(this.pl,this.rockGrp);
        this.physics.add.collider(this.pl,this.bordeGrp);
        this.cameras.main.startFollow(this.pl,true,.09,.09);
        this._input();

        // ── Música de fondo en loop ──
        this._musica = this.sound.add('forest_loop', { loop: true, volume: _volumen * 0.6 });
        this._musica.play();
    }

    // ── Helper: reproducir SFX con volumen global ──
    _sfx(key, vol=1.0){
        this.sound.play(key, { volume: _volumen * vol });
    }

    _suelo(){
        const g=this.add.graphics().setDepth(0);
        g.fillStyle(0x276132,1);g.fillRect(0,0,MAP_W,MAP_H);
        const rng=new Phaser.Math.RandomDataGenerator(['suelo7']);
        const pal=[0x226030,0x2e7038,0x1e5228,0x387a42,0x1a4820,0x3d8040,0x244e2a];
        for(let i=0;i<600;i++){const x=rng.between(0,MAP_W),y=rng.between(0,MAP_H);g.fillStyle(rng.pick(pal),.45);g.fillEllipse(x,y,rng.between(18,70)*2,rng.between(12,45)*2);}
        for(let i=0;i<400;i++){const x=rng.between(0,MAP_W),y=rng.between(0,MAP_H);g.fillStyle(0x4a9050,.28);g.fillEllipse(x,y,rng.between(8,28),rng.between(6,18));}
    }
    _borde(){
        this.bordeGrp=this.physics.add.staticGroup();
        const T=60;
        [[MAP_W/2,T/2,MAP_W,T],[MAP_W/2,MAP_H-T/2,MAP_W,T],[T/2,MAP_H/2,T,MAP_H],[MAP_W-T/2,MAP_H/2,T,MAP_H]]
        .forEach(([x,y,w,h])=>{const r=this.bordeGrp.create(x,y,null);r.setVisible(false).setSize(w,h).refreshBody();});
        const g=this.add.graphics().setDepth(0);
        g.fillStyle(0x0a1a0c,1);g.fillRect(0,0,MAP_W,T);g.fillRect(0,MAP_H-T,MAP_W,T);g.fillRect(0,0,T,MAP_H);g.fillRect(MAP_W-T,0,T,MAP_H);
        const rng=new Phaser.Math.RandomDataGenerator(['borde3']),keys=['tree','tree2','tree3'],paso=120;
        for(let x=T;x<MAP_W-T;x+=paso+rng.between(-20,20)){[T/2,MAP_H-T/2].forEach(y=>{const t=this.add.image(x,y,rng.pick(keys));const sz=rng.between(90,140);t.setDisplaySize(sz,sz*1.4).setDepth(2).setAlpha(.9);});}
        for(let y=T+paso;y<MAP_H-T-paso;y+=paso+rng.between(-20,20)){[T/2,MAP_W-T/2].forEach(x=>{const t=this.add.image(x,y,rng.pick(keys));const sz=rng.between(90,140);t.setDisplaySize(sz,sz*1.4).setDepth(2).setAlpha(.9);});}
    }
    _arboles(){
        this.treeGrp=this.physics.add.staticGroup();
        const rng=new Phaser.Math.RandomDataGenerator(['arb4']),keys=['tree','tree2','tree3'];
        const avoid=[...PLANTAS_DATA.map(p=>({x:p.mx,y:p.my,r:110})),{x:TAITA_X,y:TAITA_Y,r:200}];
        const ok=(x,y)=>{for(const a of avoid)if(Phaser.Math.Distance.Between(x,y,a.x,a.y)<a.r)return false;if(Phaser.Math.Distance.Between(x,y,300,MAP_H-300)<160)return false;return true;};
        for(let i=0;i<420;i++){const x=rng.between(80,MAP_W-80),y=rng.between(80,MAP_H-80);if(!ok(x,y))continue;const sz=rng.between(60,135);const t=this.treeGrp.create(x,y,rng.pick(keys));t.setDisplaySize(sz,sz*1.38).setDepth(3);t.body.setCircle(sz*.25,sz*.25,sz*.65);t.refreshBody();}
        [{x:1200,y:800},{x:4200,y:900},{x:800,y:2800},{x:4600,y:2900},{x:2400,y:1400},{x:3200,y:3200},{x:1600,y:3500},{x:4000,y:1800},{x:2800,y:700},{x:1000,y:1500},{x:4400,y:3500},{x:2200,y:3800}]
        .forEach(c=>{for(let i=0;i<18;i++){const x=c.x+rng.between(-180,180),y=c.y+rng.between(-180,180);if(!ok(x,y))continue;const sz=rng.between(55,120);const t=this.treeGrp.create(x,y,rng.pick(keys));t.setDisplaySize(sz,sz*1.38).setDepth(3);t.body.setCircle(sz*.25,sz*.25,sz*.65);t.refreshBody();}});
    }
    _piedras(){
        this.rockGrp=this.physics.add.staticGroup();
        const rng=new Phaser.Math.RandomDataGenerator(['rock5']);
        const avoid=[...PLANTAS_DATA.map(p=>({x:p.mx,y:p.my,r:90})),{x:TAITA_X,y:TAITA_Y,r:160},{x:300,y:MAP_H-300,r:150}];
        const ok=(x,y)=>{for(const a of avoid)if(Phaser.Math.Distance.Between(x,y,a.x,a.y)<a.r)return false;return true;};
        for(let i=0;i<180;i++){const x=rng.between(100,MAP_W-100),y=rng.between(100,MAP_H-100);if(!ok(x,y))continue;const sz=rng.between(32,72);const r=this.rockGrp.create(x,y,'okwute');r.setDisplaySize(sz,sz*.7).setDepth(2);r.body.setSize(sz*.55,sz*.38).setOffset(sz*.22,sz*.28);r.refreshBody();}
        [{x:1800,y:1200},{x:3600,y:1600},{x:900,y:3200},{x:4500,y:2200},{x:2600,y:2800},{x:1400,y:700},{x:3900,y:3600},{x:2200,y:2000}]
        .forEach(f=>{for(let i=0;i<8;i++){const x=f.x+rng.between(-140,140),y=f.y+rng.between(-100,100);if(!ok(x,y))continue;const sz=rng.between(28,60);const r=this.rockGrp.create(x,y,'okwute');r.setDisplaySize(sz,sz*.7).setDepth(2);r.body.setSize(sz*.55,sz*.38).setOffset(sz*.22,sz*.28);r.refreshBody();}});
    }
    _arbustos(){
        const rng=new Phaser.Math.RandomDataGenerator(['arb2']);
        for(let i=0;i<350;i++){const x=rng.between(60,MAP_W-60),y=rng.between(60,MAP_H-60);this.add.image(x,y,rng.pick(['bush','bush2'])).setDisplaySize(rng.between(35,70),rng.between(24,46)).setDepth(1).setAlpha(.85);}
    }
    _cielo(){
        const sg=this.add.graphics().setDepth(-1);
        sg.fillStyle(0xfff7a0,1);sg.fillCircle(MAP_W-260,200,60);sg.fillStyle(0xf5dc55,.18);sg.fillCircle(MAP_W-260,200,100);
        const cg=this.add.graphics().setDepth(-1);cg.fillStyle(0xffffff,.1);
        [[400,220,140],[1200,100,110],[2200,260,130],[3100,130,105],[4200,210,125],[5000,150,100],[700,1400,115],[1900,1000,95],[3500,1600,120],[4800,900,108],[1500,2600,118],[3200,2200,102],[4600,2800,115],[900,3500,130],[2700,3100,95],[4100,3800,110]]
        .forEach(([x,y,r])=>{cg.fillEllipse(x,y,r*2.4,r*.8);cg.fillEllipse(x-r*.4,y,r*.9,r*.65);cg.fillEllipse(x+r*.5,y,r*.8,r*.6);});
    }
    _plantas(){
        this._pobjs=[];this._pgrp=this.physics.add.staticGroup();
        const cat=[...PLANTAS_CATALOGO].sort(()=>Math.random()-.5);
        PLANTAS_DATA=cat.slice(0,10);
        const cW=MAP_W/5,cH=MAP_H/2,mg=350,pos=[];
        for(let col=0;col<5;col++)for(let row=0;row<2;row++){
            let it=0,px,py,ok;
            do{px=col*cW+mg+Math.random()*(cW-mg*2);py=row*cH+mg+Math.random()*(cH-mg*2);
               ok=Phaser.Math.Distance.Between(px,py,TAITA_X,TAITA_Y)>350&&Phaser.Math.Distance.Between(px,py,300,MAP_H-300)>300;it++;}while(!ok&&it<30);
            pos.push({mx:Math.round(px),my:Math.round(py)});
        }
        const FR=['plant_1','plant_2','plant_3','plant_4','plant_5'];
        PLANTAS_DATA.forEach((p,i)=>{
            const{mx:px,my:py}=pos[i];p.mx=px;p.my=py;
            const h=this.add.graphics().setDepth(4);h.fillStyle(0x81c784,.18);h.fillCircle(0,0,44);h.setPosition(px,py);
            this.tweens.add({targets:h,alpha:.38,duration:1100+Math.random()*400,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
            const spr=this.physics.add.sprite(px,py,'plant_1').setDepth(6).setScale(2);
            spr.setData('info',p).setData('rec',false);spr.body.setImmovable(true);spr.body.setCircle(18,spr.width/2-18,spr.height/2-18);this._pgrp.add(spr);
            let fIdx=0;this.time.addEvent({delay:140,callback:()=>{if(!spr.active)return;fIdx=(fIdx+1)%FR.length;spr.setTexture(FR[fIdx]);},loop:true});
            this.tweens.add({targets:spr,y:py-10,duration:900+Math.random()*400,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
            this._pobjs.push({spr,h,lbl:null,data:p});
        });
    }
    _taita(){
        const tx=TAITA_X,ty=TAITA_Y;
        const glow=this.add.graphics().setDepth(2);glow.fillStyle(0xd4af37,.08);glow.fillCircle(0,0,160);glow.setPosition(tx,ty);
        this.tweens.add({targets:glow,alpha:.22,duration:2000,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
        for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,r=130;this.add.image(tx+Math.cos(a)*r,ty+Math.sin(a)*r,'okwute').setDisplaySize(28,20).setDepth(2).setAlpha(.8);}
        for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,r=100;const pt=this.add.circle(tx+Math.cos(a)*r,ty+Math.sin(a)*r,4,0xd4af37,.75).setDepth(3);this.tweens.add({targets:pt,alpha:.1,duration:600+i*130,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});}
        this._ts=this.physics.add.sprite(tx,ty,'taita_f1').setDepth(9).setScale(2);this._ts.body.setImmovable(true);
        let tf=false;this.time.addEvent({delay:800,callback:()=>{tf=!tf;this._ts.setTexture(tf?'taita_f2':'taita_f1');},loop:true});
        this.tweens.add({targets:this._ts,y:ty-7,duration:1700,yoyo:true,repeat:-1,ease:'Sine.easeInOut'});
        this.add.text(tx,ty-78,'Taita Lorenzo',{fontFamily:"'Press Start 2P'",fontSize:'7px',color:'#d4af37',stroke:'#0d2a18',strokeThickness:3,backgroundColor:'rgba(13,42,24,.88)',padding:{x:5,y:2}}).setOrigin(.5).setDepth(10);
        this._tx=tx;this._ty=ty;
    }
    _secuenciaPortal(){
        // ── Sonido portal + bajar música ──
        if(this._musica) this.tweens.add({targets:this._musica,volume:0,duration:2000});
        this._sfx('sfx_portal', 0.9);

        const PX=TAITA_X+320,PY=TAITA_Y;
        const FP=Array.from({length:15},(_,i)=>'portal'+String(i+1).padStart(2,'00'));
        const portal=this.add.sprite(PX,PY,'portal01').setDepth(12).setScale(2).setAlpha(0).setDisplaySize(120,180);
        let pIdx=0;this.time.addEvent({delay:60,callback:()=>{pIdx=(pIdx+1)%FP.length;portal.setTexture(FP[pIdx]);},loop:true});
        const TF=['taita-cam1','taita-cam2'];let tIdx=0;
        const tW=this.time.addEvent({delay:180,callback:()=>{tIdx=(tIdx+1)%TF.length;this._ts.setTexture(TF[tIdx]);},loop:true});
        this.tweens.add({targets:this._ts,x:PX-80,duration:2000,ease:'Linear',
            onStart:()=>{this.tweens.add({targets:portal,alpha:1,duration:800,ease:'Power2'});},
            onComplete:()=>{
                tW.remove();
                const esFem=getPersonaje()==='f';
                const WF=esFem?['walk2-right1','walk2-right2','walk2-right1']:['walk-right1','walk-right2','walk-right3'];
                let wIdx=0;const pW=this.time.addEvent({delay:120,callback:()=>{wIdx=(wIdx+1)%WF.length;this.pl.setTexture(WF[wIdx]);},loop:true});
                this.tweens.add({targets:this.pl,x:PX-40,y:PY,duration:2500,ease:'Linear',
                    onComplete:()=>{
                        pW.remove();
                        const fl=this.add.rectangle(this.scale.width/2,this.scale.height/2,this.scale.width,this.scale.height,0xffffff).setDepth(200).setAlpha(0);
                        this.tweens.add({targets:this.pl,x:PX,y:PY,scaleX:0,scaleY:0,duration:400,ease:'Power2.In'});
                        this.tweens.add({targets:fl,alpha:1,duration:300,ease:'Power2.In',delay:350,onComplete:()=>{this._irisTransicion(()=>{window.location.href='game-2.html';});}});
                    }
                });
            }
        });
    }
    _irisTransicion(onFin){
        const W=this.scale.width,H=this.scale.height;
        const ov=document.createElement('canvas');ov.width=W;ov.height=H;
        ov.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
        document.body.appendChild(ov);
        const ctx=ov.getContext('2d'),cx=W/2,cy=H/2,rMax=Math.sqrt(cx*cx+cy*cy)*1.1;
        let radio=rMax,fase='cerrar';
        const tick=()=>{
            ctx.clearRect(0,0,W,H);ctx.fillStyle='#000000';ctx.fillRect(0,0,W,H);
            ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(cx,cy,Math.max(radio,0),0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';
            if(fase==='cerrar'){radio-=rMax/45;if(radio<=0){fase='esperar';setTimeout(()=>{fase='abrir';radio=0;onFin();requestAnimationFrame(tick);},400);return;}}
            else if(fase==='abrir'){radio+=rMax/40;if(radio>=rMax){ov.remove();return;}}
            requestAnimationFrame(tick);
        };requestAnimationFrame(tick);
    }
    _aves(){
        [{x:800,y:600,angulo:25},{x:MAP_W/2,y:900,angulo:200},{x:MAP_W-900,y:500,angulo:145}]
        .forEach((b,bi)=>{
            const grupo=[];for(let i=0;i<3;i++)grupo.push(this.add.image(b.x+i*40,b.y+i*20,'bird').setDepth(20).setScale(.5+i*.08).setAlpha(.85-i*.1));
            let ang=b.angulo,vel=90+bi*20,vx=Math.cos(Phaser.Math.DegToRad(ang))*vel,vy=Math.sin(Phaser.Math.DegToRad(ang))*vel,lx=b.x,ly=b.y;
            this.time.addEvent({delay:Phaser.Math.Between(3000,5000),callback:()=>{ang+=Phaser.Math.Between(-60,60);vel=Phaser.Math.Between(70,130);vx=Math.cos(Phaser.Math.DegToRad(ang))*vel;vy=Math.sin(Phaser.Math.DegToRad(ang))*vel;},loop:true});
            this.time.addEvent({delay:16,callback:()=>{lx+=vx*.016;ly+=vy*.016;if(lx<200||lx>MAP_W-200){vx*=-1;ang=180-ang;}if(ly<200||ly>MAP_H-200){vy*=-1;ang=-ang;}grupo.forEach((ave,i)=>{const off=i*35;ave.x=lx-Math.cos(Phaser.Math.DegToRad(ang))*off;ave.y=ly-Math.sin(Phaser.Math.DegToRad(ang))*off;ave.setFlipX(vx<0);});},loop:true});
        });
    }
    _player(){
        const esFem=getPersonaje()==='f';
        const AM={left:['walk_left1','walk_left2','walk_left3'],right:['walk_right1','walk_right2','walk_right3'],down:['walk_down1','walk_down2','walk_down3'],arrive:['walk_arrive1','walk_arrive2','walk_arrive3']};
        const AF={left:['walk2_left1','walk2_left2','walk2_left3'],right:['walk2_right1','walk2_right2'],down:['walk2_down1','walk2_down2','walk2_down3'],arrive:['walk2_arrive1','walk2_arrive2','walk2_arrive3']};
        const defKey=esFem?'walk2_default':'walk_default',ANIMS=esFem?AF:AM;
        this.pl=this.physics.add.sprite(300,MAP_H-300,defKey).setDepth(10).setCollideWorldBounds(true).setScale(2);
        this.pl.body.setSize(this.pl.width*.5,this.pl.height*.35).setOffset(this.pl.width*.25,this.pl.height*.60);
        this._animDir='idle';this._animFrame=0;this._animFrames=[];
        this.time.addEvent({delay:130,callback:()=>{if(this._animDir==='idle'||!this.pl.active)return;this._animFrame=(this._animFrame+1)%this._animFrames.length;this.pl.setTexture(this._animFrames[this._animFrame]);},loop:true});
        this._setAnim=(dir)=>{if(dir===this._animDir)return;this._animDir=dir;if(dir==='idle'){this.pl.setTexture(defKey);this._animFrame=0;return;}this._animFrames=ANIMS[dir];this._animFrame=0;this.pl.setTexture(this._animFrames[0]);};
        const nom=localStorage.getItem('usuario_nombre')||'Explorador';
        this._plbl=this.add.text(0,0,nom,{fontFamily:"'Press Start 2P'",fontSize:'6px',color:'#f0d060',stroke:'#0d2a18',strokeThickness:3}).setOrigin(.5).setDepth(11);
        this._arr=this.add.text(0,0,'▲',{fontFamily:"'Press Start 2P'",fontSize:'9px',color:'#f0d060'}).setOrigin(.5).setDepth(11);
        this.tweens.add({targets:this._arr,y:'-=7',yoyo:true,repeat:-1,duration:450});
        this.time.delayedCall(5000,()=>{if(this._arr)this._arr.setVisible(false)});
    }
    _input(){
        this.keys=this.input.keyboard.addKeys({u:Phaser.Input.Keyboard.KeyCodes.W,d:Phaser.Input.Keyboard.KeyCodes.S,l:Phaser.Input.Keyboard.KeyCodes.A,r:Phaser.Input.Keyboard.KeyCodes.D,u2:Phaser.Input.Keyboard.KeyCodes.UP,d2:Phaser.Input.Keyboard.KeyCodes.DOWN,l2:Phaser.Input.Keyboard.KeyCodes.LEFT,r2:Phaser.Input.Keyboard.KeyCodes.RIGHT,e:Phaser.Input.Keyboard.KeyCodes.E});
        this.dp={u:false,d:false,l:false,r:false};
        const dirs={up:'u',down:'d',left:'l',right:'r'};
        Object.keys(dirs).forEach(dir=>{const el=document.getElementById('dp-'+dir),k=dirs[dir];const on=()=>{this.dp[k]=true;el.classList.add('act')};const off=()=>{this.dp[k]=false;el.classList.remove('act')};el.addEventListener('touchstart',e=>{e.preventDefault();on()},{passive:false});el.addEventListener('touchend',e=>{e.preventDefault();off()},{passive:false});el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off);});
    }
    update(){
        if(panelOpen||quizOn){this.pl.setVelocity(0,0);return;}
        const k=this.keys,dp=this.dp;let vx=0,vy=0;
        if(k.l.isDown||k.l2.isDown||dp.l)vx=-SPD;if(k.r.isDown||k.r2.isDown||dp.r)vx=SPD;
        if(k.u.isDown||k.u2.isDown||dp.u)vy=-SPD;if(k.d.isDown||k.d2.isDown||dp.d)vy=SPD;
        if(vx!==0&&vy!==0){vx*=.707;vy*=.707;}
        this.pl.setVelocity(vx,vy);
        if(vx===0&&vy===0)this._setAnim('idle');
        else if(Math.abs(vx)>=Math.abs(vy))this._setAnim(vx<0?'left':'right');
        else this._setAnim(vy<0?'arrive':'down');
        const px=this.pl.x,py=this.pl.y;
        if(this._plbl)this._plbl.setPosition(px,py-46);if(this._arr)this._arr.setPosition(px,py-60);
        playerWorldX=px;playerWorldY=py;
        this._chkPlantas(px,py);this._chkTaita(px,py);
        dibujarMinimap(px,py,this._pobjs);
        if(Phaser.Input.Keyboard.JustDown(k.e))interactuar();
    }
    _chkPlantas(px,py){
        let near=null,min=PROX_PLANTA;
        this._pobjs.forEach(o=>{if(o.spr.getData('rec'))return;const d=Phaser.Math.Distance.Between(px,py,o.spr.x,o.spr.y);if(d<min){near=o;min=d;}});
        if(near!==cercana){cercana=near;const b=document.getElementById('btn-act');near?b.classList.add('on'):b.classList.remove('on');}
    }
    _chkTaita(px,py){
        const d=Phaser.Math.Distance.Between(px,py,this._tx,this._ty);
        const nc=d<PROX_TAITA;
        if(nc!==taitaCerca){
            taitaCerca=nc;
            _actualizarBurbuja();
            const btnQuiz=document.getElementById('btn-quiz');
            if(btnQuiz){
                if(nc&&recolectadas.length>=PLANTAS_META) btnQuiz.classList.add('on');
                else if(!nc) btnQuiz.classList.remove('on');
            }
        }
        if(nc){const cam=this.cameras.main;const sx=(this._tx-cam.scrollX)*cam.zoom;const sy=(this._ty-cam.scrollY)*cam.zoom-90;const b=document.getElementById('burbuja');b.style.left=sx+'px';b.style.top=sy+'px';b.style.transform='translateX(-50%)';}
    }
    animRec(id){
        const o=this._pobjs.find(x=>x.data.id===id);if(!o)return;
        o.spr.setData('rec',true);if(o.timer){o.timer.remove();o.timer=null;}
        this.tweens.killTweensOf(o.spr);if(o.h)this.tweens.killTweensOf(o.h);
        this.tweens.add({targets:[o.spr,o.h].filter(Boolean),y:'-=60',alpha:0,duration:600,ease:'Power2',onComplete:()=>{if(o.spr&&o.spr.active)o.spr.setVisible(false);if(o.h&&o.h.active)o.h.setVisible(false);}});
        for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2;const c=this.add.circle(o.spr.x,o.spr.y,5,0x81c784).setDepth(15);this.tweens.add({targets:c,x:o.spr.x+Math.cos(a)*60,y:o.spr.y+Math.sin(a)*60,alpha:0,scaleX:0,scaleY:0,duration:580,ease:'Power2',onComplete:()=>c.destroy()});}
    }
}

/* ═══ FUNCIONES GLOBALES ═══ */
function interactuar(){
    if(!cercana||panelOpen||quizOn)return;
    const d=cercana.data;
    if(recolectadas.find(r=>r.id===d.id))return;
    if(recolectadas.length>=PLANTAS_META)return;
    recolectadas.push(d);cercana=null;
    document.getElementById('btn-act').classList.remove('on');
    const _ids=new Set(JSON.parse(localStorage.getItem('plantas_encontradas')||'[]'));
    _ids.add(d.id);
    localStorage.setItem('plantas_encontradas',JSON.stringify([..._ids]));

    // ── SFX recoger planta ──
    const ws=game.scene.getScene('World');
    if(ws) ws._sfx('sfx_planta', 0.8);
    if(ws) ws.animRec(d.id);

    const n=recolectadas.length;
    document.getElementById('hud-txt').textContent='🌿 '+n+' / '+PLANTAS_META+' plantas';
    document.getElementById('hud-fill').style.width=Math.min(n/PLANTAS_META*100,100)+'%';
    if(n>=PLANTAS_META)taitaParpadeo=true;
    if(taitaCerca)_actualizarBurbuja();
    _abrirPanel(d,n);
}

function _abrirPanel(p,n){
    panelOpen=true;
    document.getElementById('pp-ico').innerHTML='<div class="pp-img-wrap"><img src="'+p.img+'" alt="'+p.nombre+'"></div>';
    document.getElementById('pp-nom').textContent=p.nombre;
    document.getElementById('pp-ci').textContent='';
    document.getElementById('pp-desc').textContent=p.desc;
    document.getElementById('pp-usos').textContent=p.usos;
    document.getElementById('pp-prep').textContent=p.prep;
    const pct=Math.min(n/PLANTAS_META*100,100);
    document.getElementById('pp-pfill').style.width=pct+'%';
    document.getElementById('pp-ptxt').textContent=n>=PLANTAS_META?'✓ ¡'+n+' plantas! Ve a hablar con el Taita ✨':n+' / '+PLANTAS_META+' — sigue recogiendo 🌿';
    document.getElementById('panel').classList.add('on');
}

function cerrarPanel(){panelOpen=false;document.getElementById('panel').classList.remove('on');setTimeout(()=>game.scale.refresh(),420);}

function _actualizarBurbuja(){
    const b=document.getElementById('burbuja'),n=recolectadas.length;
    if(!taitaCerca){b.classList.remove('on');return;}
    if(n===0)b.textContent='¡Bienvenido, joven! Recoge 5 plantas sagradas del bosque 🌿';
    else if(n<PLANTAS_META)b.textContent='Llevas '+n+'... aún te faltan '+(PLANTAS_META-n)+' plantas 🌱';
    else b.textContent='¡Bien hecho, guardián! Ya puedes hacer el Quiz ⚡';
    b.classList.add('on');
}

function iniciarQuiz(){
    if(recolectadas.length<PLANTAS_META)return;
    quizOn=true;qIdx=0;qPts=0;taitaParpadeo=false;
    document.getElementById('btn-quiz').classList.remove('on');
    let banco=[];recolectadas.forEach(p=>{banco=banco.concat(p.preguntas||[]);});
    qPregs=banco.sort(()=>Math.random()-.5).slice(0,10);
    document.getElementById('quiz-ov').classList.add('on');_mostrarQ();
}

function _mostrarQ(){
    if(qIdx>=qPregs.length){_finQuiz();return;}
    const q=qPregs[qIdx];
    const pl=recolectadas.find(p=>p.preguntas&&p.preguntas.some(pr=>pr.p===q.p));
    const imgEl=document.getElementById('q-planta-img');
    if(imgEl){
        imgEl.innerHTML='';
        if(pl){const img=document.createElement('img');img.src=pl.img;img.alt=pl.nombre;imgEl.appendChild(img);}
    }
    document.getElementById('qprog').textContent=(qIdx+1)+'/'+qPregs.length;
    document.getElementById('qpreg').textContent=q.p;
    const opts=document.getElementById('qopts');opts.innerHTML='';
    q.o.forEach((txt,i)=>{const b=document.createElement('button');b.className='qopt';b.textContent=txt;b.disabled=false;b.style.pointerEvents='auto';b.style.background='';b.style.borderColor='';b.style.color='';b.onclick=()=>_resp(i,q.c,b);opts.appendChild(b);});
    clearInterval(qInt);qSeg=15;
    document.getElementById('qtim').textContent=qSeg;
    document.getElementById('qbf').style.transition='none';document.getElementById('qbf').style.width='100%';
    setTimeout(()=>{document.getElementById('qbf').style.transition='width '+qSeg+'s linear';document.getElementById('qbf').style.width='0%';},50);
    qInt=setInterval(()=>{qSeg--;document.getElementById('qtim').textContent=qSeg;if(qSeg<=0){clearInterval(qInt);_resp(-1,q.c,null);}},1000);
}

function _resp(idx,correcto,btn){
    clearInterval(qInt);
    document.querySelectorAll('.qopt').forEach(b=>{b.disabled=true;b.style.pointerEvents='none';});
    const bots=document.getElementById('qopts').querySelectorAll('.qopt');
    if(bots[correcto]){bots[correcto].style.background='rgba(46,160,67,.85)';bots[correcto].style.borderColor='#2ea043';bots[correcto].style.color='#ffffff';}

    const ws=game.scene.getScene('World');
    if(idx===correcto){
        qPts++;
        if(btn){btn.style.background='rgba(46,160,67,.85)';btn.style.borderColor='#2ea043';}
        if(ws) ws._sfx('sfx_correcto', 0.8);  // ── SFX correcto ──
    } else {
        if(idx>=0&&btn){btn.style.background='rgba(200,50,50,.85)';btn.style.borderColor='#c83232';btn.style.color='#ffffff';}
        if(ws) ws._sfx('sfx_incorrecto', 0.8); // ── SFX incorrecto ──
    }
    setTimeout(()=>{qIdx++;_mostrarQ();},1500);
}

function _finQuiz(){
    clearInterval(qInt);
    document.getElementById('quiz-ov').classList.remove('on');
    quizOn=false;
    const pct=qPts/10;let emo,tit,desc;
    if(pct>=.9){emo='🏆';tit='¡Guardián del Bosque!';desc='Conoces profundamente las plantas sagradas del territorio Pastos';}
    else if(pct>=.7){emo='🌿';tit='¡Buen Explorador!';desc='Tienes buen conocimiento del bosque sagrado';}
    else if(pct>=.5){emo='🌱';tit='Aprendiz del Bosque';desc='Sigue explorando y aprendiendo del territorio';}
    else{emo='🍂';tit='Sigue Intentando';desc='El bosque tiene mucho más por enseñarte';}
    document.getElementById('re').textContent=emo;
    document.getElementById('rt').textContent=tit;
    document.getElementById('rp').textContent=qPts+'/10';
    document.getElementById('rd').textContent=desc;
    document.getElementById('res-ov').classList.add('on');
    localStorage.setItem('puntos_total',(parseInt(localStorage.getItem('puntos_total')||'0')+qPts*10));
    localStorage.setItem('partidas',(parseInt(localStorage.getItem('partidas')||'0')+1));

    // ── SFX nivel completo si puntaje >= 50% ──
    const ws=game.scene.getScene('World');
    if(ws && pct>=.5) ws._sfx('sfx_nivel', 0.9);
}

function continuar(){
    document.getElementById('res-ov').classList.remove('on');
    const ws=game.scene.getScene('World');
    if(ws)ws._secuenciaPortal();
}
function repetirQuiz(){document.getElementById('res-ov').classList.remove('on');iniciarQuiz();}
function irMenu(){window.location.href='menugeneral.html';}

/* ── Control de volumen desde el pause (si game.html tiene slider) ── */
function cambiarVolumen(val){
    _volumen = val / 100;
    const ws = game.scene.getScene('World');
    if(ws && ws._musica) ws._musica.setVolume(_volumen * 0.6);
    const el = document.getElementById('volValor');
    if(el) el.textContent = val + '%';
}

const game=new Phaser.Game({
    type:Phaser.AUTO,
    parent:'game-container',
    width:window.innerWidth,
    height:window.innerHeight,
    backgroundColor:'#276132',
    physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},
    scene:[PreloadScene,WorldScene],
    scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH}
});