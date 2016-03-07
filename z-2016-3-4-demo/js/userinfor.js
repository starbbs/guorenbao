define(function(){
		var userinfor = {};
		avalon.ready(function(){
			 userinfor.vm = avalon.define({
				$id:'userinfor',
				name:'',
				password:'',
				img:'',
				age:''
			});
			avalon.scan();
		});
		console.log(userinfor);
		return userinfor;
});