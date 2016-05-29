$(function(){
	$('.comment').click(function(e){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');
		//判断是否点击了头像，即toId的值是否为空，不为空则修改
		if ($('#toId').length>0) {
			$('#toId').val(toId)

		}
		else{

			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
			}).appendTo('#commentForm');
		}

		if ($('#commentId').length>0) {
			$('#commentId').val(commentId)

		}
		else{
			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentForm');
		}
	});
});

