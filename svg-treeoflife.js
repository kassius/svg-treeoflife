function getOpposite(radius, adj)
{
	tan = Math.tan(Snap.rad(radius));
	return (adj * tan);
}

// current y = line height-1 (first is zero) * line height + sphere radius (center of the sphere)  
function line(l, lh, sr)
{
	return ((l-1) * lh) + sr;
}

function TreeData(width,el,fontsize)
{
	this.width = width;
	center = this.center = width / 2;
	sphere_diameter = this.sphere_diameter = width * 0.234375;
	sphere_radius = this.sphere_radius = sphere_diameter/2;
	degrees = this.degrees = 30;
	frame_width = this.frame_width = width - sphere_diameter;
	frame_center = this.frame_center = frame_width/2;
	line_height = this.line_height = getOpposite(degrees,frame_center);
	path_height = this.path_height = frame_width * 0.0546875;

        height = this.height = line_height * 9 + 10; // sphere stroke *2

	middle_pillar = this.middle_pillar = center;
	left_pillar = this.left_pillar = sphere_radius;
	right_pillar = this.right_pillar = width - sphere_radius;

	this.el = el;

	//this.fontsize = fontsize;
	fontsize = this.fontsize = 0.02666*width;

	this.textpadding = fontsize/2;

	$(el).css({ fontSize : fontsize + "px" });
}

function SphereData()
{
	uid = this.uid = 1;

	stroke = this.stroke = 'black';
	fill = this.fill = 'white';

	// text stroke and fill defs
	tstroke = this.tstroke = 'none';
	tfill = this.tfill = 'black';

	this.text_top = {
		text : "TOP LABEL",
		stroke : this.tstroke,
		fill : this.tfill
	}

	this.text_middle = {
		text : "MIDDLE LABEL",
		stroke : this.tstroke,
		fill : this.tfill
	}

	this.text_bottom = {
		text : "BOTTOM LABEL",
		stroke : this.tstroke,
		fill : this.tfill
	};
}

function PathData()
{
	uid = this.uid = 1;

	stroke = this.stroke = 'black';
	fill = this.fill = 'white';

	tstroke = this.tstroke = 'none';
	tfill = this.tfill = 'black';

	text = this.text = "PATH";
}

// SPHERE
function Sphere(snap, pillar, sline, treedata)
{
	this.snap = snap;

	this.x = x = pillar;
	this.y = y = line(sline, treedata.line_height, treedata.sphere_radius);
	this.r = r = treedata.sphere_radius;

	this.data = new SphereData();

	this.draw = function ()
	{
		snap = this.snap;

		x = this.x;
		y = this.y;
		r = this.r;

		tpad = treedata.textpadding;
		rpad = r - tpad;

		// SPHERE - draw circle
		this.sphere = snap.circle(x,y,r)
			.attr({
				id:this.data.uid,
				class:'sphere-circs ' + this.data.uid + '-elements',
				stroke : this.data.stroke,
				fill : this.data.fill
		       }); 

		// this drow a dot in the middle of each sphere
		//this.middot= snap.circle(x,y,1).attr({stroke:'black'});

		// SPHERE - top text
		this.tstr = this.data.text_top.text;
		this.tpath = snap.path("M" + x + "," + y + " m" + (-rpad) + ",0 a" + rpad + "," + rpad + " 0 0 1 " + (rpad*2) + ",0" )
			.attr({ fillOpacity:'0' });
		this.ttext = snap.text(0, 0, this.tstr)
			.attr({
				id:this.data.uid+"-toptext",
				class:'sphere-toptext ' + this.data.uid + '-elements',
				textpath: this.tpath,
				textAnchor:'middle',
				stroke:this.data.text_top.stroke,
				fill:this.data.text_top.fill,
			})
			.textPath.attr({
				startOffset: '50%',
				alignmentBaseline:'text-before-edge'
			});

		// SPHERE - middle text
		this.mstr = this.data.text_middle.text;
		this.mtext = snap.text(x, y, this.mstr)
			.attr({
				id:this.data.uid+"-middletext",
				class:'sphere-middletext ' + this.data.uid + '-elements',
				textAnchor:'middle',
				alignmentBaseline:'middle',
				stroke:this.data.text_middle.stroke,
				fill:this.data.text_middle.fill,
			});

		// SPHERE - bottom text
		this.bstr = this.data.text_bottom.text;
		this.bpath = snap.path("M" + x + "," + y + " m" + (-rpad) + ",0 a" + rpad + "," + rpad + " 0 0 0 " + (rpad*2) + ",0" )
			.attr({
				fillOpacity:'0'
			});
		this.btext = snap.text(0, 0, this.bstr)
			.attr({
				id:this.data.uid+"-bottomtext",
				class:'sphere-bottomtext ' + this.data.uid + '-elements',
				textpath:this.bpath,
				textAnchor:'middle',
				stroke:this.data.text_bottom.stroke,
				fill:this.data.text_bottom.fill,
			})
			.textPath.attr({
				startOffset: '50%',
				alignmentBaseline:'text-after-edge'
			});
	}

}

