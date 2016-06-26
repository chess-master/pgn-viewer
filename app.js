$(function() {

var parsePgn = function(string) {
  var openingToken = ['(', '{'];
  var closingToken = [')', '}'];
  var output = "";
  var count = 0;
  for (var i = 0, len = string.length; i < len; i++) {
    if(openingToken.indexOf(string[i]) !== -1) {
      count++;
    } else if(closingToken.indexOf(string[i]) !== -1) {
      count--;
    } else if(count == 0) {
      output += string[i];
    }
  }
  return output;
};

var squareToHighlight, colorToHighlight, boardEl = $('#board');
var onMoveEnd = function() {
     boardEl.find('.square-' + squareToHighlight)
       .addClass('highlight-' + colorToHighlight);
   };
   var board = ChessBoard('board', {
     position: 'start',
     moveSpeed: 'slow',
     onMoveEnd: onMoveEnd
   });

var timer;

function playGame(pgn) {
  board.start(); //reset board position
  clearTimeout(timer);
  var chess = new Chess();
  var paresedPgn = parsePgn(pgn);
  console.log(paresedPgn);
  chess.load_pgn(paresedPgn);



   var history = chess.history({verbose: true});
   var i = 0;

console.log('length ', history.length);

   var updatePosition = function() {
     var move = history[i];
     console.log(i, move.san, move);
     board.move(move.from + '-' + move.to);

     if (move.color === 'w') {
       boardEl.find('.square-55d63').removeClass('highlight-white');
       boardEl.find('.square-' + move.from).addClass('highlight-white');
       squareToHighlight = move.to;
       colorToHighlight = 'white';
     }
     else {
       boardEl.find('.square-55d63').removeClass('highlight-black');
       boardEl.find('.square-' + move.from).addClass('highlight-black');
       squareToHighlight = move.to;
       colorToHighlight = 'black';
     }


     i++;
     if(i < history.length) {
       timer = setTimeout(updatePosition, 3000);
     }
   };

   updatePosition();


};

$('#pgn-display').on('click', function() {
  playGame($('#pgn').val());
});

});
