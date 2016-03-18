require(['api_mkt','mkt_info','mkt_trade','cookie'], function(api_mkt,mkt_info,mkt_trade) {
	//console.log(api_mkt);
	//console.log(mkt_info);
	mkt_info.get();
	mkt_trade.getfloor();
});