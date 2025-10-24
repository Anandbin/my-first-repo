// app.js
(() => {
  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restart');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const resultScreen = document.getElementById('resultScreen');
  const resultMessage = document.getElementById('resultMessage');
  const newGameBtn = document.getElementById('newGameBtn');

  let board = Array(9).fill(null);
  let current = 'X';
  let running = true;
  let scores = { X:0, O:0 };

  const winningLines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function createCells(){
    boardEl.innerHTML='';
    for(let i=0;i<9;i++){
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.index = i;
      cell.addEventListener('click', onCellClick);
      const span = document.createElement('span');
      cell.appendChild(span);
      boardEl.appendChild(cell);
    }
  }

  function onCellClick(e){
    const idx = Number(e.currentTarget.dataset.index);
    if(!running || board[idx]) return;

    board[idx] = current;
    renderCell(idx);
    const outcome = checkOutcome();
    if(outcome){ endRound(outcome); }
    else {
      current = current === 'X' ? 'O' : 'X';
      updateStatus();
    }
  }

  function renderCell(i){
    const cell = boardEl.children[i];
    cell.textContent = board[i];
    cell.classList.add(board[i].toLowerCase());
  }

  function updateStatus(msg){ statusEl.textContent = msg || ('Player ' + current + ' turn'); }

  function checkOutcome(){
    for(const [a,b,c] of winningLines){
      if(board[a] && board[a]===board[b] && board[a]===board[c]) return {winner:board[a], line:[a,b,c]};
    }
    if(board.every(Boolean)) return {draw:true};
    return null;
  }

  function endRound(outcome){
    running = false;
    if(outcome.draw){
      showResult("It's a Draw!");
    } else {
      outcome.line.forEach(i=>boardEl.children[i].classList.add('win'));
      scores[outcome.winner]++;
      scoreXEl.textContent=scores.X;
      scoreOEl.textContent=scores.O;
      showResult(`Player ${outcome.winner} Wins!`);
    }
  }

  function showResult(message){
    resultMessage.textContent = message;
    resultScreen.classList.remove('hidden');
  }

  function hideResult(){
    resultScreen.classList.add('hidden');
  }

  function resetGame(full=false){
    board = Array(9).fill(null);
    running = true;
    current='X';
    Array.from(boardEl.children).forEach(c=>{c.textContent='';c.className='cell';});
    updateStatus();
    if(full){scores={X:0,O:0};scoreXEl.textContent='0';scoreOEl.textContent='0';}
  }

  restartBtn.onclick = ()=>{resetGame();hideResult();};
  newGameBtn.onclick = ()=>{hideResult();resetGame();};

  createCells();
  updateStatus();
})();