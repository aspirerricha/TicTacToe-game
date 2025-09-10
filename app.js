let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newGame=document.querySelector("#new-btn");
let  msgContainer=document.querySelector(".msg-container");
let msg=document.querySelector("#msg");
let container=document.querySelector(".container");
let image=document.querySelector("#excitedimg");

let turnO = true;
let count=0;

const win = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 4, 8],
[2, 4, 6],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8]];

container.classList.remove("hidegame");
boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        console.log("box clicked");
        count+=1;
        console.log(count);
        if(turnO){
            box.innerText="O";
            box.style.color="green";
            turnO=false;
        }else{
            box.innerText="X";
            box.style.color="red";
            turnO=true;
        }
        box.disabled=true;
        checkWinner();
        });
});



const disableBoxes=()=>{
    for(let box of boxes){
        box.disabled=true;
    }
}

const enableBoxes=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}

const resetgame=()=>{
    count=0;
    turnO=true;
    enableBoxes();
    msgContainer.classList.add("hide");
    container.classList.remove("hidegame");
    resetbtn.style.display=""
};


const showWinner=(winner)=>{
    msg.innerText=`Congratulations Winner is: ${winner}`;
    image.style.display="block";
    msgContainer.classList.remove("hide");
    disableBoxes();
    container.classList.add("hidegame");
    resetbtn.style.display="none";
};

const checkWinner=()=>{
    if(count===9)
    {
        msg.innerText="Draw";
        msgContainer.classList.remove("hide");
        container.classList.add("hidegame");
        image.style.display="none";
        resetbtn.style.display="none";
        disableBoxes();
    }

    for(let pattern of win){
        let posn1val=boxes[pattern[0]].innerText;
        let posn2val=boxes[pattern[1]].innerText;
        let posn3val=boxes[pattern[2]].innerText;

        if(posn1val!="" && posn2val!="" && posn3val!="")
        {
            if(posn1val===posn2val && posn2val===posn3val)
            {
                showWinner(posn1val);
            } 
        }
    }
};

newGame.addEventListener("click",resetgame);
resetbtn.addEventListener("click",resetgame);
