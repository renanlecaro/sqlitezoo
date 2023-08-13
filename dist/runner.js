const run = document.getElementById('run')
const result = document.getElementById('result')
const solution = document.getElementById('solution')
const codeInput = document.getElementById('codeInput')
const next=document.getElementById('next')
const dbName=codeInput.getAttribute('data-db')
const resetButton = document.getElementById('reset')

const startCode=codeInput.value;
resetButton.addEventListener('click',(e)=>{

    e.preventDefault();
    codeInput.value=startCode;
    refreshResetButtonState();
})

function refreshResetButtonState(){
    if (startCode ===codeInput.value){
        resetButton.setAttribute('disabled','true')
    }else{
        resetButton.removeAttribute('disabled')
    }
}
refreshResetButtonState()
codeInput.addEventListener("input", refreshResetButtonState)


if(next)
    next.setAttribute('disabled','true')

result.innerHTML = "<p>Loading sqlite3 and "+dbName+"..</p>"
run.disabled=true
Promise.all([
	window.sqlite3InitModule(),
	fetch('/dbs/'+dbName).then(r=>r.text())
]).then(([sqlite3, dbcontenttext])=>{

	result.innerHTML = "<p>Setting up db..</p>"
    const db = new sqlite3.oo1.DB({filename:"",flags:'c'});

    function runCommand  (sql) {
        const columnNames=[]
        const resultRows=[];
        db.exec({
            sql,
            columnNames,
            resultRows
        })
        return [
            columnNames,
            ...resultRows.slice(0,1000)
        ]
    }
    runCommand(dbcontenttext)

	const solutionResult=runCommand(solution.textContent)


	result.innerHTML = "<p>Ready</p>"
	run.disabled=false
	run.addEventListener('click', function(e){
		e.preventDefault()
		try{
            const sqlResult=runCommand(codeInput.value)

           const [
                columnNames,
                ...resultRows
            ]= sqlResult

		    const table = document.createElement("table")
		    const thead = document.createElement("thead")
		    table.appendChild(thead)
		    const tr= document.createElement("tr")
		    thead.appendChild(tr)
		    columnNames.forEach(col=>{
		    	const th= document.createElement("th")	
			    tr.appendChild(th)
			    th.textContent=col;
		    })

		    const tbody = document.createElement("tbody")
		    table.appendChild(tbody)
		    resultRows.forEach(row=>{
		    	const tr= document.createElement("tr")
		    	tbody.appendChild(tr)

			    row.forEach(cell=>{
			    	const td= document.createElement("td")	
				    tr.appendChild(td)
				    td.textContent=JSON.stringify(cell);
			    })	
		    })


			result.innerHTML=''
			result.appendChild(table)

			if(next){

                if (JSON.stringify(solutionResult)===JSON.stringify(sqlResult)){
                    next.removeAttribute('disabled')
                }else{
                    next.setAttribute('disabled','true')
                }

            }


		}catch(e){
            console.error(e)
			result.innerHTML=''
            const p = document.createElement('p')
			p.textContent=e.message
            p.className='error'
			result.appendChild(p)
		}

	})
}).catch(e=>result.textContent=e.message)




