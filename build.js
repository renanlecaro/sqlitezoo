const fs = require('fs');
var slugify = require('slugify')
const {execSync} = require("child_process");
const {parse} = require('yaml')


execSync('rm dist/*.html -rf')

let list = parse(fs.readFileSync('./exercises_en.yml').toString())
list.forEach((file, index) => {
    file.path = index ? slugify(index + '_' + file.title, '_') + '.html' : 'index.html'
    if (index > 0) {
        list[index - 1].next = file
    }
})

const menuContent = currentPath => list.map(({
                                                 path,
                                                 title
                                             }) => `<a class="${path === currentPath ? 'active' : ''}" href="${path}">${title}</a>`).join('')

list.forEach(({path, title, intro, goal, db_name, start_query, solution_query, next}) => {


    const nextButton =
        next ? `<a href="${next.path}" class="button" id="next" disabled>NEXT EXERCISE</a>` : ''

    const html = `<!DOCTYPE html>
        <html>
        <head><title>${title}</title>
        <meta name="description" content=${JSON.stringify(intro)}/>
        </head>
        
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤓</text></svg>">
        <link rel="stylesheet" href="style.css">
        <body>
            <nav id="menu"><div class="menu-inner">${menuContent(path)}</div></nav>
            <div id="content">
                <h1>${title}</h1>
                <p>${intro}</p>
                <p><strong>${goal}</strong></p>
                            
                <textarea id="codeInput" data-db="${db_name}">${start_query}</textarea> 
                <div id="solution">${solution_query}</div>
                
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

    fs.writeFileSync('dist/' + path, html)
})
