require(['api_mkt','cookie'], function(api_mkt) {
	$(".tab").on("click",function(){

		/**
		 * <div class="message_cont_box color_let">
                        <span>系统</span><span>2016年3月13日17:27:50</span>
                        <div>亲爱的用户：比特币和莱特币近期行情波动较大，火币网提醒杠杆交易用户周末注意价格变化，控制仓位和杠杆倍数，防范由剧烈价格波动产生的风险。</div>
                        <img src="./images/mine_ssmessage_delete_btn.png" alt="" width="13px;" height="16px;">
                    </div>
		 */

		var messageonehtml = "";
		$(this).siblings().removeClass("choosed_on_mes");
		$(this).addClass("choosed_on_mes");
		if($(this).hasClass("one")){
			messageonehtml += "<div class='message_cont_box color_let'><span>系统</sapn><span>2016年3月27日15:42:16</sapn>";
			messageonehtml += "<div>亲爱的用户:比特币和莱特币近期行情波动较大</div>";
			messageonehtml += "<img src='./images/mine_ssmessage_delete_btn.png' alt='' width='13px;' height='16px;'/>";
			messageonehtml += "</div>"
		} else if($(this).hasClass("two")){
			messageonehtml += "";
		} else if($(this).hasClass("three")){
			messageonehtml += "";
		} else if($(this).hasClass("four")){
			messageonehtml += "";
		} else if($(this).hasClass("five")){
			messageonehtml += "";
		}
		$(".message_cont").html("");
		$(".message_cont").html(messageonehtml);
	})
});