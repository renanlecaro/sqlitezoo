const fs = require('fs'); 
 

const files= fs.readdirSync('pages')
	.map(filename=>{
		const content=  fs.readFileSync('pages/'+filename).toString()
		const title = content.split('\n')[0].replace(/<[^>]+>/gi,'').trim()
		return {
			filename, content, title, path:filename.replace(/^[0-9]+_/,'')
		}
	})

files.forEach((file, index)=>{
	if(index>0){
		files[index-1].next=file
	}
})

const menuContent = currentPath=>files.map(({path, title})=>`<a class="${path===currentPath?'active':''}" href="${path}">${title}</a>`).join('')

files.forEach(({path, content, title,next})=>{

	const nextButton=
		next ? `<a href="${next.path}" class="button" id="next" disabled>NEXT EXERCISE</a>`  : ''

	const html= `<!DOCTYPE html>
	<html>
	<head><title>${title}</title></head>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤓</text></svg>">
	<link rel="stylesheet" href="style.css">
	<body>
        <nav id="menu"><div class="menu-inner">${menuContent(path)}</div></nav>
        <div id="content">
            ${content}
            <div class="buttons">
                <button id="reset" class="button" disabled>RESET</button> 
                <button id="run" class="button">RUN QUERY</button> 
                ${nextButton}
                    
            </div>
        </div>
        <div id="result"></div>
        <script src="layout.js"></script>
        <script src="jswasm/sqlite3.js"></script>
        <script src="runner.js"></script>
	</body>
	</html>`

	fs.writeFileSync('dist/'+path, html)
})
