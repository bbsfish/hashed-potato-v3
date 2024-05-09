
// 文字サイズチェンジ
$(function() {
    function changeFontSize(buttonID, className) {
        $('html').removeClass('f-small f-large');
        $('html').addClass(className);
        $('#f-size .current').removeClass('current'); // #f-size内の.currentクラスを削除
        $(buttonID).addClass('current');
    }

    // 初期設定
    changeFontSize('#f-small', 'f-small');	// '#f-large', 'f-large'に変更するとデフォルトが大文字に

    $('#f-size #f-small').click(function() { // #f-size内の#f-smallに対するクリックイベント
        changeFontSize('#f-small', 'f-small');
    });

    $('#f-size #f-large').click(function() { // #f-size内の#f-largeに対するクリックイベント
        changeFontSize('#f-large', 'f-large');
    });
});
