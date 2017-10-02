     /*########################################################
     #                                                        #
     #	           Lisp Interpreter Project                   #
     #		                                              #
     #                                                        #
     #		                 Done By:Krishnakumar K       #
     #                                                        #
     #  Still working on it,Work for simple functions but     #
     #  not for recursive ones                                #                  #                                                        #
     ########################################################*/

//This part tokenizes the scheme program
//input:(+ 5 6)
//output:['(','+','5','6,')']

function tokenize(chars){
	return chars.replace(/[(_]/g,'( ').replace(/[)_]/g,' )').trim().split(' ');}

//This part parses the tokenized program
//input:['(','+','5','6',')']
//Output:['+',5,6]

function parse(program){
         return read_from_tokens(tokenize(program));}
function read_from_tokens(tokens){
	if(tokens.length==0)
                 console.log("Syntax Error");
         var token=tokens.shift();
        if("("==token){
       		var L=[];
                while(tokens[0]!=')')
                {
                         L.push(read_from_tokens(tokens));
                }
                tokens.shift();
                return L;}
        else if(")"==token)
        	console.log("Syntax Error");
        else
                return atom(token);}
function atom(token){
        return Number(token)||String(token);}

//This part creates the standard environment
function standard_env(){
	function add(a,b){
        	return a+b;}
        function sub(a,b){
                return a-b;}
        function mul(a,b){
                return a*b;}
        function div(a,b){
                return a/b;}
	function gt(a,b){
		return a>b;}
	function lt(a,b){
		return a<b;}
	function equal(a,b){
		return a==b;}
	function gte(a,b){
		return a>=b;}
	function lte(a,b){
		return a<=b;}
	function begin(a){
		return a;}
	function car(a){
		return a[0];}
	function cdr(a){
		return a.slice(1);}
	function not(a){
		return !(a);}
	function cons(a,b){
		b.unshift(a);
		return b;}
        var env={'+':add,'-':sub,'*':mul,'/':div,'>':gt,'<':lt,'=':equal,'>=':gte,'<=':lte,'begin':begin,'car':car,'cdr':cdr,'not':not,'cons':cons,'list':Array,
		'equal?':equal,'append':add,'sin':Math.sin,'cos':Math.cos,'tan':Math.tan,'pow':Math.pow,'log':Math.log,'pi':3.141592653589793,'abs':Math.abs,          		    'min':Math.min,'max':Math.max,'sqrt':Math.sqrt};
        return env;}

//This part plays the role of evaluation.Our scheme program is evaluated and the result is returned
//input:['+',5,6]
//output:11

Glblenv=standard_env();
var parms=[];
var args=[];
//Creating a prototype Procedure
function Procedure(parms,body,env){
	this.parms=parms;
	this.body=body;
	this.env=Glblenv;
	}
Procedure.prototype.call=function(args){
	this.args=args;
	var n=zip(this.parms,this.args);
	var d=n[0][1];
	var k=n[0][0]
	this.env[k]=d;
	var proc=Eval(this.body[0],this.env)
	var i=1;
	var args=[];
	while(this.body[i]!=undefined){
		args.push(Eval(this.body[i],this.env));
		i+=1;}
	return proc.apply(this,args);}
function zip(a,b){
	d=[];
	for(i=0;i<a.length;i+=1)
  	{
        	c=[];
          	c.push(a[i],b[i]);
          	d.push(c);
  	}
  	return d;}
outer=null;
/*function Env(parms,args,outer){
	this.outer=outer;
	var find = function (variable) {
        	if (env.hasOwnProperty(variable)) {
            		return env;
        	} 
		else {
            	return global.find(variable);
        	}	
}};*/
//The evaluation function 
function Eval(x,env){
	env=Glblenv;
	var args=[];
        if(typeof(x)=='string'){
		if(env[x]==undefined){
			return x;}
		else{
			return env[x];}}
        else if(typeof(x)!='object')
        	return x;
     	else{
        	if(x[0]=='if'){
			var test=x[1];
			var conseq=x[2];
			var alt=x[3];
			if(Eval(test,env)==true)
				return Eval(conseq,env);
			else
				return Eval(alt,env);}
		else if(x[0]=='define'){
			Var=x[1];
			exp=x[2];
			v=Var;
			e=Eval(exp,env);
			env[v]=e;}
		else if(x[0]=='lambda'){
			parms=x[1];
			body=x[2];
			var out=new Procedure(parms,body);
			return out;}
			
		else{
			var l=1;
			var proc=Eval(x[0],env);
			if(typeof(proc)=='object'){
				while(x[l]!=undefined){
                        		args.push(Eval(x[l],env));
                        		l+=1;}
				return proc.call(args);}
			else{
				while(x[l]!=undefined){
					args.push(Eval(x[l],env));
					l+=1;}
				return proc.apply(this,args);}}}}
// A simple function of computing circle area which returns 78.5398163
var program='(define circl-area (lambda (r) (* pi (* r r))))';	
var program1='(circl-area 5)';
Eval(parse(program));
console.log(Eval(parse(program1)));
