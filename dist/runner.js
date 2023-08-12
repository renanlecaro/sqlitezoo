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
    const db = new sqlite3.oo1.DB();

	db.exec(dbcontenttext);  
	// compute solution
	const solutionRows= []
	db.exec({
		sql:solution.textContent,
        rowMode: 'object',
        resultRows: solutionRows
    })

	result.innerHTML = "<p>Ready</p>"
	run.disabled=false
	run.addEventListener('click', function(e){
		e.preventDefault()
		try{
      		let resultRows = [];
			db.exec({
				sql:codeInput.value, 
		        rowMode: 'object',
		        resultRows: resultRows
		    })
		    if(!resultRows.length) {
		    	result.textContent = "No rows returned"
		    	return
		    } 

			const columns = Object.keys(resultRows[0])

		    const table = document.createElement("table")
		    const thead = document.createElement("thead")
		    table.appendChild(thead)
		    const tr= document.createElement("tr")
		    thead.appendChild(tr)
		    columns.forEach(col=>{
		    	const th= document.createElement("th")	
			    tr.appendChild(th)
			    th.textContent=col;
		    })

		    const tbody = document.createElement("tbody")
		    table.appendChild(tbody)
		    resultRows.forEach(row=>{
		    	const tr= document.createElement("tr")
		    	tbody.appendChild(tr)

			    columns.forEach(col=>{
			    	const td= document.createElement("td")	
				    tr.appendChild(td)
				    td.textContent=JSON.stringify(row[col]);
			    })	
		    })


			result.innerHTML=''
			result.appendChild(table)

			if(next){

                if (JSON.stringify(solutionRows)===JSON.stringify(resultRows)){
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