// PATH
function Path(snap,s1,s2,treedata)
{
	this.snap = snap;
	x1 = this.x1 = parseFloat(s1.x);
	y1 = this.y1 = parseFloat(s1.y);
	x2 = this.x2 = parseFloat(s2.x);
	y2 = this.y2 = parseFloat(s2.y);

	path_height = this.path_height = treedata.path_height;

	d = this.d = Math.sqrt(Math.pow(Math.abs(x2-x1),2) + Math.pow(Math.abs(y2-y1),2));
	dx = this.dx = ((x1 + x2) / 2) - d/2;
	dy = this.dy = ((y1 + y2) / 2) - path_height/2;

	deg = this.deg = ((x2 <= x1) ? -(Snap.deg(Math.asin((y2-y1)/d))) : +(Snap.deg(Math.asin((y2-y1)/d))) );	

	this.data = new PathData();

	// PATH - draw path
	this.draw = function ()
	{
		snap = this.snap;

		x1 = this.x1;
		x2 = this.x2;
		y1 = this.y1;
		y2 = this.y2;

		path_height = this.path_height;

		d = this.d;
		dx = this.dx;
		dy = this.dy;

		deg = this.deg;

		// PATH - element itself
		this.path = snap.rect(dx,dy,d,path_height)
			.attr({
				id:this.data.uid,
				class:'path-rects ' + this.data.uid + '-elements',
				fill:this.data.fill,
				stroke:this.data.stroke,
			})
			.transform("r"+deg);

		// PATH - text
		this.tx = tx = ((x1 + x2) / 2);
		this.ty = ty = ((y1 + y2) / 2);
		this.text = text = snap.text(tx,ty,this.data.text)
		       .attr({ 
				id:this.data.uid+"-text",
				class:'path-text ' + this.data.uid + '-elements',
				textAnchor:'middle',
				alignmentBaseline:'middle',
				fill:this.data.tfill,
				stroke:this.data.tstroke,
			})
		       .transform("r"+deg);
	}
}

var TreeOfLife = function(width, el)
{
	var fontsize = parseFloat($(el).css("font-size"));
		
	this.treedata = treedata = new TreeData(width,el,fontsize);

	$(el).width(treedata.width).height(treedata.height);
	
	var middle_pillar = treedata.center;
	var left_pillar = treedata.left_pillar;
	var right_pillar = treedata.right_pillar;

	var path_height = treedata.path_height;//exclude me!!

	var s = Snap(el);

	sp = Array();
	sp[1] = new Sphere(s,center,1,treedata);
	sp[2] = new Sphere(s,right_pillar,2,treedata);
	sp[3] = new Sphere(s,left_pillar,2,treedata);
	sp[4] = new Sphere(s,right_pillar,4,treedata);
	sp[5] = new Sphere(s,left_pillar,4,treedata);
	sp[6] = new Sphere(s,middle_pillar,5,treedata);
	sp[7] = new Sphere(s,right_pillar,6,treedata);
	sp[8] = new Sphere(s,left_pillar,6,treedata);
	sp[9] = new Sphere(s,middle_pillar,7,treedata);
	sp[10] = new Sphere(s,middle_pillar,9,treedata);
	sp[11] = new Sphere(s,middle_pillar,3,treedata);

	pt = Array();
	pt[1] = new Path(s,sp[1],sp[2],treedata);
	pt[2] = new Path(s,sp[1],sp[3],treedata);
	pt[3] = new Path(s,sp[1],sp[6],treedata);
	pt[4] = new Path(s,sp[2],sp[3],treedata);
	pt[5] = new Path(s,sp[2],sp[6],treedata);
	pt[6] = new Path(s,sp[2],sp[4],treedata);
	pt[7] = new Path(s,sp[3],sp[6],treedata);
	pt[8] = new Path(s,sp[3],sp[5],treedata);
	pt[9] = new Path(s,sp[4],sp[5],treedata);
	pt[10] = new Path(s,sp[4],sp[6],treedata);
	pt[11] = new Path(s,sp[4],sp[7],treedata);
	pt[12] = new Path(s,sp[5],sp[6],treedata);
	pt[13] = new Path(s,sp[5],sp[8],treedata);
	pt[14] = new Path(s,sp[6],sp[7],treedata);
	pt[15] = new Path(s,sp[6],sp[8],treedata);
	pt[16] = new Path(s,sp[6],sp[9],treedata);
	pt[17] = new Path(s,sp[8],sp[7],treedata);
	pt[18] = new Path(s,sp[7],sp[9],treedata);
	pt[19] = new Path(s,sp[7],sp[10],treedata);
	pt[20] = new Path(s,sp[8],sp[9],treedata);
	pt[21] = new Path(s,sp[8],sp[10],treedata);
	pt[22] = new Path(s,sp[9],sp[10],treedata);

	var sd = new Object();
	sd = {
		1: { tt: 'Kether - Corona', tm: '1', tb: 'The Crown' },
		2: { tt: 'Chokmah - Sapientia', tm: '2', tb: 'Wisdom' },
		3: { tt: 'Binah - Compherensio', tm: '3', tb: 'Understanding' },
		4: { tt: 'Chesed - Clementia', tm: '4', tb: 'Mercy' },
		5: { tt: 'Geburah - Virtus', tm: '5', tb: 'Strength' },
		6: { tt: 'Tiphareth - Pulchritudo', tm: '6', tb: 'Beauty' },
		7: { tt: 'Netzack - Victoria', tm: '7', tb: 'Victory' },
		8: { tt: 'Hod - Splendor', tm: '8', tb: 'Splendour' },
		9: { tt: 'Yesod - Fundamentum', tm: '9', tb: 'The Foundation' },
		10: { tt: 'Malkuth - Regnum', tm: '10', tb: 'The Kingdom' },
		11: { tt: 'Daath - Scientia', tm: '11', tb: 'Knowledge' },
	}

	var pd = new Object();
	pd = {
		1: { text: '0 · The Fool' },
		2: { text: 'I · The Magus' },
		3: { text: 'II · The Priestess' },
		4: { text: 'III · The Empress' },
		5: { text: 'IV · The Emperor' },
		6: { text: 'V · The Hierofant' },
		7: { text: 'VI · The Lovers' },
		8: { text: 'VII · The Chariot' },
		9: { text: 'VIII · Adjustment' },
		10: { text: 'IX · The Hermit' },
		11: { text: 'X · Fortune' },
		12: { text: 'XI · Lust' },
		13: { text: 'XII · The Hanged Man' },
		14: { text: 'XIII · Death' },
		15: { text: 'XIV · Art' },
		16: { text: 'XV · The Devil' },
		17: { text: 'XVI · The Tower' },
		18: { text: 'XVII · The Star' },
		19: { text: 'XVIII · The Moon' },
		20: { text: 'XIX · The Sun' },
		21: { text: 'XX · The Aeon' },
		22: { text: 'XXI · The Universe' },
	}

	for(i=1;i<pt.length;i++) {

		pt[i].data.uid = "path" + i; //hardcore string later!!
		pt[i].data.text = pd[i].text;

		pt[i].draw();
	}

	for(i=1;i<sp.length;i++) {
		sp[i].data.uid = "sphere" + i; //hardcore prefix later!!
		sp[i].data.text_top.text = sd[i].tt;
		sp[i].data.text_middle.text = sd[i].tm;
		sp[i].data.text_bottom.text = sd[i].tb;

		sp[i].draw();
	}

}


